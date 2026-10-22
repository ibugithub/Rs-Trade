from django.conf import settings
from django.db import models


class Service(models.TextChoices):
    SOURCING = 'china-product-sourcing', 'RS Sourcing'
    VERIFICATION = 'supplier-verification', 'Supplier Verification'
    QUALITY = 'quality-control', 'Quality Inspection'
    SHIPPING = 'door-to-door-import', 'Shipping & Door-to-Door Import'


class ServiceRequest(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'New request'
        CONTACTED = 'contacted', 'Customer contacted'
        QUOTED = 'quoted', 'Quotation sent'
        IN_PROGRESS = 'in_progress', 'In progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    request_id = models.UUIDField(unique=True, editable=False)
    submission_hash = models.CharField(max_length=64, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    company = models.CharField(max_length=180, blank=True)
    description = models.TextField(max_length=5000)
    quantity = models.CharField(max_length=100, blank=True)
    reference_url = models.URLField(max_length=1000, blank=True)
    destination = models.CharField(max_length=255, blank=True)
    source_page = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW, db_index=True)
    admin_notes = models.TextField(blank=True, max_length=5000, help_text='Private staff notes about calls, quotations and service progress.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']

    @property
    def request_number(self):
        return f'SR-{self.pk:06d}' if self.pk else 'New service request'

    def __str__(self):
        return self.request_number


class RequestedService(models.Model):
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='selected_services')
    service = models.CharField(max_length=40, choices=Service.choices)

    class Meta:
        ordering = ['id']
        constraints = [models.UniqueConstraint(fields=['request', 'service'], name='unique_inquiry_service')]

    def __str__(self):
        return self.get_service_display()


class RSSourcing(ServiceRequest):
    class Meta:
        proxy = True
        verbose_name = 'RS Sourcing request'
        verbose_name_plural = 'RS Sourcing'


class SupplierVerification(ServiceRequest):
    class Meta:
        proxy = True
        verbose_name = 'supplier verification request'
        verbose_name_plural = 'Supplier Verification'


class QualityAssurance(ServiceRequest):
    class Meta:
        proxy = True
        verbose_name = 'quality inspection request'
        verbose_name_plural = 'Quality Inspection'


class ShippingImport(ServiceRequest):
    class Meta:
        proxy = True
        verbose_name = 'shipping request'
        verbose_name_plural = 'Shipping & Import'

