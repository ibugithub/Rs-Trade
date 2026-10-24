from django import forms


class PermissionPicker(forms.SelectMultiple):
    template_name = 'admin/widgets/permission_picker.html'

    class Media:
        css = {'all': ('admin/css/permission_picker.css',)}
        js = ('admin/js/permission_picker.js',)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        features = {}
        for _, options, _ in context['widget']['optgroups']:
            for option in options:
                permission = option['value'].instance
                content_type = permission.content_type
                model = content_type.model_class()
                feature = str(model._meta.verbose_name_plural) if model else content_type.model
                if (content_type.app_label, content_type.model) == ('service_requests', 'servicerequest'):
                    feature = 'All service requests'
                app = model._meta.app_config.verbose_name if model else content_type.app_label
                key = (str(app), feature)
                group = features.setdefault(key, {'app': app, 'name': feature, 'options': []})
                action = permission.codename.split('_', 1)[0]
                option['action'] = {
                    'view': 'View', 'add': 'Add', 'change': 'Edit', 'delete': 'Delete',
                }.get(action, permission.name)
                group['options'].append(option)
        context['features'] = [features[key] for key in sorted(features)]
        for feature in context['features']:
            feature['options'].sort(key=lambda option: {
                'View': 0, 'Add': 1, 'Edit': 2, 'Delete': 3,
            }.get(option['action'], 4))
        return context
