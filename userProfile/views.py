from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer
from .models import Profile
from django.core.exceptions import ObjectDoesNotExist

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except ObjectDoesNotExist as e:
            return Response({'message': f'Profile not found: {e}'}, status=404)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        print('the old password is: ', old_password)
        print('the new password is: ', new_password)
        if not user.check_password(old_password):
            return Response({'message': 'Old password is incorrect'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=200)