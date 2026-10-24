from decimal import Decimal
import re

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

    def validate(self, data):
        phone = data['phone'].strip()
        without_groups = re.sub(r'\([0-9]+\)', '', phone)
        valid_format = (
            re.fullmatch(r'\+?[0-9 ()-]+', phone)
            and not re.search(r'[()]', without_groups)
            and not re.search(r'[ -]{2}|^-|-$|^\+[ -]', phone)
        )
        if not valid_format:
            raise serializers.ValidationError({'phone': 'Use digits with optional spaces, hyphens or parentheses. Put + only at the start.'})
        number = re.sub(r'[ ()-]', '', phone)
        bangladesh = data['country'].strip().lower() in ('bangladesh', 'bd', 'বাংলাদেশ')
        if not number.startswith('+'):
            if bangladesh and re.fullmatch(r'01[3-9][0-9]{8}', number):
                number = '+880' + number[1:]
            elif bangladesh and re.fullmatch(r'8801[3-9][0-9]{8}', number):
                number = '+' + number
            else:
                raise serializers.ValidationError({'phone': 'Enter a valid Bangladesh mobile number or include + and the country code.'})
        if not re.fullmatch(r'\+[1-9][0-9]{6,14}', number):
            raise serializers.ValidationError({'phone': 'Use a country code and 7 to 15 digits in total.'})
        if number.startswith('+880') and not re.fullmatch(r'\+8801[3-9][0-9]{8}', number):
            raise serializers.ValidationError({'phone': 'Enter a Bangladesh mobile number such as 01712345678 or +8801712345678.'})
        data['phone'] = number
        return data


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
