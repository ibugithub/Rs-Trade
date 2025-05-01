from django.urls import path
from .views import UserProfileView, ChangePasswordView

urlpatterns = [
    path('getProfile/', UserProfileView.as_view(), name='user-profile'),
    path('changePassword/', ChangePasswordView.as_view(), name='change-password'),
]
