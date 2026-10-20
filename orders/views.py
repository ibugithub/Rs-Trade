from django.db import OperationalError, ProgrammingError
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
        'items': [{
            'productId': line.product_reference,
            'name': line.product_name,
            'quantity': line.quantity,
            'unitPrice': str(line.unit_price),
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
