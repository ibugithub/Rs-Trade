from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.urls import reverse
from django.utils.html import format_html
from django import forms
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import Group
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.db.models import Q
from userProfile.models import Address, Profile
from .models import User
from .widgets import PermissionPicker


def dashboard_permissions(queryset, request, site):
    """Offer only permissions backed by an available admin action."""
    # Notifications use custom endpoints rather than a model admin.
    available = Q(content_type__app_label='notifications', content_type__model='notification', codename='view_notification')
    for model, model_admin in site._registry.items():
        actions = [
            f'{action}_{model._meta.model_name}'
            for action in ('view', 'add', 'change', 'delete')
            if getattr(model_admin, f'has_{action}_permission')(request)
        ]
        available |= Q(
            content_type__app_label=model._meta.app_label,
            content_type__model=model._meta.model_name,
            codename__in=actions,
        )
    return queryset.filter(available).select_related('content_type')


class UserDetailsPermissions:
    def has_view_permission(self, request, obj=None):
        return request.user.has_perm('users.view_user') or request.user.has_perm('users.change_user')

    def has_change_permission(self, request, obj=None):
        return self.admin_site._registry[User].has_change_permission(request, obj)

    def has_add_permission(self, request, obj=None):
        parent = self.admin_site._registry[User]
        return parent.has_change_permission(request, obj) if obj else parent.has_add_permission(request)


class UserProfileInline(UserDetailsPermissions, admin.StackedInline):
    model = Profile
    verbose_name = 'Additional details'
    verbose_name_plural = 'Additional details'
    fields = ('Display_name', 'profile_picture', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    extra = 0
    max_num = 1
    can_delete = False

    def get_extra(self, request, obj=None, **kwargs):
        if obj is None:
            return 1
        try:
            obj.profile
        except Profile.DoesNotExist:
            return 1
        return 0


class UserAddressInline(UserDetailsPermissions, admin.StackedInline):
    model = Address
    verbose_name = 'Saved address'
    verbose_name_plural = 'Saved addresses'
    fields = ('label', 'recipient', 'phone', 'street', 'city', 'postal_code', 'country', 'is_default', 'updated_at')
    readonly_fields = fields
    extra = 0
    can_delete = False
    details_limit = 100
    details_template = 'admin/includes/user_addresses.html'
    details_empty_message = 'No saved addresses on this account yet. Browser-saved addresses will appear after the customer signs in.'

    def has_add_permission(self, request, obj=None):
        return False


class UserAdmin(BaseUserAdmin):
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        field = super().formfield_for_manytomany(db_field, request, **kwargs)
        if db_field.name == 'user_permissions' and field:
            field.queryset = dashboard_permissions(field.queryset, request, self.admin_site)
            field.widget = PermissionPicker(choices=field.choices)
            field.help_text = 'Direct permissions apply in addition to permissions inherited from groups.'
        return field

    list_display = ('email', 'name', 'signUp_by', 'is_superuser', 'is_verified', 'is_admin')
    list_filter = ('is_admin', 'groups')
    readonly_fields = ('id', 'first_name', 'last_name', 'sign_in_method', 'last_login', 'order_history')
    inlines = (UserProfileInline, UserAddressInline)
    fieldsets = (
        ('Account', {'fields': ('id', 'email', 'password', 'sign_in_method')}),
        ('Personal info', {'fields': ('name', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_admin', 'is_verified', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account activity', {'fields': ('last_login', 'order_history')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

    def get_readonly_fields(self, request, obj=None):
        fields = super().get_readonly_fields(request, obj)
        if not request.user.is_superuser:
            return (*fields, 'is_admin', 'is_superuser', 'groups', 'user_permissions')
        return fields

    def has_change_permission(self, request, obj=None):
        if obj and not request.user.is_superuser and (obj.is_admin or obj.is_superuser):
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and not request.user.is_superuser and (obj.is_admin or obj.is_superuser):
            return False
        return super().has_delete_permission(request, obj)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')

    @admin.display(description='Sign-in method')
    def sign_in_method(self, obj):
        return dict(User.SIGNUP_METHODS).get(obj.signUp_by.strip().lower(), 'Not recorded')

    @admin.display(description='Customer orders')
    def order_history(self, obj):
        url = reverse('admin:orders_order_changelist')
        return format_html('<a href="{}?user__id__exact={}">View this user\'s orders &rarr;</a>', url, obj.pk)

    def save_model(self, request, obj, form, change):
        if not change or 'name' in form.changed_data:
            parts = obj.name.strip().split(maxsplit=1)
            obj.first_name = parts[0] if parts else ''
            obj.last_name = parts[1] if len(parts) > 1 else ''
        super().save_model(request, obj, form, change)

# Register the new UserAdmin
admin.site.register(User, UserAdmin)


class GroupMembersForm(forms.ModelForm):
    members = forms.ModelMultipleChoiceField(
        queryset=User.objects.order_by('email'), required=False,
        widget=FilteredSelectMultiple('members', is_stacked=False),
        help_text='Select the users who should inherit these permissions. Admin access also requires staff access on their User record.',
    )

    class Meta:
        model = Group
        fields = ('name', 'permissions', 'members')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk and 'members' in self.fields:
            self.fields['members'].initial = self.instance.user_set.all()


class GroupAdmin(BaseGroupAdmin):
    form = GroupMembersForm

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        field = super().formfield_for_manytomany(db_field, request, **kwargs)
        if db_field.name == 'permissions' and field:
            field.queryset = dashboard_permissions(field.queryset, request, self.admin_site)
            field.widget = PermissionPicker(choices=field.choices)
            field.help_text = 'Members inherit all selected permissions.'
        return field

    @admin.display(description='Members')
    def members(self, obj):
        return ', '.join(obj.user_set.order_by('email').values_list('email', flat=True))

    def has_add_permission(self, request):
        return request.user.is_superuser and super().has_add_permission(request)

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser and super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser and super().has_delete_permission(request, obj)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.user_set.set(form.cleaned_data['members'])


admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)
