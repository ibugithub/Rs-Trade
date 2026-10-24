from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    Display_name = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = CloudinaryField('profile_pictures', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    reference = models.CharField(max_length=500)
    label = models.CharField(max_length=60)
    recipient = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    street = models.CharField(max_length=500)
    city = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=120)
    is_default = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']
        constraints = [
            models.UniqueConstraint(fields=['user', 'reference'], name='unique_user_address_reference'),
            models.UniqueConstraint(fields=['user'], condition=models.Q(is_default=True), name='unique_user_default_address'),
        ]

    def __str__(self):
        return self.label
