from django.core.validators import URLValidator
from rest_framework import serializers
from orders.serializers import DeliverySerializer
from .models import Service


class CreateServiceRequestSerializer(serializers.Serializer):
    requestId = serializers.UUIDField()
    services = serializers.ListField(child=serializers.ChoiceField(choices=Service.choices), max_length=4, allow_empty=True)
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
