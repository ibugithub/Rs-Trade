from unittest.mock import patch

from django.apps import apps
from django.contrib import admin
from django.test import TestCase
from django.urls import resolve
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from catalog.models import Product
from orders.models import Order
from users.models import User


class CommerceAuthCompatibilityTests(TestCase):
    def test_commerce_apps_and_api_routes_are_preserved(self):
        for label in ['catalog', 'orders', 'notifications', 'service_requests']:
            self.assertTrue(apps.is_installed(label))
        for path, name in [
            ('/api/catalog/products/', 'catalog-products'),
            ('/api/cart/', 'account-cart'), ('/api/orders/', 'create-order'),
            ('/api/service-requests/', 'create-service-request'),
            ('/api/profile/addresses/', 'address-book'),
        ]:
            self.assertEqual(resolve(path).url_name, name)

    def test_product_listing_remains_public(self):
        self.assertEqual(self.client.get('/api/catalog/products/').status_code, 200)

    def test_customer_cart_orders_and_addresses_still_accept_jwt(self):
        user = User.objects.create_user('customer@example.com', 'Customer', is_verified=True)
        api = APIClient()
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(user).access_token}')
        for path in ['/api/cart/', '/api/orders/', '/api/profile/addresses/']:
            self.assertEqual(api.get(path).status_code, 200, path)

    def test_commerce_admin_models_and_pages_remain_available(self):
        user = User.objects.create_superuser('owner@example.com', 'Owner', 'Owner-horse-729!')
        self.client.force_login(user)
        for path in ['/admin/', '/admin/catalog/product/', '/admin/orders/order/']:
            self.assertEqual(self.client.get(path).status_code, 200, path)
        self.assertTrue(admin.site.is_registered(Product))
        self.assertTrue(admin.site.is_registered(Order))

    @patch('users.google.requests.get')
    @patch('users.google.requests.post')
    @patch.dict('os.environ', {'GOOGLE_CLIENT_ID': 'example', 'GOOGLE_CLIENT_SECRET': 'example'})
    def test_customer_google_login_keeps_the_original_jwt_response(self, post, get):
        post.return_value.json.return_value = {'access_token': 'provider-token'}
        get.return_value.json.return_value = {'email': 'google@example.com', 'email_verified': True, 'name': 'Google Customer'}
        response = APIClient().post('/api/users/getGoogleUsrInfo/', {'code': 'example'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue({'accessToken', 'refreshToken', 'user'}.issubset(response.data))
        self.assertFalse(User.objects.get(email='google@example.com').is_staff)

    def test_non_throttled_signup_errors_keep_the_legacy_shape(self):
        response = APIClient().post('/api/users/create/', {})
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)
