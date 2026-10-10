"""Admin presentation checks. SimpleTestCase prohibits database access."""
from datetime import datetime, timezone
from types import SimpleNamespace

from django.contrib import admin
from django.template.loader import render_to_string
from django.test import RequestFactory, SimpleTestCase, override_settings
from django.urls import path

from .admin_site import configure_admin_site


urlpatterns = [path('admin/', admin.site.urls)]


class EmptyActivity:
    def __init__(self, entries=None):
        self.entries = entries or []

    def filter(self, **kwargs):
        self.user_filter = kwargs
        return self

    def __getitem__(self, limit):
        return self.entries[limit]


@override_settings(ROOT_URLCONF='server.admin_dashboard_tests')
class AdminDashboardTests(SimpleTestCase):
    def setUp(self):
        configure_admin_site(admin.site)
        self.log = EmptyActivity()
        self.user = SimpleNamespace(
            pk=7,
            is_active=True,
            is_staff=True,
            is_authenticated=True,
            get_short_name=lambda: 'Staff Member',
            get_username=lambda: 'staff@example.com',
            has_usable_password=lambda: True,
            has_module_perms=lambda app: True,
            has_perm=lambda permission: True,
        )
        self.request = RequestFactory().get('/admin/')
        self.request.user = self.user

    def context(self, **overrides):
        return {
            'title': 'Operations Dashboard',
            'app_list': admin.site.get_app_list(self.request),
            'user': self.user,
            'has_permission': True,
            'site_url': '/',
            'log_entries': self.log,
            'is_nav_sidebar_enabled': True,
            **overrides,
        }

    def render(self, **overrides):
        return render_to_string('admin/index.html', self.context(**overrides), request=self.request)

    def test_catalog_first_accounts_grouped_and_links_resolve(self):
        apps = admin.site.get_app_list(self.request)
        self.assertEqual(apps[0]['app_label'], 'catalog')
        accounts = next(app for app in apps if app['app_label'] == 'accounts')
        self.assertEqual(accounts['app_url'], '/admin/#app-accounts')
        self.assertEqual([model['object_name'] for model in accounts['models']], ['User', 'Profile', 'Group'])
        html = self.render()
        self.assertIn('href="/admin/catalog/product/"', html)
        self.assertIn('href="/admin/catalog/product/add/"', html)
        self.assertIn('id="app-accounts"', html)
        self.assertIn('rs-dashboard-layout', html)

    def test_view_only_staff_get_no_add_links_or_unavailable_sections(self):
        self.user.has_module_perms = lambda app: app == 'catalog'
        self.user.has_perm = lambda permission: permission == 'catalog.view_product'
        html = self.render()
        self.assertIn('aria-label="View Products"', html)
        self.assertNotIn('/admin/catalog/product/add/', html)
        self.assertNotIn('id="app-accounts"', html)
        self.assertNotIn('/admin/catalog/category/', html)

    def test_no_permissions_and_activity_show_useful_empty_states(self):
        self.user.has_module_perms = lambda app: False
        html = self.render()
        self.assertIn('No management sections available', html)
        self.assertIn('No recent changes', html)
        self.assertEqual(self.log.user_filter, {'user__pk': self.user.pk})

    def test_header_uses_light_theme_and_preserves_post_logout_csrf(self):
        html = self.render()
        self.assertIn('/static/admin/css/custom_admin.css?v=20261010-2', html)
        self.assertIn('<svg width="25" height="25"', html)
        self.assertLess(html.index('/static/admin/css/responsive.css'), html.index('/static/admin/css/custom_admin.css'))
        self.assertNotIn('dark_mode.css', html)
        self.assertNotIn('admin/js/theme.js', html)
        self.assertIn('method="post" action="/admin/logout/"', html)
        self.assertIn('csrfmiddlewaretoken', html)
        self.assertIn('/admin/password_change/', html)

    def test_app_index_retains_breadcrumbs_and_omits_global_activity(self):
        apps = admin.site.get_app_list(self.request, 'catalog')
        html = render_to_string('admin/app_index.html', self.context(app_list=apps, app_label='catalog'), request=self.request)
        self.assertIn('aria-label="Breadcrumbs"', html)
        self.assertIn('rs-dashboard-layout--app', html)
        self.assertNotIn('id="activity-title"', html)

    def test_recent_activity_names_are_escaped_and_deleted_records_are_not_linked(self):
        entry = SimpleNamespace(
            is_addition=False,
            is_change=False,
            is_deletion=True,
            object_repr='<script>unsafe()</script>',
            content_type=SimpleNamespace(name='product'),
            action_time=datetime(2026, 10, 10, tzinfo=timezone.utc),
            get_admin_url='/admin/catalog/product/1/change/',
        )
        self.log.entries = [entry]
        html = self.render()
        self.assertIn('&lt;script&gt;unsafe()&lt;/script&gt;', html)
        self.assertNotIn('<script>unsafe()', html)
        self.assertNotIn('href="/admin/catalog/product/1/change/"', html)
