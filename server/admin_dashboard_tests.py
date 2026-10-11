"""Admin checks run with isolated settings, never the production database."""
from copy import copy
from types import ModuleType, SimpleNamespace
from unittest.mock import patch

from django.contrib import admin
from django.template.loader import render_to_string
from django.template import Context, Template
from django.test import RequestFactory, SimpleTestCase, TestCase, override_settings
from django.db import connection
from django.test.utils import CaptureQueriesContext, isolate_apps
from django.urls import path

from .admin_site import configure_admin_site
from users.models import User
from catalog.models import Category, Product, SubCategory
from userProfile.models import Profile


configure_admin_site(admin.site)
urlpatterns = [path('admin/', admin.site.urls)]


@override_settings(ROOT_URLCONF='server.admin_dashboard_tests')
class AdminChangeListTests(TestCase):
    def setUp(self):
        configure_admin_site(admin.site)
        staff = User.objects.create_superuser(
            email='admin@example.com', name='Test Administrator', password='test-password-only',
        )
        self.client.force_login(staff)

    def test_users_list_renders(self):
        response = self.client.get('/admin/users/user/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'admin@example.com')
        self.assertContains(response, '/admin/users/user/add/')

    def test_categories_list_renders(self):
        Category.objects.create(name='Test Category', slug='test-category')
        response = self.client.get('/admin/catalog/category/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Category')
        self.assertContains(response, '/admin/catalog/category/add/')

    def test_product_list_related_queries_do_not_grow_per_row(self):
        category = Category.objects.create(name='Electronics', slug='electronics')
        subcategory = SubCategory.objects.create(
            category=category, name='Audio', slug='audio',
        )
        Product.objects.bulk_create([
            Product(
                category=category, subcategory=subcategory,
                name='Test speaker', slug='test-speaker', price='1200.00',
            ),
            Product(
                category=category, name='Without subcategory',
                slug='without-subcategory', price='1000.00',
            ),
        ])
        with CaptureQueriesContext(connection) as initial_queries:
            initial = self.client.get('/admin/catalog/product/')
        self.assertEqual(initial.status_code, 200)
        self.assertContains(initial, 'Electronics / Audio')
        self.assertContains(initial, 'Without subcategory')
        Product.objects.bulk_create([
            Product(
                category=category, subcategory=subcategory,
                name=f'Speaker {index}', slug=f'speaker-{index}', price='1200.00',
            )
            for index in range(8)
        ])
        with CaptureQueriesContext(connection) as expanded_queries:
            expanded = self.client.get('/admin/catalog/product/')
        self.assertEqual(expanded.status_code, 200)
        self.assertEqual(len(expanded_queries), len(initial_queries))

    def test_product_filter_queries_do_not_grow_with_subcategories(self):
        category = Category.objects.create(name='Filter Category', slug='filter-category')
        SubCategory.objects.create(category=category, name='First', slug='first')
        with CaptureQueriesContext(connection) as initial_queries:
            self.client.get('/admin/catalog/product/')
        SubCategory.objects.bulk_create([
            SubCategory(category=category, name=f'Option {index}', slug=f'option-{index}')
            for index in range(8)
        ])
        with CaptureQueriesContext(connection) as expanded_queries:
            response = self.client.get('/admin/catalog/product/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Filter Category / Option 7')
        self.assertEqual(len(expanded_queries), len(initial_queries))

        subcategory = SubCategory.objects.get(slug='option-7')
        Product.objects.bulk_create([
            Product(
                category=category, subcategory=subcategory,
                name='Filtered product', slug='filtered-product', price='1200.00',
            ),
            Product(
                category=category, name='Other product',
                slug='other-product', price='1000.00',
            ),
        ])
        filtered = self.client.get('/admin/catalog/product/', {
            'subcategory__id__exact': subcategory.pk,
        })
        self.assertContains(filtered, 'Filtered product')
        self.assertNotContains(filtered, 'Other product')

    def test_category_count_queries_do_not_grow_with_rows(self):
        category = Category.objects.create(name='Count Category', slug='count-category')
        SubCategory.objects.create(category=category, name='First', slug='first')
        with CaptureQueriesContext(connection) as initial_queries:
            self.client.get('/admin/catalog/category/')
        Category.objects.bulk_create([
            Category(name=f'Category {index}', slug=f'category-{index}')
            for index in range(8)
        ])
        with CaptureQueriesContext(connection) as expanded_queries:
            response = self.client.get('/admin/catalog/category/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(expanded_queries), len(initial_queries))
        category_admin = admin.site.get_model_admin(Category)
        annotated_category = category_admin.get_queryset(response.wsgi_request).get(pk=category.pk)
        with self.assertNumQueries(0):
            self.assertEqual(category_admin.subcategory_count(annotated_category), 1)

    def test_product_list_is_paginated_and_retains_inline_editing(self):
        category = Category.objects.create(name='Page Category', slug='page-category')
        Product.objects.bulk_create([
            Product(
                category=category, name=f'Item {index}',
                slug=f'item-{index}', price='1200.00',
            )
            for index in range(30)
        ])
        response = self.client.get('/admin/catalog/product/')
        changelist = response.context['cl']
        self.assertEqual(len(changelist.result_list), 25)
        self.assertEqual(changelist.result_count, 30)
        self.assertFalse(changelist.show_full_result_count)
        self.assertFalse(changelist.is_facets_optional)
        self.assertContains(response, 'form-TOTAL_FORMS')
        self.assertContains(response, 'name="form-0-price"')

    def test_product_list_design_preserves_filters_search_and_add_links(self):
        response = self.client.get('/admin/catalog/product/')
        self.assertContains(response, '<h1>Products</h1>')
        self.assertContains(response, '/static/admin/css/admin_lists.css')
        self.assertContains(response, 'placeholder="Search by name, SKU or description"')
        self.assertContains(response, '/admin/catalog/product/add/')
        self.assertNotContains(response, 'id="nav-sidebar"')
        self.assertContains(response, '<details data-filter-title="status">')
        filtered = self.client.get('/admin/catalog/product/', {'status__exact': 'active'})
        self.assertContains(filtered, '<details data-filter-title="status" open>')
        self.assertContains(filtered, 'name="status__exact" value="active"')

    def test_all_registered_management_lists_use_the_shared_design(self):
        for model in admin.site._registry:
            with self.subTest(model=model.__name__):
                opts = model._meta
                response = self.client.get(f'/admin/{opts.app_label}/{opts.model_name}/')
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, 'rs-admin-list')
                self.assertContains(response, '/static/admin/css/admin_lists.css')
                self.assertContains(response, f'<h1>{str(opts.verbose_name_plural).capitalize()}</h1>')
                self.assertNotContains(response, 'id="nav-sidebar"')
                self.assertContains(response, f'/admin/{opts.app_label}/{opts.model_name}/add/')
                self.assertContains(response, 'csrfmiddlewaretoken')
                self.assertContains(response, 'id="changelist-search"')

    def test_all_registered_add_forms_use_shared_design_and_native_controls(self):
        for model in admin.site._registry:
            with self.subTest(model=model.__name__):
                opts = model._meta
                response = self.client.get(f'/admin/{opts.app_label}/{opts.model_name}/add/')
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, 'rs-admin-form')
                self.assertContains(response, '/static/admin/css/admin_forms.css')
                self.assertContains(response, 'csrfmiddlewaretoken')
                self.assertContains(response, 'name="_save"')
                self.assertNotContains(response, 'id="nav-sidebar"')
                self.assertContains(response, f'Back to {str(opts.verbose_name_plural).capitalize()}')

    def test_category_add_validation_and_inline_save_are_preserved(self):
        url = '/admin/catalog/category/add/'
        payload = {
            'name': '', 'slug': '', 'description': 'Test description',
            'is_active': 'on', '_save': 'Save',
            'subcategories-TOTAL_FORMS': '1',
            'subcategories-INITIAL_FORMS': '0',
            'subcategories-MIN_NUM_FORMS': '0',
            'subcategories-MAX_NUM_FORMS': '1000',
            'subcategories-0-name': 'Test subcategory',
            'subcategories-0-slug': '',
            'subcategories-0-is_active': 'on',
        }
        invalid = self.client.post(url, payload)
        self.assertEqual(invalid.status_code, 200)
        self.assertContains(invalid, 'This field is required.')
        self.assertContains(invalid, 'admin_forms.css')
        self.assertEqual(Category.objects.count(), 0)
        payload['name'] = 'Created from modern form'
        saved = self.client.post(url, payload)
        self.assertEqual(saved.status_code, 302)
        category = Category.objects.get(name='Created from modern form')
        self.assertEqual(category.subcategories.get().name, 'Test subcategory')
        edit = self.client.get(f'/admin/catalog/category/{category.pk}/change/')
        self.assertEqual(edit.status_code, 200)
        self.assertContains(edit, 'rs-admin-form')
        self.assertContains(edit, 'name="_continue"')

    def test_shared_design_respects_view_only_add_permissions(self):
        with patch.object(User, 'has_module_perms', lambda user, app: app == 'catalog'):
            with patch.object(User, 'has_perm', lambda user, permission, obj=None: permission == 'catalog.view_product'):
                response = self.client.get('/admin/catalog/product/')
                self.assertEqual(response.status_code, 200)
                self.assertNotContains(response, '/admin/catalog/product/add/')
                self.assertContains(response, '<h1>Products</h1>')

    @isolate_apps('catalog')
    def test_future_admin_registration_inherits_design_and_dashboard_card(self):
        class FutureCategory(Category):
            class Meta:
                proxy = True
                app_label = 'catalog'
                verbose_name = 'future feature'
                verbose_name_plural = 'future features'

        future_site = admin.AdminSite(name='future_admin')
        configure_admin_site(future_site)
        future_site.register(FutureCategory, search_fields=('name',))
        future_admin = future_site.get_model_admin(FutureCategory)
        self.assertEqual(future_admin.change_list_template, 'admin/modern_change_list.html')
        self.assertEqual(future_admin.list_per_page, 25)
        self.assertFalse(future_admin.show_full_result_count)

        urlconf = ModuleType('future_admin_test_urls')
        urlconf.urlpatterns = [path('future-admin/', future_site.urls)]
        with override_settings(ROOT_URLCONF=urlconf):
            response = self.client.get('/future-admin/catalog/futurecategory/')
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, '<h1>Future features</h1>')
            self.assertContains(response, '/static/admin/css/admin_lists.css')
            self.assertContains(response, 'View and update your future features.')
            self.assertContains(response, 'placeholder="Search future features"')
            dashboard = self.client.get('/future-admin/')
            self.assertEqual(dashboard.status_code, 200)
            self.assertContains(dashboard, 'class="rs-card rs-model-card"')
            self.assertContains(dashboard, '/future-admin/catalog/futurecategory/')
            self.assertContains(dashboard, '/future-admin/catalog/futurecategory/add/')
            add_page = self.client.get('/future-admin/catalog/futurecategory/add/')
            self.assertEqual(add_page.status_code, 200)
            self.assertContains(add_page, 'rs-admin-form')
            self.assertContains(add_page, 'admin_forms.css')

    def test_profile_search_and_autocomplete_avoid_full_user_dropdown(self):
        user = User.objects.create_user(
            email='customer@example.com', name='Searchable Customer',
            password='test-password-only',
        )
        Profile.objects.create(user=user, Display_name='Customer')
        response = self.client.get('/admin/userProfile/profile/', {'q': 'customer@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'customer@example.com')
        self.assertNotContains(response, 'By user')
        add_page = self.client.get('/admin/userProfile/profile/add/')
        self.assertEqual(add_page.status_code, 200)
        self.assertContains(add_page, 'admin-autocomplete')
        autocomplete = self.client.get('/admin/autocomplete/', {
            'app_label': 'userProfile', 'model_name': 'profile',
            'field_name': 'user', 'term': 'Searchable',
        })
        self.assertEqual(autocomplete.status_code, 200)
        self.assertEqual(autocomplete.json()['results'], [
            {'id': str(user.pk), 'text': 'customer@example.com'},
        ])


    def test_workspace_pages_open_with_management_links(self):
        dashboard = self.client.get('/admin/')
        self.assertEqual(dashboard.status_code, 200)
        self.assertContains(dashboard, 'href="/admin/users/user/"')
        self.assertContains(dashboard, 'href="/admin/catalog/product/"')
        self.assertContains(dashboard, 'href="/admin/catalog/product/add/"')
        self.assertNotContains(dashboard, 'rs-model-row')
        accounts = self.client.get('/admin/accounts/')
        self.assertEqual(accounts.status_code, 200)
        self.assertContains(accounts, '/admin/users/user/')
        self.assertContains(accounts, '/admin/userProfile/profile/')
        self.assertContains(accounts, '/admin/auth/group/')
        self.assertNotContains(accounts, 'id="activity-title"')
        catalog = self.client.get('/admin/catalog/')
        self.assertEqual(catalog.status_code, 200)
        self.assertContains(catalog, '/admin/catalog/product/add/')

    def test_accounts_workspace_requires_login_and_model_permissions(self):
        staff = User.objects.create_user(
            email='catalog-staff@example.com', name='Catalog Staff',
            password='test-password-only', is_admin=True,
        )
        self.client.force_login(staff)
        with patch.object(User, 'has_module_perms', lambda user, app: app == 'catalog'):
            with patch.object(User, 'has_perm', lambda user, permission, obj=None: permission == 'catalog.view_product'):
                self.assertEqual(self.client.get('/admin/accounts/').status_code, 404)
                self.assertEqual(self.client.get('/admin/catalog/').status_code, 200)
        self.client.logout()
        response = self.client.get('/admin/accounts/')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)


class RecentActivity:
    def __init__(self):
        self.entries = []

    def filter(self, **kwargs):
        self.user_filter = kwargs
        return self

    def __getitem__(self, limit):
        return self.entries[limit]


@override_settings(ROOT_URLCONF='server.admin_dashboard_tests')
class AdminDashboardTests(SimpleTestCase):
    def test_template_context_copy_keeps_independent_variable_stack(self):
        original = Context({'title': 'Admin'})
        duplicate = copy(original)
        self.assertEqual(duplicate['title'], 'Admin')
        self.assertIsNot(original.dicts, duplicate.dicts)
        duplicate.push({'title': 'Copied'})
        self.assertEqual(original['title'], 'Admin')

    def test_user_and_category_changelist_tools_render_without_context_copy_errors(self):
        template = Template('{% load admin_list %}{% change_list_object_tools %}')
        for model in (User, Category):
            with self.subTest(model=model.__name__):
                opts = model._meta
                html = template.render(Context({
                    'opts': opts,
                    'cl': SimpleNamespace(opts=opts),
                    'has_add_permission': True,
                    'is_popup': False,
                    'preserved_filters': '',
                }))
                self.assertIn(f'/admin/{opts.app_label}/{opts.model_name}/add/', html)

    def setUp(self):
        configure_admin_site(admin.site)
        self.log = RecentActivity()
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
        self.assertEqual(accounts['app_url'], '/admin/accounts/')
        self.assertEqual([model['object_name'] for model in accounts['models']], ['User', 'Profile', 'Group'])
        html = self.render()
        self.assertIn('href="/admin/catalog/product/"', html)
        self.assertIn('href="/admin/users/user/"', html)
        self.assertEqual(html.count('class="rs-card rs-model-card"'), sum(len(app['models']) for app in apps))
        for app in apps:
            for model in app['models']:
                self.assertIn(f'href="{model["admin_url"]}"', html)
                self.assertIn(f'href="{model["add_url"]}"', html)
        self.assertNotIn('rs-model-row', html)
        self.assertIn('id="app-accounts"', html)
        self.assertIn('rs-dashboard-layout', html)

    def test_view_only_staff_get_no_add_links_or_unavailable_sections(self):
        self.user.has_module_perms = lambda app: app == 'catalog'
        self.user.has_perm = lambda permission: permission == 'catalog.view_product'
        overview = self.render()
        self.assertIn('href="/admin/catalog/product/"', overview)
        self.assertIn('aria-label="View Products"', overview)
        self.assertNotIn('/admin/catalog/product/add/', overview)
        self.assertNotIn('id="app-accounts"', overview)
        self.assertNotIn('href="/admin/accounts/"', overview)
        html = self.render(app_label='catalog', app_list=admin.site.get_app_list(self.request, 'catalog'))
        self.assertIn('aria-label="View Products"', html)
        self.assertNotIn('/admin/catalog/product/add/', html)
        self.assertNotIn('id="app-accounts"', html)
        self.assertNotIn('/admin/catalog/category/', html)

    def test_no_permissions_show_useful_empty_state(self):
        self.user.has_module_perms = lambda app: False
        html = self.render()
        self.assertIn('No management sections available', html)

    def test_header_uses_light_theme_and_preserves_post_logout_csrf(self):
        html = self.render()
        self.assertIn('/static/admin/css/custom_admin.css?v=20261011-7', html)
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

    def test_dashboard_omits_redundant_panels_and_duplicate_website_link(self):
        html = self.render()
        self.assertEqual(html.count('id="activity-title"'), 1)
        self.assertIn('No recent changes yet.', html)
        self.assertEqual(self.log.user_filter, {'user__pk': self.user.pk})
        self.assertNotIn('Catalog workspace', html)
        self.assertNotIn('RS Trade workspace', html)
        self.assertEqual(html.count('View website'), 1)
        self.assertIn('class="rs-button rs-button--primary" href="/"', html)
        navigation = html.split('id="user-tools"', 1)[1].split('</div>', 1)[0]
        self.assertNotIn('View website', navigation)
        self.assertEqual(html.count('id="dashboard-title"'), 1)
