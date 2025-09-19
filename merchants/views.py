from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import MerchantProfile, MerchantProduct, MerchantOrder, OrderItem, MerchantAnalytics
from .serializers import (
    MerchantProfileSerializer, MerchantProductSerializer, MerchantOrderSerializer,
    OrderItemSerializer, MerchantAnalyticsSerializer
)


class MerchantProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for merchant profiles
    """
    serializer_class = MerchantProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MerchantProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MerchantProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for merchant products
    """
    serializer_class = MerchantProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        merchant_profile = MerchantProfile.objects.get(user=self.request.user)
        return MerchantProduct.objects.filter(merchant=merchant_profile)
    
    def perform_create(self, serializer):
        merchant_profile = MerchantProfile.objects.get(user=self.request.user)
        serializer.save(merchant=merchant_profile)


class MerchantOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for merchant orders (read-only)
    """
    serializer_class = MerchantOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        merchant_profile = MerchantProfile.objects.get(user=self.request.user)
        return MerchantOrder.objects.filter(merchant=merchant_profile)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update order status
        """
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in MerchantOrder.ORDER_STATUS_CHOICES]:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        return Response({'message': 'Order status updated successfully'})


class MerchantAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for merchant analytics
    """
    serializer_class = MerchantAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        merchant_profile = MerchantProfile.objects.get(user=self.request.user)
        return MerchantAnalytics.objects.filter(merchant=merchant_profile)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def merchant_dashboard(request):
    """
    Get merchant dashboard data
    """
    try:
        merchant_profile = MerchantProfile.objects.get(user=request.user)
    except MerchantProfile.DoesNotExist:
        return Response({'error': 'Merchant profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get date ranges
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Sales metrics
    total_orders = MerchantOrder.objects.filter(merchant=merchant_profile).count()
    week_orders = MerchantOrder.objects.filter(merchant=merchant_profile, created_at__date__gte=week_ago).count()
    month_orders = MerchantOrder.objects.filter(merchant=merchant_profile, created_at__date__gte=month_ago).count()
    
    total_revenue = MerchantOrder.objects.filter(merchant=merchant_profile).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    week_revenue = MerchantOrder.objects.filter(
        merchant=merchant_profile, 
        created_at__date__gte=week_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    month_revenue = MerchantOrder.objects.filter(
        merchant=merchant_profile, 
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Product metrics
    total_products = MerchantProduct.objects.filter(merchant=merchant_profile).count()
    active_products = MerchantProduct.objects.filter(merchant=merchant_profile, is_active=True).count()
    low_stock_products = MerchantProduct.objects.filter(
        merchant=merchant_profile, 
        stock_quantity__lt=10
    ).count()
    
    # Recent orders
    recent_orders = MerchantOrder.objects.filter(merchant=merchant_profile)[:5]
    
    # Top products
    top_products = OrderItem.objects.filter(
        order__merchant=merchant_profile
    ).values('product__name').annotate(
        total_sold=Sum('quantity')
    ).order_by('-total_sold')[:5]
    
    dashboard_data = {
        'merchant_info': {
            'business_name': merchant_profile.business_name,
            'is_verified': merchant_profile.is_verified,
            'is_active': merchant_profile.is_active,
        },
        'sales_metrics': {
            'total_orders': total_orders,
            'week_orders': week_orders,
            'month_orders': month_orders,
            'total_revenue': float(total_revenue),
            'week_revenue': float(week_revenue),
            'month_revenue': float(month_revenue),
        },
        'product_metrics': {
            'total_products': total_products,
            'active_products': active_products,
            'low_stock_products': low_stock_products,
        },
        'recent_orders': MerchantOrderSerializer(recent_orders, many=True).data,
        'top_products': list(top_products),
    }
    
    return Response(dashboard_data)

