from decimal import Decimal

from django.contrib import admin
from django.db.models import Count
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.safestring import mark_safe

from .models import Cart, Category, Deal, DealProduct, Product, SubCategory


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_count', 'updated_at')
    search_fields = ('user__email',)
    list_select_related = ('user',)
    ordering = ('-updated_at',)
    readonly_fields = ('id', 'user', 'updated_at', 'cart_contents')
    fieldsets = (
        ('Cart details', {'fields': ('id', 'user', 'updated_at')}),
        ('Products in this cart', {
            'fields': ('cart_contents',),
            'classes': ('rs-cart-products',),
        }),
    )

    @admin.display(description='Products')
    def product_count(self, obj):
        return len(obj.items)

    @admin.display(description='Cart contents')
    def cart_contents(self, obj):
        # Fetch all product details together, including inactive and sold-out items.
        products = {
            str(product.pk): product
            for product in Product.objects.filter(
                pk__in=[item['productId'] for item in obj.items]
            ).select_related('category', 'subcategory')
        }
        rows = []
        subtotal = Decimal('0.00')
        units = 0
        missing_products = False
        for item in obj.items:
            product_id = item['productId']
            quantity = item['quantity']
            product = products.get(product_id)
            units += quantity
            row = {'id': product_id, 'quantity': quantity, 'product': product}
            if product:
                row['url'] = reverse('admin:catalog_product_change', args=[product.pk])
                row['line_total'] = product.price * quantity
                subtotal += row['line_total']
                if (
                    product.status != Product.ProductStatus.ACTIVE
                    or not product.category.is_active
                    or (product.subcategory and not product.subcategory.is_active)
                ):
                    row['availability'] = 'Not published'
                elif product.stock_quantity == 0:
                    row['availability'] = 'Out of stock'
                elif quantity > product.stock_quantity:
                    row['availability'] = 'Insufficient stock'
                else:
                    row['availability'] = 'Available'
            else:
                missing_products = True
                row['availability'] = 'Product deleted'
            rows.append(row)
        return mark_safe(render_to_string('admin/catalog/cart_contents.html', {
            'rows': rows,
            'units': units,
            'subtotal': subtotal,
            'missing_products': missing_products,
        }))

    # Customer selections are managed through the cart API, including retry receipts.
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class SubCategoryListFilter(admin.RelatedFieldListFilter):
    def field_choices(self, field, request, model_admin):
        # Each label includes its category; fetch it in the same query.
        queryset = field.remote_field.model._default_manager.complex_filter(
            field.get_limit_choices_to()
        ).select_related('category')
        ordering = self.field_admin_ordering(field, request, model_admin)
        if ordering:
            queryset = queryset.order_by(*ordering)
        return [(item.pk, str(item)) for item in queryset]


class SubCategoryInline(admin.TabularInline):
    model = SubCategory
    classes = ('rs-subcategory-editor',)
    extra = 0
    fields = ('name', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'subcategory_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SubCategoryInline]
    fieldsets = (
        ('Category details', {'fields': ('name', 'slug', 'description')}),
        ('Image', {'fields': ('image',)}),
        ('Visibility', {'fields': ('is_active',)}),
        ('Record activity', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            total_subcategories=Count('subcategories')
        )

    def subcategory_count(self, obj):
        return obj.total_subcategories

    subcategory_count.short_description = 'Subcategories'


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Subcategory details', {'fields': ('category', 'name', 'slug', 'description')}),
        ('Image', {'fields': ('image',)}),
        ('Visibility', {'fields': ('is_active',)}),
        ('Record activity', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def get_queryset(self, request):
        # Also used by the autocomplete endpoint and selected form labels.
        return super().get_queryset(request).select_related('category')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'category',
        'subcategory_name',
        'price',
        'stock_quantity',
        'status',
        'is_featured',
    )
    list_filter = (
        'status', 'is_featured', 'category',
        ('subcategory', SubCategoryListFilter), 'created_at',
    )
    list_display_links = ('name',)
    search_fields = ('=id', 'name', 'sku', 'short_description', 'description')
    search_help_text = 'Search by product ID, name, SKU or description'
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category', 'subcategory')
    readonly_fields = ('id', 'created_at', 'updated_at')
    # Subcategory labels also use their category; load both in the list query.
    list_select_related = ('category', 'subcategory__category')
    list_per_page = 25
    list_editable = ('price', 'stock_quantity', 'status', 'is_featured')

    @admin.display(description='Subcategory', ordering='subcategory__name')
    def subcategory_name(self, obj):
        return obj.subcategory.name if obj.subcategory else None

    fieldsets = (
        ('Classification', {'fields': ('category', 'subcategory')}),
        ('Product information', {'fields': ('id', 'name', 'slug', 'sku', 'short_description', 'description', 'image')}),
        ('Pricing and stock', {'fields': ('price', 'compare_at_price', 'stock_quantity')}),
        ('Publishing', {'fields': ('status', 'is_featured')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


class DealProductInline(admin.TabularInline):
    model = DealProduct
    extra = 0
    autocomplete_fields = ('product',)
    fields = ('product', 'deal_price', 'display_order', 'is_active')


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('name', 'starts_at', 'ends_at', 'is_active', 'is_running', 'display_order')
    list_filter = ('is_active', 'starts_at', 'ends_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [DealProductInline]
    fieldsets = (
        ('Deal information', {'fields': ('name', 'slug', 'description')}),
        ('Schedule', {'fields': ('starts_at', 'ends_at', 'is_active', 'display_order')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(DealProduct)
class DealProductAdmin(admin.ModelAdmin):
    list_display = ('deal', 'product', 'deal_price', 'display_order', 'is_active', 'created_at')
    list_filter = ('deal', 'is_active', 'created_at')
    search_fields = ('deal__name', 'product__name', 'product__sku')
    autocomplete_fields = ('deal', 'product')
    readonly_fields = ('created_at', 'updated_at')
    list_select_related = ('deal', 'product')
