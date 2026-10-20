from django.urls import path

from .views import CreateOrderView, OrderDetailView, OrderRequestLookupView


urlpatterns = [
    path('', CreateOrderView.as_view(), name='create-order'),
    path('requests/<uuid:request_id>/', OrderRequestLookupView.as_view(), name='order-request-lookup'),
    path('<uuid:public_id>/', OrderDetailView.as_view(), name='order-detail'),
]
