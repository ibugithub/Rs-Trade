from types import MethodType


ACCOUNT_APP_LABELS = {'auth', 'users', 'userProfile', 'userprofile'}
ACCOUNT_MODEL_ORDER = {
    'User': 1,
    'Profile': 2,
    'Group': 3,
}
APP_ORDER = {
    'accounts': 1,
    'catalog': 2,
}


def configure_admin_site(site):
    if getattr(site, '_rs_trade_grouped_app_list', False):
        return

    original_get_app_list = site.get_app_list

    def get_grouped_app_list(self, request, app_label=None):
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
                'app_url': '#',
                'has_module_perms': has_account_permissions,
                'models': account_models,
            })

        grouped_apps.sort(key=lambda app: (APP_ORDER.get(app['app_label'], 100), app['name'].lower()))
        return grouped_apps

    site.get_app_list = MethodType(get_grouped_app_list, site)
    site._rs_trade_grouped_app_list = True
