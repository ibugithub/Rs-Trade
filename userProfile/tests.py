from datetime import datetime, timezone
from unittest.mock import patch

from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from users.models import User
from .models import Profile
from .views import UserProfileView


class UserProfileReadTests(SimpleTestCase):
    def setUp(self):
        self.user = User(id=1, email='client@example.com', name='Client Name', signUp_by='google')
        self.factory = APIRequestFactory()

    def request(self):
        request = self.factory.get('/api/profile/getProfile/')
        force_authenticate(request, user=self.user)
        return UserProfileView.as_view()(request)

    def test_missing_profile_returns_account_without_writing(self):
        with patch.object(Profile.objects, 'get', side_effect=Profile.DoesNotExist), patch.object(Profile, 'save') as save:
            response = self.request()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user'], {
            'email': 'client@example.com', 'name': 'Client Name', 'signUp_by': 'google',
        })
        for field in ('Display_name', 'profile_picture', 'created_at', 'updated_at'):
            self.assertIsNone(response.data[field])
        save.assert_not_called()

    def test_existing_profile_preserves_details(self):
        profile = Profile(user=self.user, Display_name='Display Name', created_at=datetime(2026, 10, 7, tzinfo=timezone.utc), updated_at=datetime(2026, 10, 10, tzinfo=timezone.utc))
        with patch.object(Profile.objects, 'get', return_value=profile):
            response = self.request()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['Display_name'], 'Display Name')
        self.assertIn('2026-10-07', response.data['created_at'])
        self.assertIn('2026-10-10', response.data['updated_at'])

    def test_anonymous_request_cannot_read_profile(self):
        with patch.object(Profile.objects, 'get') as lookup:
            response = UserProfileView.as_view()(self.factory.get('/api/profile/getProfile/'))
        self.assertIn(response.status_code, (401, 403))
        lookup.assert_not_called()
