import hashlib
import json
from cloudinary.exceptions import Error as CloudinaryError

from django.db import OperationalError, ProgrammingError, transaction
from django.utils.crypto import constant_time_compare
from rest_framework.exceptions import APIException
from rest_framework.permissions import AllowAny
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from notifications.services import new_service_request
from .models import RequestedService, Service, ServiceRequest
from .serializers import CreateServiceRequestSerializer


class InquiryThrottle(SimpleRateThrottle):
    scope = 'service_inquiry'
    rate = '20/hour'

    def get_cache_key(self, request, view):
        ident = f'user:{request.user.pk}' if request.user.is_authenticated else f'ip:{self.get_ident(request)}'
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class SubmissionConflict(APIException):
    status_code = 409
    default_detail = 'This submission reference was already used with different details. Please reload to start a new inquiry.'


@transaction.atomic
def submit_inquiry(user, data):
    payload = dict(data)
    request_id = payload.pop('requestId')
    services = payload.pop('services')
    image = payload.pop('image', None)
    image_hash = {}
    if image:
        digest = hashlib.sha256()
        for chunk in image.chunks():
            digest.update(chunk)
        image.seek(0)
        image_hash['imageHash'] = digest.hexdigest()
    user_id = user.pk if user.is_authenticated else None
    digest = hashlib.sha256(json.dumps({**payload, **image_hash, 'services': services, 'user_id': user_id}, sort_keys=True).encode()).hexdigest()
    inquiry, created = ServiceRequest.objects.get_or_create(
        request_id=request_id,
        defaults={**payload, 'user_id': user_id, 'submission_hash': digest},
    )
    if not constant_time_compare(inquiry.submission_hash, digest):
        raise SubmissionConflict()
    if created:
        if image:
            inquiry.image = image
            inquiry.save(update_fields=['image'])
        RequestedService.objects.bulk_create([RequestedService(request=inquiry, service=service) for service in services])
        new_service_request(inquiry)
    return inquiry, created


class CreateServiceRequestView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    throttle_classes = [InquiryThrottle]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = CreateServiceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry, created = submit_inquiry(request.user, serializer.validated_data)
        return Response({
            'number': inquiry.request_number,
            'services': [dict(Service.choices)[value] for value in serializer.validated_data['services']],
            'status': inquiry.get_status_display(),
        }, status=201 if created else 200)

    def handle_exception(self, exc):
        if isinstance(exc, CloudinaryError):
            return Response({'detail': 'The image could not be uploaded. Please try again shortly.'}, status=503)
        if isinstance(exc, (OperationalError, ProgrammingError)):
            return Response({'detail': 'Service requests are temporarily unavailable. Please try again later.'}, status=503)
        return super().handle_exception(exc)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'private, no-store'
        return response
