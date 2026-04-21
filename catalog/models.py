from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = CloudinaryField('category_images', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    image = CloudinaryField('subcategory_images', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Subcategory'
        verbose_name_plural = 'Subcategories'
        ordering = ['category__name', 'name']
        constraints = [
            models.UniqueConstraint(fields=['category', 'name'], name='unique_subcategory_name_per_category'),
            models.UniqueConstraint(fields=['category', 'slug'], name='unique_subcategory_slug_per_category'),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.category.name} / {self.name}'


class Product(models.Model):
    class ProductStatus(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active'
        ARCHIVED = 'archived', 'Archived'

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.PROTECT,
        related_name='products',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=210, unique=True, blank=True)
    sku = models.CharField(max_length=80, unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = CloudinaryField('product_images', null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=ProductStatus.choices, default=ProductStatus.DRAFT)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'is_featured']),
            models.Index(fields=['category', 'subcategory']),
        ]

    def clean(self):
        if self.subcategory and self.subcategory.category_id != self.category_id:
            raise ValidationError({'subcategory': 'Selected subcategory must belong to the selected category.'})

        if self.compare_at_price is not None and self.compare_at_price < self.price:
            raise ValidationError({'compare_at_price': 'Compare-at price cannot be lower than product price.'})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
