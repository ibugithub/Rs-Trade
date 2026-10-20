from django.db import OperationalError, ProgrammingError, transaction
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Cart, CartOperation
from .views import public_products
from notifications.services import cart_updated


MAX_ITEMS = 100
MAX_QUANTITY = 9999


class SelectionSerializer(serializers.Serializer):
    productId = serializers.RegexField(r'^[1-9][0-9]{0,18}$')
    quantity = serializers.IntegerField(min_value=1, max_value=MAX_QUANTITY)

    def validate_productId(self, value):
        if int(value) > 9223372036854775807:
            raise serializers.ValidationError('Invalid product ID.')
        return value


class OperationSerializer(serializers.Serializer):
    id = serializers.RegexField(r'^[A-Za-z0-9_-]{21,64}$')
    kind = serializers.ChoiceField(choices=('add', 'set', 'remove', 'clear', 'merge'))
    productId = serializers.RegexField(r'^[1-9][0-9]{0,18}$', required=False)
    quantity = serializers.IntegerField(min_value=1, max_value=MAX_QUANTITY, required=False)
    items = SelectionSerializer(many=True, max_length=MAX_ITEMS, required=False)

    def validate(self, data):
        kind = data['kind']
        if kind in ('add', 'set', 'remove'):
            product_id = data.get('productId', '')
            if not product_id or int(product_id) > 9223372036854775807:
                raise serializers.ValidationError('A valid product is required.')
        if kind in ('add', 'set') and 'quantity' not in data:
            raise serializers.ValidationError('Quantity is required.')
        if kind == 'merge' and 'items' not in data:
            raise serializers.ValidationError('Guest selections are required.')
        if kind == 'merge':
            ids = [item['productId'] for item in data['items']]
            if len(ids) != len(set(ids)):
                raise serializers.ValidationError('Guest selections contain duplicate products.')
        return data


def apply_operation(items, operation):
    selections = {item['productId']: item['quantity'] for item in items}
    kind = operation['kind']
    product_id = operation.get('productId')
    notice = ''
    if kind == 'clear':
        return [], notice
    if kind == 'remove':
        selections.pop(product_id, None)
    elif kind == 'merge':
        incoming = operation['items']
        available = {
            str(product.pk): product.stock_quantity
            for product in public_products().filter(pk__in=[item['productId'] for item in incoming])
        }
        for item in incoming:
            key = item['productId']
            stock = min(available.get(key, 0), MAX_QUANTITY)
            desired = selections.get(key, 0) + item['quantity']
            if stock < desired or (key not in selections and len(selections) >= MAX_ITEMS):
                notice = 'Some guest selections were adjusted to current stock or could not be added.'
            if stock <= 0 or (key not in selections and len(selections) >= MAX_ITEMS):
                continue
            selections[key] = min(desired, stock)
    else:
        product = public_products().filter(pk=product_id).first()
        if product is None or product.stock_quantity <= 0:
            raise serializers.ValidationError('This product is no longer available.')
        quantity = operation['quantity']
        if kind == 'add':
            quantity += selections.get(product_id, 0)
        if quantity > min(product.stock_quantity, MAX_QUANTITY):
            raise serializers.ValidationError('The requested quantity exceeds current stock.')
        if product_id not in selections and len(selections) >= MAX_ITEMS:
            raise serializers.ValidationError('Your cart can contain up to 100 different products.')
        selections[product_id] = quantity
    return [{'productId': key, 'quantity': value} for key, value in selections.items()], notice


class AccountCartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'private, no-store'
        return response

    def handle_exception(self, exc):
        if isinstance(exc, (ProgrammingError, OperationalError)):
            return Response({'detail': 'Account cart is currently unavailable. Please try again later.'}, status=503)
        return super().handle_exception(exc)

    def get(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        return Response({'items': cart.items if cart else []})

    def post(self, request):
        serializer = OperationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        operation = serializer.validated_data
        # Serialize account mutations and remember IDs so retries cannot add twice.
        with transaction.atomic():
            cart, _ = Cart.objects.get_or_create(user=request.user)
            cart = Cart.objects.select_for_update().get(pk=cart.pk)
            if CartOperation.objects.filter(cart=cart, operation_id=operation['id']).exists():
                return Response({'items': cart.items, 'notice': ''})
            try:
                items, notice = apply_operation(cart.items, operation)
            except serializers.ValidationError as error:
                return Response({'items': cart.items, 'detail': error.detail}, status=400)
            changed = cart.items != items
            cart.items = items
            cart.save(update_fields=['items', 'updated_at'])
            CartOperation.objects.create(cart=cart, operation_id=operation['id'])
            if changed:
                cart_updated(cart)
        return Response({'items': items, 'notice': notice})
