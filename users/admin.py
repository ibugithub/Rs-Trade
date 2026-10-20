from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.urls import reverse
from django.utils.html import format_html
from userProfile.models import Address, Profile
from .models import User


class UserProfileInline(admin.StackedInline):
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


class UserAddressInline(admin.StackedInline):
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
    list_display = ('email', 'name', 'signUp_by', 'is_superuser', 'is_verified', 'is_admin')
    list_filter = ('is_admin',)
    readonly_fields = ('id', 'first_name', 'last_name', 'sign_in_method', 'last_login', 'order_history')
    inlines = (UserProfileInline, UserAddressInline)
    fieldsets = (
        ('Account', {'fields': ('id', 'email', 'password', 'sign_in_method')}),
        ('Personal info', {'fields': ('name', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_admin', 'is_verified', 'is_superuser')}),
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
    filter_horizontal = ()

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
