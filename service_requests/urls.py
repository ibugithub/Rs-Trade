from django.urls import path
from .views import CreateServiceRequestView

urlpatterns = [path('', CreateServiceRequestView.as_view(), name='create-service-request')]
