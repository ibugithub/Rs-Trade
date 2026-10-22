from django.contrib import admin
from django.utils.html import format_html

from .models import (
    QualityAssurance, RSSourcing, Service, ServiceRequest,
    ShippingImport, SupplierVerification,
)


class ServiceRequestAdmin(admin.ModelAdmin):
    service = None
    details_form_section = 'Follow-up'
    details_follow_up_template = 'admin/includes/service_follow_up.html'
    list_display = ('request_number', 'name', 'call_customer', 'requested_services', 'status', 'created_at')
    list_display_links = ('request_number',)
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'phone', 'email', 'company', 'description', '=id')
    search_help_text = 'Search by request number, customer name, phone, email or requirements'
    readonly_fields = (
        'request_number', 'requested_services', 'name', 'call_customer', 'email',
        'company', 'user', 'description', 'quantity', 'reference_url', 'destination',
        'source_page', 'created_at', 'updated_at',
    )
    fieldsets = (
        ('Request overview', {'fields': ('request_number', 'requested_services', 'created_at', 'updated_at')}),
        ('Customer contact', {'fields': ('name', 'call_customer', 'email', 'company', 'user')}),
        ('Requirements', {'fields': ('description', 'quantity', 'reference_url', 'destination', 'source_page')}),
        ('Follow-up', {'fields': ('status', 'admin_notes')}),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related('user').prefetch_related('selected_services')
        if self.service:
            return queryset.filter(selected_services__service=self.service)
        return queryset

    @admin.display(description='Request', ordering='id')
    def request_number(self, obj):
        return obj.request_number

    @admin.display(description='Services')
    def requested_services(self, obj):
        return ', '.join(selection.get_service_display() for selection in obj.selected_services.all()) or 'General inquiry'

    @admin.display(description='Phone / WhatsApp')
    def call_customer(self, obj):
        return format_html('<a href="tel:{}">{}</a>', obj.phone, obj.phone)

    def get_search_results(self, request, queryset, search_term):
        if search_term.upper().startswith('SR-') and search_term[3:].isdigit():
            return queryset.filter(pk=int(search_term[3:])), False
        return super().get_search_results(request, queryset, search_term)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ServiceRequest)
class AllServiceRequestsAdmin(ServiceRequestAdmin):
    def get_model_perms(self, request):
        # One canonical details URL for notifications; dashboard uses service cards.
        return {}


@admin.register(RSSourcing)
class SourcingAdmin(ServiceRequestAdmin):
    service = Service.SOURCING


@admin.register(SupplierVerification)
class VerificationAdmin(ServiceRequestAdmin):
    service = Service.VERIFICATION


@admin.register(QualityAssurance)
class QualityAdmin(ServiceRequestAdmin):
    service = Service.QUALITY


@admin.register(ShippingImport)
class ShippingAdmin(ServiceRequestAdmin):
    service = Service.SHIPPING

