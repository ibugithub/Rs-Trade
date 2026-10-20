from .models import Notification


def new_order(order):
    Notification.objects.get_or_create(order=order, defaults={
        'kind': Notification.Kind.ORDER,
        'title': f'New order {order.order_number}',
        'description': f'{order.customer_name} placed an order. Call the customer to confirm.',
    })


def cart_updated(cart):
    if not cart.items:
        Notification.objects.filter(cart=cart).delete()
        return
    quantity = sum(item['quantity'] for item in cart.items)
    customer = cart.user.name.strip() or cart.user.email
    Notification.objects.update_or_create(cart=cart, defaults={
        'kind': Notification.Kind.CART,
        'title': 'Customer cart updated',
        'description': f'{customer} has {quantity} items across {len(cart.items)} products in their cart.',
    })


def clear_cart_alert(cart):
    # Checkout has its own order alert; don't keep an outdated cart reminder.
    Notification.objects.filter(cart=cart).delete()
