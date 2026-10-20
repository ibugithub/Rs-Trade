from types import MethodType
from django.contrib.admin import ShowFacets
from django.urls import path, reverse
from .admin_details import enable_record_details


ACCOUNT_APP_LABELS = {'auth', 'users', 'userProfile', 'userprofile'}
ACCOUNT_MODEL_ORDER = {
    'User': 1,
    'Profile': 2,
    'Group': 3,
}
APP_ORDER = {
    'catalog': 1,
    'orders': 2,
    'accounts': 3,
}


def configure_model_admin(model_admin):
    """Shared presentation and list limits for existing and future models."""
    model_admin.change_list_template = 'admin/modern_change_list.html'
    if not model_admin.search_help_text:
        model_admin.search_help_text = f'Search {model_admin.model._meta.verbose_name_plural.lower()}'
    model_admin.list_per_page = 25
    model_admin.list_max_show_all = 25
    model_admin.show_full_result_count = False
    model_admin.show_facets = ShowFacets.NEVER
    enable_record_details(model_admin)


def configure_admin_site(site):
    for model_admin in site._registry.values():
        configure_model_admin(model_admin)

    if getattr(site, '_rs_trade_grouped_app_list', False):
        return

    original_get_app_list = site.get_app_list
    original_get_urls = site.get_urls
    original_register = site.register

    def register(self, model_or_iterable, admin_class=None, **options):
        existing_models = set(self._registry)
        result = original_register(model_or_iterable, admin_class, **options)
        for model in self._registry.keys() - existing_models:
            configure_model_admin(self._registry[model])
        return result

    site.register = MethodType(register, site)

    def get_grouped_app_list(self, request, app_label=None):
        if app_label == 'accounts':
            return [
                app for app in get_grouped_app_list(self, request)
                if app['app_label'] == 'accounts'
            ]

        app_list = original_get_app_list(request, app_label)

        if app_label is not None:
            return app_list

        account_models = []
        has_account_permissions = False
        grouped_apps = []

        for app in app_list:
            if app['app_label'] in ACCOUNT_APP_LABELS:
                account_models.extend(app['models'])
                has_account_permissions = has_account_permissions or app.get('has_module_perms', False)
                continue
            grouped_apps.append(app)

        if account_models:
            account_models.sort(
                key=lambda model: (
                    ACCOUNT_MODEL_ORDER.get(model.get('object_name'), 100),
                    model['name'].lower(),
                )
            )
            grouped_apps.append({
                'name': 'Accounts',
                'app_label': 'accounts',
                'app_url': reverse(f'{self.name}:accounts'),
                'has_module_perms': has_account_permissions,
                'models': account_models,
            })

        grouped_apps.sort(key=lambda app: (APP_ORDER.get(app['app_label'], 100), app['name'].lower()))
        return grouped_apps

    site.get_app_list = MethodType(get_grouped_app_list, site)

    def accounts_view(request):
        return site.app_index(request, 'accounts')

    def get_urls(self):
        return [
            path('accounts/', self.admin_view(accounts_view), name='accounts'),
            *original_get_urls(),
        ]

    site.get_urls = MethodType(get_urls, site)
    site._rs_trade_grouped_app_list = True
