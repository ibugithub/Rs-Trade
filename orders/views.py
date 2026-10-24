from django.db import OperationalError, ProgrammingError
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Order
from .serializers import CreateOrderSerializer
from .services import submit_order


def order_data(order):
    return {
        'id': str(order.public_id),
        'number': order.order_number,
        'status': order.status,
        'statusLabel': order.get_status_display(),
        'subtotal': str(order.subtotal),
        'phone': order.phone,
        'createdAt': order.created_at.isoformat(),
        'updatedAt': order.updated_at.isoformat(),
        'customerName': order.customer_name,
        'deliveryAddress': order.delivery_address,
        'notes': order.customer_notes,
        'customerUpdate': order.customer_update,
        'items': [{
            'productId': line.product_reference,
            'name': line.product_name,
            'quantity': line.quantity,
            'unitPrice': str(line.unit_price),
            'image': line.image_url,
            'sku': line.sku,
        } for line in order.items.all()],
    }


class PrivateOrderView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'private, no-store'
        return response

    def handle_exception(self, exc):
        if isinstance(exc, (OperationalError, ProgrammingError)):
            return Response({'detail': 'Orders are temporarily unavailable. Please try again later.'}, status=503)
        return super().handle_exception(exc)


class CreateOrderView(PrivateOrderView):
    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items')
        paginator = Paginator(orders, 10)
        page = paginator.get_page(request.query_params.get('page', 1))
        return Response({
            'results': [order_data(order) for order in page],
            'page': page.number,
            'pages': paginator.num_pages,
            'count': paginator.count,
        })

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order, created = submit_order(request.user, serializer.validated_data)
        return Response(order_data(order), status=201 if created else 200)


class OrderDetailView(PrivateOrderView):
    def get(self, request, public_id):
        order = get_object_or_404(
            Order.objects.filter(user=request.user).prefetch_related('items'), public_id=public_id,
        )
        return Response(order_data(order))


class OrderRequestLookupView(PrivateOrderView):
    def get(self, request, request_id):
        order = get_object_or_404(
            Order.objects.filter(user=request.user).prefetch_related('items'), request_id=request_id,
        )
        return Response(order_data(order))
