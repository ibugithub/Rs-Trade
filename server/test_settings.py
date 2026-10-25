"""Isolated tests; never use the configured production database or email backend."""
import os
from unittest.mock import patch

with patch.dict(os.environ, {
    'DATABASE_URL': '', 'SECRET_KEY': 'isolated-test-secret', 'DEBUG': 'True',
    'ALLOWED_HOSTS': 'testserver localhost 127.0.0.1',
    'CORS_ALLOWED_ORIGINS': 'http://localhost:3000', 'CSRF_TRUSTED_ORIGINS': 'http://localhost',
    'ACCESS_TOKEN_TIME': '30', 'REFRESH_TOKEN_TIME': '1440',
}):
    from .settings import *  # noqa: F403

DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}
CACHES = {
    'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'},
    'auth_throttles': {'BACKEND': 'django.core.cache.backends.dummy.DummyCache'},
}
