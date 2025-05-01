from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
  def create_user(self, email, name, password=None, signUp_by='Email', **extra_fields):
    if not email:
        raise ValueError('Users must have an email address')
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

class User(AbstractBaseUser):
  SIGNUP_METHODS = [
    ('email', 'Email'),
    ('google', 'Google'),
    ('facebook', 'Facebook'),
    ('microsoft', 'Microsoft'),
  ]
  email = models.EmailField(unique=True)
  name = models.CharField(max_length=255)
  signUp_by = models.CharField(max_length=20, choices=SIGNUP_METHODS, default='email')
  is_verified = models.BooleanField(default=False)
  is_admin = models.BooleanField(default=False)
  is_superuser = models.BooleanField(default=False)
  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name']

  def __str__(self):
    return self.email

  def has_perm(self, perm, obj=None):
    return True

  def has_module_perms(self, app_label):
    return True

  @property
  def is_staff(self):
    return self.is_admin