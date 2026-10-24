from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
  def create_user(self, email, name, password=None, signUp_by='email', **extra_fields):
    if not email:
        raise ValueError('Users must have an email address')
    parts = name.strip().split(maxsplit=1)
    extra_fields.setdefault('first_name', parts[0] if parts else '')
    extra_fields.setdefault('last_name', parts[1] if len(parts) > 1 else '')
    user = self.model(email=self.normalize_email(email), name=name, signUp_by=signUp_by, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, name, password, **extra_fields):
    user = self.create_user(email, name, password)
    user.is_admin = True
    user.is_verified = True
    user.is_superuser = True
    user.save(using=self._db)
    return user

class User(AbstractBaseUser, PermissionsMixin):
  SIGNUP_METHODS = [
    ('email', 'Email'),
    ('google', 'Google'),
    ('facebook', 'Facebook'),
    ('microsoft', 'Microsoft'),
  ]
  email = models.EmailField(unique=True)
  name = models.CharField(max_length=255)
  first_name = models.CharField(max_length=255, blank=True, default='')
  last_name = models.CharField(max_length=255, blank=True, default='')
  signUp_by = models.CharField(max_length=20, choices=SIGNUP_METHODS, default='email')
  is_verified = models.BooleanField(default=False)
  is_admin = models.BooleanField(default=False)
  is_superuser = models.BooleanField(default=False)
  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name']

  def __str__(self):
    return self.email

  @property
  def is_staff(self):
    return self.is_admin
