from django.urls import path

from . import views


urlpatterns = [
    path('products/', views.product_list, name='catalog-products'),
    path('products/<int:pk>/', views.product_detail, name='catalog-product'),
]
