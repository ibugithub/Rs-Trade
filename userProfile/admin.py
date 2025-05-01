from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('Display_name', 'user', 'profile_picture')
    list_filter = ('user',)
    fieldsets = (
        ('Basic', {'fields': ('user', 'Display_name', 'profile_picture')}),
    )
    search_fields = ('user', 'Display_name')
    ordering = ('user',)
    filter_horizontal = ()
    
    
# Register the new UserAdmin
admin.site.register(Profile, ProfileAdmin)