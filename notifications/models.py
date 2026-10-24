from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Kind(models.TextChoices):
        ORDER = 'order', 'New order'
        CART = 'cart', 'Cart updated'
        SERVICE = 'service', 'Service request'

    kind = models.CharField(max_length=10, choices=Kind.choices)
    order = models.OneToOneField('orders.Order', null=True, blank=True, on_delete=models.CASCADE)
    cart = models.OneToOneField('catalog.Cart', null=True, blank=True, on_delete=models.CASCADE)
    service_request = models.OneToOneField('service_requests.ServiceRequest', null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['-updated_at', '-id']


class NotificationRead(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='reads')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    seen_at = models.DateTimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['notification', 'user'], name='unique_staff_notification_read'),
        ]
