import uuid

from django.conf import settings
from django.db import models


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Awaiting phone confirmation'
        CONTACTED = 'contacted', 'Customer contacted'
        CONFIRMED = 'confirmed', 'Confirmed'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    request_id = models.UUIDField(editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='orders',
    )
    source = models.CharField(max_length=10, choices=[('cart', 'Cart'), ('buyNow', 'Buy Now')])
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    phone = models.CharField(max_length=30)
    delivery_address = models.TextField()
    customer_notes = models.TextField(blank=True, max_length=2000)
    subtotal = models.DecimalField(max_digits=16, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    admin_notes = models.TextField(blank=True, help_text='Private notes about calls, confirmation and fulfilment.')
    customer_update = models.TextField(blank=True, max_length=2000, help_text='Visible to the customer on My orders. Do not include private staff notes.')
    stock_reserved = models.BooleanField(default=False, editable=False)
    confirmed_at = models.DateTimeField(null=True, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']
        constraints = [
            models.UniqueConstraint(fields=['user', 'request_id'], name='unique_customer_order_request'),
        ]

    @property
    def order_number(self):
        return f'RS-{self.pk:06d}' if self.pk else 'New order'

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True)
    product_reference = models.CharField(max_length=20)
    product_name = models.CharField(max_length=180)
    sku = models.CharField(max_length=80, blank=True)
    image_url = models.URLField(max_length=1000, blank=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['id']
        constraints = [
            models.CheckConstraint(condition=models.Q(quantity__gt=0), name='order_item_positive_quantity'),
        ]

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f'{self.product_name} × {self.quantity}'
