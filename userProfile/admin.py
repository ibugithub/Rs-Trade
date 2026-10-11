from django.contrib import admin

from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('Display_name', 'user', 'profile_picture')
    list_select_related = ('user',)
    autocomplete_fields = ('user',)
    fieldsets = (
        ('Basic', {'fields': ('user', 'Display_name', 'profile_picture')}),
    )
    search_fields = ('user__email', 'user__name', 'Display_name')
    ordering = ('user',)
    filter_horizontal = ()


admin.site.register(Profile, ProfileAdmin)
