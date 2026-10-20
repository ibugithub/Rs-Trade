from decimal import Decimal

from rest_framework import serializers

from catalog.cart_views import SelectionSerializer


class OrderSelectionSerializer(SelectionSerializer):
    unitPrice = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'))


class DeliverySerializer(serializers.Serializer):
    recipient = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=30)
    street = serializers.CharField(max_length=500)
    city = serializers.CharField(max_length=120)
    postalCode = serializers.CharField(max_length=30, allow_blank=True, required=False, default='')
    country = serializers.CharField(max_length=120)

    def validate_phone(self, value):
        if any(character not in '+0123456789 ()-' for character in value):
            raise serializers.ValidationError('Enter a valid phone number, including country code.')
        digits = ''.join(character for character in value if character.isdigit())
        if not 7 <= len(digits) <= 15:
            raise serializers.ValidationError('Enter a phone number with 7 to 15 digits.')
        return value


class CreateOrderSerializer(serializers.Serializer):
    requestId = serializers.UUIDField()
    source = serializers.ChoiceField(choices=('cart', 'buyNow'))
    items = OrderSelectionSerializer(many=True, min_length=1, max_length=100)
    address = DeliverySerializer()
    notes = serializers.CharField(max_length=2000, allow_blank=True, required=False, default='')

    def validate(self, data):
        ids = [item['productId'] for item in data['items']]
        if len(ids) != len(set(ids)):
            raise serializers.ValidationError('Each product may appear only once.')
        if data['source'] == 'buyNow' and len(ids) != 1:
            raise serializers.ValidationError('Buy Now accepts one product at a time.')
        return data
