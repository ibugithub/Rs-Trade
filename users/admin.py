from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'signUp_by', 'is_superuser', 'is_verified', 'is_admin')
    list_filter = ('is_admin',)
    readonly_fields = ('first_name', 'last_name')
    fieldsets = (
        ('Basic', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_admin', 'is_verified', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if not change or 'name' in form.changed_data:
            parts = obj.name.strip().split(maxsplit=1)
            obj.first_name = parts[0] if parts else ''
            obj.last_name = parts[1] if len(parts) > 1 else ''
        super().save_model(request, obj, form, change)

# Register the new UserAdmin
admin.site.register(User, UserAdmin)
