from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profile', views.CustomerProfileViewSet, basename='customer-profile')
router.register(r'addresses', views.CustomerAddressViewSet, basename='customer-address')
router.register(r'orders', views.CustomerOrderViewSet, basename='customer-order')
router.register(r'wishlist', views.CustomerWishlistViewSet, basename='customer-wishlist')
router.register(r'reviews', views.CustomerReviewViewSet, basename='customer-review')
router.register(r'recommendations', views.CustomerRecommendationViewSet, basename='customer-recommendation')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.customer_dashboard, name='customer_dashboard'),
]

