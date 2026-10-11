from django.contrib import admin
from django.db.models import Count

from .models import Category, Deal, DealProduct, Product, SubCategory


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

    def get_queryset(self, request):
        # Also used by the autocomplete endpoint and selected form labels.
        return super().get_queryset(request).select_related('category')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
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
    search_fields = ('name', 'sku', 'short_description', 'description')
    search_help_text = 'Search by name, SKU or description'
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category', 'subcategory')
    readonly_fields = ('created_at', 'updated_at')
    # Subcategory labels also use their category; load both in the list query.
    list_select_related = ('category', 'subcategory__category')
    list_per_page = 25
    list_editable = ('price', 'stock_quantity', 'status', 'is_featured')

    @admin.display(description='Subcategory', ordering='subcategory__name')
    def subcategory_name(self, obj):
        return obj.subcategory.name if obj.subcategory else None

    fieldsets = (
        ('Classification', {'fields': ('category', 'subcategory')}),
        ('Product information', {'fields': ('name', 'slug', 'sku', 'short_description', 'description', 'image')}),
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
