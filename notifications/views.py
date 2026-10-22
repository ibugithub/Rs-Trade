import json

from django.contrib.auth import get_user_model
from django.db import OperationalError, ProgrammingError, transaction
from django.db.models import Exists, Max, OuterRef
from django.http import JsonResponse
from django.urls import reverse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.http import require_GET, require_POST

from catalog.models import Cart
from orders.models import Order
from service_requests.models import ServiceRequest
from .models import Notification, NotificationRead


def permitted_notifications(site, request):
    kinds = []
    for model, kind in ((Order, 'order'), (Cart, 'cart'), (ServiceRequest, 'service')):
        model_admin = site._registry.get(model)
        if model_admin and model_admin.has_view_permission(request):
            kinds.append(kind)
    return Notification.objects.filter(kind__in=kinds)


def private_response(data, status=200):
    response = JsonResponse(data, status=status)
    response['Cache-Control'] = 'private, no-store'
    return response


def dashboard_counts(site, request):
    counts = {}
    for model, model_admin in site._registry.items():
        if model_admin.has_module_permission(request) and model_admin.has_view_permission(request) and any(model_admin.get_model_perms(request).values()):
            queryset = model_admin.get_queryset(request)
            if model is Cart:
                queryset = queryset.exclude(items=[])
            key = reverse(f'{site.name}:{model._meta.app_label}_{model._meta.model_name}_changelist')
            counts[key] = {'value': queryset.count(), 'label': 'active' if model is Cart else 'total'}
    return counts


@require_GET
def feed(request, site):
    try:
        as_of = timezone.now()
        reads = NotificationRead.objects.filter(
            user=request.user, notification_id=OuterRef('pk'), seen_at__gte=OuterRef('updated_at'),
        )
        notifications = permitted_notifications(site, request).annotate(is_read=Exists(reads))
        unread = notifications.filter(is_read=False)
        entries = []
        for notification in notifications[:40]:
            kind = notification.kind
            target_id = {'order': notification.order_id, 'cart': notification.cart_id, 'service': notification.service_request_id}[kind]
            route = {'order': 'orders_order_change', 'cart': 'catalog_cart_change', 'service': 'service_requests_servicerequest_change'}[kind]
            entries.append({
                'id': notification.pk, 'kind': kind, 'title': notification.title,
                'description': notification.description, 'read': notification.is_read,
                'updatedAt': notification.updated_at.isoformat(),
                'url': reverse(f'{site.name}:{route}', args=[target_id]),
            })
        return private_response({
            'items': entries, 'unread': unread.count(),
            'orderUnread': unread.filter(kind='order').count(),
            'cartUnread': unread.filter(kind='cart').count(),
            'serviceUnread': unread.filter(kind='service').count(),
            'latestOrderId': notifications.filter(kind='order').aggregate(value=Max('id'))['value'] or 0,
            'latestServiceId': notifications.filter(kind='service').aggregate(value=Max('id'))['value'] or 0,
            'asOf': as_of.isoformat(),
            'counts': dashboard_counts(site, request) if request.GET.get('counts') == '1' else {},
        })
    except (OperationalError, ProgrammingError):
        return private_response({'message': 'Notifications are unavailable. Apply pending migrations and try again.'}, 503)


@require_POST
def mark_read(request, site):
    try:
        data = json.loads(request.body)
        if not isinstance(data, dict):
            raise ValueError
        stamp = data.get('asOf') if data.get('all') is True else data.get('updatedAt')
        if not isinstance(stamp, str):
            raise ValueError
        cutoff = parse_datetime(stamp)
        if cutoff is None or timezone.is_naive(cutoff):
            raise ValueError
        cutoff = min(cutoff, timezone.now())
        if data.get('all') is not True and (type(data.get('id')) is not int or data['id'] < 1):
            raise ValueError
    except (ValueError, TypeError):
        return private_response({'message': 'Invalid notification request.'}, 400)

    try:
        with transaction.atomic():
            # Serialize concurrent read updates from this staff account's tabs.
            get_user_model().objects.select_for_update().get(pk=request.user.pk)
            notifications = permitted_notifications(site, request)
            if data.get('all') is not True:
                notifications = notifications.filter(pk=data['id'])
            reads = NotificationRead.objects.filter(
                user=request.user, notification_id=OuterRef('pk'), seen_at__gte=OuterRef('updated_at'),
            )
            notifications = notifications.filter(updated_at__lte=cutoff).annotate(is_read=Exists(reads)).filter(is_read=False)
            batch = []
            for notification in notifications.only('id', 'updated_at').iterator(chunk_size=500):
                batch.append(NotificationRead(
                    notification=notification, user=request.user,
                    seen_at=notification.updated_at,
                ))
                if len(batch) == 500:
                    NotificationRead.objects.bulk_create(batch, update_conflicts=True, update_fields=['seen_at'], unique_fields=['notification', 'user'])
                    batch = []
            if batch:
                NotificationRead.objects.bulk_create(batch, update_conflicts=True, update_fields=['seen_at'], unique_fields=['notification', 'user'])
        return private_response({'ok': True})
    except (OperationalError, ProgrammingError):
        return private_response({'message': 'Could not save notification read status. Please try again.'}, 503)
