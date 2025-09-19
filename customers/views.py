from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import (
    CustomerProfile, CustomerAddress, CustomerOrder, OrderItem, 
    CustomerWishlist, CustomerReview, CustomerRecommendation
)
from .serializers import (
    CustomerProfileSerializer, CustomerAddressSerializer, CustomerOrderSerializer,
    OrderItemSerializer, CustomerWishlistSerializer, CustomerReviewSerializer,
    CustomerRecommendationSerializer
)


class CustomerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer profiles
    """
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer addresses
    """
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerAddress.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer_profile)


class CustomerOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for customer orders (read-only)
    """
    serializer_class = CustomerOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerOrder.objects.filter(customer=customer_profile)


class CustomerWishlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer wishlist
    """
    serializer_class = CustomerWishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerWishlist.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer_profile)


class CustomerReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for customer reviews
    """
    serializer_class = CustomerReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerReview.objects.filter(customer=customer_profile)
    
    def perform_create(self, serializer):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        serializer.save(customer=customer_profile)


class CustomerRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for customer recommendations (read-only)
    """
    serializer_class = CustomerRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        customer_profile = CustomerProfile.objects.get(user=self.request.user)
        return CustomerRecommendation.objects.filter(customer=customer_profile)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def customer_dashboard(request):
    """
    Get customer dashboard data
    """
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get date ranges
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)
    
    # Order metrics
    total_orders = CustomerOrder.objects.filter(customer=customer_profile).count()
    month_orders = CustomerOrder.objects.filter(
        customer=customer_profile, 
        created_at__date__gte=month_ago
    ).count()
    
    total_spent = CustomerOrder.objects.filter(customer=customer_profile).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    month_spent = CustomerOrder.objects.filter(
        customer=customer_profile, 
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Wishlist and reviews
    wishlist_count = CustomerWishlist.objects.filter(customer=customer_profile).count()
    reviews_count = CustomerReview.objects.filter(customer=customer_profile).count()
    
    # Recent orders
    recent_orders = CustomerOrder.objects.filter(customer=customer_profile)[:5]
    
    # Recent recommendations
    recent_recommendations = CustomerRecommendation.objects.filter(
        customer=customer_profile
    ).order_by('-confidence_score')[:5]
    
    # Eco-friendly stats
    eco_orders = CustomerOrder.objects.filter(
        customer=customer_profile,
        items__product__is_eco_friendly=True
    ).distinct().count()
    
    dashboard_data = {
        'customer_info': {
            'user_email': customer_profile.user.email,
            'user_name': f"{customer_profile.user.first_name} {customer_profile.user.last_name}",
            'city': customer_profile.city,
            'budget_range': customer_profile.budget_range,
        },
        'order_metrics': {
            'total_orders': total_orders,
            'month_orders': month_orders,
            'total_spent': float(total_spent),
            'month_spent': float(month_spent),
            'eco_orders': eco_orders,
        },
        'activity_metrics': {
            'wishlist_count': wishlist_count,
            'reviews_count': reviews_count,
        },
        'recent_orders': CustomerOrderSerializer(recent_orders, many=True).data,
        'recent_recommendations': CustomerRecommendationSerializer(recent_recommendations, many=True).data,
    }
    
    return Response(dashboard_data)












