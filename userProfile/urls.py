from django.urls import path
from .views import UserProfileView, ChangePasswordView, UpdateNameView
from .address_views import AddressBookView

urlpatterns = [
    path('addresses/', AddressBookView.as_view(), name='address-book'),
    path('getProfile/', UserProfileView.as_view(), name='user-profile'),
    path('updateName/', UpdateNameView.as_view(), name='update-name'),
    path('changePassword/', ChangePasswordView.as_view(), name='change-password'),
]
