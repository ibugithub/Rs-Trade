"""Rate-limit errors without changing existing commerce/account response formats."""
from math import ceil
from rest_framework.exceptions import Throttled
from rest_framework.views import exception_handler


def auth_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(exc, Throttled):
        wait = ceil(exc.wait) if exc.wait is not None else None
        response.data = {
            'detail': f'Too many requests. Please try again in {wait} seconds.' if wait is not None else 'Too many requests. Please try again later.',
            'code': 'throttled',
        }
        if wait is not None:
            response.data['retry_after'] = wait
    return response
