from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from orders.serializers import DeliverySerializer
from .models import Address


class SavedAddressSerializer(DeliverySerializer):
    id = serializers.CharField(max_length=500)
    label = serializers.CharField(max_length=60)


class ImportedAddressSerializer(SavedAddressSerializer):
    def validate(self, data):
        # Preserve old browser addresses, including phone numbers needing correction.
        # Edits and checkout still enforce the current phone validation rules.
        return data


class ImportSerializer(serializers.Serializer):
    items = ImportedAddressSerializer(many=True, max_length=100)
    defaultId = serializers.CharField(max_length=500, allow_null=True, required=False)


class SaveSerializer(serializers.Serializer):
    address = SavedAddressSerializer()
    makeDefault = serializers.BooleanField(default=False)


class ReferenceSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=500)


def address_values(data):
    return {('postal_code' if key == 'postalCode' else key): value for key, value in data.items() if key != 'id'}


def address_book(user):
    addresses = list(Address.objects.filter(user=user))
    return {
        'items': [{
            'id': address.reference, 'label': address.label, 'recipient': address.recipient,
            'phone': address.phone, 'street': address.street, 'city': address.city,
            'postalCode': address.postal_code, 'country': address.country,
        } for address in addresses],
        'defaultId': next((address.reference for address in addresses if address.is_default), None),
    }


def set_default(user, address):
    Address.objects.filter(user=user, is_default=True).exclude(pk=address.pk).update(is_default=False)
    if not address.is_default:
        address.is_default = True
        address.save(update_fields=['is_default', 'updated_at'])


class AddressBookView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'private, no-store'
        return response

    def get(self, request):
        return Response(address_book(request.user))

    @transaction.atomic
    def post(self, request):
        """One-time browser import: retain existing server edits and defaults."""
        serializer = ImportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.select_for_update().get(pk=request.user.pk)
        for data in serializer.validated_data['items']:
            if not Address.objects.filter(user=user, reference=data['id']).exists():
                self.check_limit(user)
                Address.objects.create(user=user, reference=data['id'], **address_values(data))
        if not Address.objects.filter(user=user, is_default=True).exists():
            default = Address.objects.filter(user=user, reference=serializer.validated_data.get('defaultId')).first()
            default = default or Address.objects.filter(user=user).first()
            if default:
                set_default(user, default)
        return Response(address_book(user))

    @transaction.atomic
    def put(self, request):
        serializer = SaveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.select_for_update().get(pk=request.user.pk)
        data = serializer.validated_data['address']
        existing = Address.objects.filter(user=user, reference=data['id']).exists()
        if not existing:
            self.check_limit(user)
        address, _ = Address.objects.update_or_create(user=user, reference=data['id'], defaults=address_values(data))
        if serializer.validated_data['makeDefault'] or not Address.objects.filter(user=user, is_default=True).exists():
            set_default(user, address)
        return Response(address_book(user))

    @transaction.atomic
    def patch(self, request):
        serializer = ReferenceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.select_for_update().get(pk=request.user.pk)
        address = get_object_or_404(Address, user=user, reference=serializer.validated_data['id'])
        set_default(user, address)
        return Response(address_book(user))

    @transaction.atomic
    def delete(self, request):
        serializer = ReferenceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.select_for_update().get(pk=request.user.pk)
        address = get_object_or_404(Address, user=user, reference=serializer.validated_data['id'])
        was_default = address.is_default
        address.delete()
        if was_default:
            replacement = Address.objects.filter(user=user).first()
            if replacement:
                set_default(user, replacement)
        return Response(address_book(user))

    @staticmethod
    def check_limit(user):
        if Address.objects.filter(user=user).count() >= 100:
            raise serializers.ValidationError('You can save up to 100 addresses.')
