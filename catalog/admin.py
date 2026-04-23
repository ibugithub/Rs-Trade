from django.contrib import admin

from .models import Category, Deal, DealProduct, Product, SubCategory


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

    def subcategory_count(self, obj):
        return obj.subcategories.count()

    subcategory_count.short_description = 'Subcategories'


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'subcategory',
        'price',
        'stock_quantity',
        'status',
        'is_featured',
        'created_at',
    )
    list_filter = ('status', 'is_featured', 'category', 'subcategory', 'created_at')
    search_fields = ('name', 'sku', 'short_description', 'description')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category', 'subcategory')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('price', 'stock_quantity', 'status', 'is_featured')
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
