from django.core.validators import URLValidator
from rest_framework import serializers
from orders.serializers import DeliverySerializer
from .models import Service


class CreateServiceRequestSerializer(serializers.Serializer):
    requestId = serializers.UUIDField()
    services = serializers.ListField(child=serializers.ChoiceField(choices=Service.choices), min_length=1, max_length=1, allow_empty=False)
    image = serializers.ImageField(required=False)
    name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=30)
    email = serializers.EmailField(allow_blank=True, required=False, default='')
    company = serializers.CharField(max_length=180, allow_blank=True, required=False, default='')
    description = serializers.CharField(max_length=5000)
    quantity = serializers.CharField(max_length=100, allow_blank=True, required=False, default='')
    reference_url = serializers.CharField(max_length=1000, allow_blank=True, required=False, default='', validators=[URLValidator(schemes=['http', 'https'])])
    destination = serializers.CharField(max_length=255, allow_blank=True, required=False, default='')
    source_page = serializers.RegexField(r'^/(?:request-a-quote/?|services/(?:china-product-sourcing|supplier-verification|quality-control|door-to-door-import)/?)$', required=False, default='/request-a-quote/')

    def validate_services(self, value):
        if len(value) != len(set(value)):
            raise serializers.ValidationError('Select each service only once.')
        return sorted(value)

    def validate_phone(self, value):
        # Use the same Bangladesh/international phone rules as order delivery.
        data = DeliverySerializer().validate({'phone': value, 'country': 'Bangladesh'})
        return data['phone']

    def validate_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('The image must be 5 MB or smaller.')
        if value.image.format not in ('JPEG', 'PNG', 'WEBP'):
            raise serializers.ValidationError('Upload a JPG, PNG or WebP image.')
        if value.image.width * value.image.height > 25_000_000:
            raise serializers.ValidationError('The image must be 25 megapixels or smaller.')
        return value
