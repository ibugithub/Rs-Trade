from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework.exceptions import ValidationError as APIValidationError

from catalog.models import Cart, Product
from catalog.views import product_data, public_products
from .models import Order, OrderItem
from notifications.services import clear_cart_alert, new_order


@transaction.atomic
def submit_order(user, data):
    # Serialize retries from the same customer. Submission does not reserve inventory.
    get_user_model().objects.select_for_update().get(pk=user.pk)
    existing = Order.objects.filter(user=user, request_id=data['requestId']).first()
    if existing:
        return existing, False

    selections = data['items']
    cart = None
    if data['source'] == 'cart':
        cart = Cart.objects.select_for_update().filter(user=user).first()
        quantities = {item['productId']: item['quantity'] for item in cart.items} if cart else {}
        if any(quantities.get(item['productId'], 0) < item['quantity'] for item in selections):
            raise APIValidationError('Your saved cart changed. Return to the cart and review it before ordering.')

    products = {
        str(product.pk): product
        for product in public_products().filter(
            pk__in=[item['productId'] for item in selections],
        ).order_by('pk').select_for_update(of=('self',))
    }
    subtotal = Decimal('0.00')
    for item in selections:
        product = products.get(item['productId'])
        if product is None:
            raise APIValidationError(f"Product #{item['productId']} is no longer available.")
        if item['quantity'] > product.stock_quantity:
            raise APIValidationError(f'{product.name}: only {product.stock_quantity} units are currently available.')
        if item['unitPrice'] != product.price:
            raise APIValidationError(f'The price of {product.name} changed. Refresh and review your selection before ordering.')
        subtotal += product.price * item['quantity']

    address = data['address']
    order = Order.objects.create(
        user=user, request_id=data['requestId'], source=data['source'],
        customer_name=address['recipient'], customer_email=user.email,
        phone=address['phone'],
        delivery_address='\n'.join([
            address['street'],
            ' '.join(filter(None, [address['city'], address['postalCode']])),
            address['country'],
        ]),
        customer_notes=data['notes'], subtotal=subtotal,
    )
    lines = []
    for item in selections:
        product = products[item['productId']]
        lines.append(OrderItem(
            order=order, product=product, product_reference=str(product.pk),
            product_name=product.name, sku=product.sku or '',
            image_url=product_data(product)['image'] or '',
            quantity=item['quantity'], unit_price=product.price,
        ))
    OrderItem.objects.bulk_create(lines)
    if cart is not None:
        ordered = {item['productId']: item['quantity'] for item in selections}
        cart.items = [
            {'productId': item['productId'], 'quantity': item['quantity'] - ordered.get(item['productId'], 0)}
            for item in cart.items
            if item['quantity'] > ordered.get(item['productId'], 0)
        ]
        cart.save(update_fields=['items', 'updated_at'])
        clear_cart_alert(cart)
    new_order(order)
    return order, True


ALLOWED_TRANSITIONS = {
    Order.Status.PENDING: {Order.Status.CONTACTED, Order.Status.CONFIRMED, Order.Status.CANCELLED},
    Order.Status.CONTACTED: {Order.Status.CONFIRMED, Order.Status.CANCELLED},
    Order.Status.CONFIRMED: {Order.Status.PROCESSING, Order.Status.SHIPPED, Order.Status.CANCELLED},
    Order.Status.PROCESSING: {Order.Status.SHIPPED, Order.Status.CANCELLED},
    Order.Status.SHIPPED: {Order.Status.DELIVERED},
    Order.Status.DELIVERED: set(),
    Order.Status.CANCELLED: set(),
}


def validate_status_change(previous, status):
    if status != previous and status not in ALLOWED_TRANSITIONS.get(previous, set()):
        raise ValidationError({'status': 'This status change is not allowed. Review the current order status.'})


def confirmation_stock(order):
    lines = list(order.items.all())
    products = {
        product.pk: product
        for product in Product.objects.filter(
            pk__in=[line.product_id for line in lines if line.product_id],
        ).order_by('pk').select_for_update()
    }
    for line in lines:
        product = products.get(line.product_id)
        if product is None or product.stock_quantity < line.quantity:
            available = product.stock_quantity if product else 0
            raise ValidationError({
                'status': f'Cannot confirm: {line.product_name} needs {line.quantity} units; {available} available.',
            })
    return lines


def save_order_status(order, previous, confirmation_lines=None):
    """Called inside the admin change-form transaction with the order locked."""
    validate_status_change(previous.status, order.status)
    order.stock_reserved = previous.stock_reserved
    order.confirmed_at = previous.confirmed_at
    if order.status == Order.Status.CONFIRMED and not previous.stock_reserved:
        lines = confirmation_lines if confirmation_lines is not None else confirmation_stock(previous)
        for line in lines:
            Product.objects.filter(pk=line.product_id).update(
                stock_quantity=F('stock_quantity') - line.quantity, updated_at=timezone.now(),
            )
        order.stock_reserved = True
    if order.status == Order.Status.CANCELLED and previous.stock_reserved:
        lines = list(order.items.order_by('product_id'))
        # Consistent product-lock ordering also applies when cancelling several orders.
        list(Product.objects.filter(pk__in=[line.product_id for line in lines if line.product_id])
             .order_by('pk').select_for_update())
        for line in lines:
            if line.product_id:
                Product.objects.filter(pk=line.product_id).update(
                    stock_quantity=F('stock_quantity') + line.quantity, updated_at=timezone.now(),
                )
        order.stock_reserved = False
    if order.status == Order.Status.CONFIRMED and order.confirmed_at is None:
        order.confirmed_at = timezone.now()
    order.save()
