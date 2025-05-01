from rest_framework import serializers
from .models import Profile
from users.models import User
from users.models import User
import os
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'signUp_by']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['user', 'Display_name', 'profile_picture', 'created_at', 'updated_at']

    
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return f"https://res.cloudinary.com/{os.environ.get("CLOUDINARY_CLOUD_NAME")}/{obj.profile_picture}"
        return None