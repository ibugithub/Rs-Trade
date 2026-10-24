from django import forms
from django.contrib import admin
from django.template.loader import render_to_string
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from .models import Order
from .services import ALLOWED_TRANSITIONS, confirmation_stock, save_order_status, validate_status_change


class OrderAdminForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ('status', 'customer_update', 'admin_notes')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk and 'status' in self.fields:
            allowed = ALLOWED_TRANSITIONS[self.instance.status] | {self.instance.status}
            self.fields['status'].choices = [choice for choice in Order.Status.choices if choice[0] in allowed]
            self.fields['status'].help_text = 'Stock is deducted only on confirmation. Cancelling before shipment restores deducted stock.'

    def clean(self):
        cleaned = super().clean()
        if self.instance.pk and 'status' in cleaned:
            # Django wraps admin POSTs in a transaction. Hold this lock through save.
            self.previous_order = Order.objects.select_for_update().get(pk=self.instance.pk)
            validate_status_change(self.previous_order.status, cleaned['status'])
            if cleaned['status'] == Order.Status.CONFIRMED and not self.previous_order.stock_reserved:
                self.confirmation_lines = confirmation_stock(self.previous_order)
        return cleaned


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    form = OrderAdminForm
    details_form_section = 'Follow-up'
    list_display = ('order_number', 'customer_name', 'call_customer', 'status', 'subtotal', 'created_at')
    list_display_links = ('order_number',)
    list_filter = ('status', 'source', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'phone', '=id')
    search_help_text = 'Search by order number, customer name, email or phone'
    ordering = ('-created_at', '-id')
    readonly_fields = (
        'order_number', 'user', 'source', 'customer_name', 'customer_email',
        'call_customer', 'delivery_address', 'customer_notes', 'subtotal',
        'current_status', 'stock_deducted', 'confirmed_at', 'created_at', 'updated_at', 'order_items',
    )
    fieldsets = (
        ('Order overview', {'fields': ('order_number', 'current_status', 'source', 'subtotal', 'stock_deducted')}),
        ('Customer contact', {'fields': ('customer_name', 'call_customer', 'customer_email', 'user')}),
        ('Delivery', {'fields': ('delivery_address', 'customer_notes')}),
        ('Ordered products', {'fields': ('order_items',), 'classes': ('rs-cart-products',)}),
        ('Follow-up', {'fields': ('status', 'customer_update', 'admin_notes', 'confirmed_at', 'created_at', 'updated_at')}),
    )

    @admin.display(description='Order number', ordering='id')
    def order_number(self, obj):
        return obj.order_number

    @admin.display(description='Current status')
    def current_status(self, obj):
        return obj.get_status_display()

    @admin.display(description='Stock deducted', boolean=True)
    def stock_deducted(self, obj):
        return obj.stock_reserved

    @admin.display(description='Phone')
    def call_customer(self, obj):
        number = ''.join(character for character in obj.phone if character in '+0123456789')
        return format_html('<a href="tel:{}">{}</a>', number, obj.phone)

    @admin.display(description='Products and totals')
    def order_items(self, obj):
        rows = []
        for item in obj.items.all():
            rows.append({
                'item': item,
                'image': {
                    'url': item.image_url,
                    'label': item.product_name,
                    'initials': ''.join(word[0] for word in item.product_name.split()[:2]).upper(),
                },
            })
        return mark_safe(render_to_string('admin/orders/order_items.html', {
            'rows': rows, 'subtotal': obj.subtotal,
        }))

    def get_search_results(self, request, queryset, search_term):
        if search_term.upper().startswith('RS-') and search_term[3:].isdigit():
            return queryset.filter(pk=int(search_term[3:])), False
        return super().get_search_results(request, queryset, search_term)

    def save_model(self, request, obj, form, change):
        save_order_status(obj, form.previous_order, getattr(form, 'confirmation_lines', None))

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        # Cancel to release reserved stock and keep the order's history.
        return False
