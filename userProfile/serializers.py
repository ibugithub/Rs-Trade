from rest_framework import serializers
from .models import Profile
from users.models import User
import os
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'first_name', 'last_name', 'signUp_by']


class UpdateNameSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255, allow_blank=True, required=False, default='')

    def validate(self, data):
        full_name = ' '.join(filter(None, [data['first_name'], data['last_name']]))
        if len(full_name) > 255:
            raise serializers.ValidationError('Your full name must be 255 characters or fewer.')
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['user', 'Display_name', 'profile_picture', 'created_at', 'updated_at']


    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return f'https://res.cloudinary.com/{os.environ.get("CLOUDINARY_CLOUD_NAME")}/{obj.profile_picture}'
        return None
