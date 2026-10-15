from django.core.paginator import EmptyPage, Paginator
from django.db.models import Q
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET
from time import perf_counter

from .models import Product


PAGE_SIZE = 12
MAX_BATCH_SIZE = 100
ORDERINGS = {
    'featured': ('-is_featured', '-created_at', '-pk'),
    'name': ('name', 'pk'),
    'price-low': ('price', 'pk'),
    'price-high': ('-price', '-pk'),
}


def public_products():
    return Product.objects.filter(
        Q(subcategory__isnull=True) | Q(subcategory__is_active=True),
        status=Product.ProductStatus.ACTIVE,
        category__is_active=True,
    )


def product_data(product):
    image_url = None
    if product.image:
        try:
            image_url = product.image.build_url(
                secure=True, fetch_format='auto', quality='auto',
            )
        except ValueError:
            pass
    return {
        'id': str(product.pk),
        'name': product.name,
        'slug': product.slug,
        'sku': product.sku,
        'description': product.description or product.short_description,
        'shortDescription': product.short_description,
        'price': float(product.price),
        'image': image_url,
        'stockQuantity': product.stock_quantity,
        'isFeatured': product.is_featured,
    }


@never_cache
@require_GET
def product_list(request):
    products = public_products()
    if 'ids' in request.GET:
        raw_ids = request.GET['ids'].split(',')
        if len(raw_ids) > MAX_BATCH_SIZE or any(
            not value.isascii() or not value.isdigit() or len(value) > 19
            or not 0 < int(value) <= 9223372036854775807
            for value in raw_ids
        ):
            return JsonResponse({'error': 'Invalid product selection.'}, status=400)
        products = products.filter(pk__in=[int(value) for value in raw_ids])
        return JsonResponse({'results': [product_data(product) for product in products]})
    query = request.GET.get('q', '').strip()[:200]
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(sku__icontains=query)
            | Q(short_description__icontains=query) | Q(description__icontains=query)
        )
    ordering = ORDERINGS.get(request.GET.get('ordering', 'featured'), ORDERINGS['featured'])
    paginator = Paginator(products.order_by(*ordering), PAGE_SIZE)
    started = perf_counter()
    connection.ensure_connection()
    connected = perf_counter()
    count = paginator.count
    counted = perf_counter()
    try:
        page = paginator.page(int(request.GET.get('page', '1')))
    except (ValueError, EmptyPage):
        return JsonResponse({'error': 'Page not found.'}, status=404)
    rows = list(page)
    fetched = perf_counter()
    response = JsonResponse({
        'results': [product_data(product) for product in rows],
        'count': count,
        'page': page.number,
        'pageSize': PAGE_SIZE,
        'nextPage': page.next_page_number() if page.has_next() else None,
    })
    response['Server-Timing'] = (
        f'connect;dur={(connected - started) * 1000:.1f}, '
        f'count;dur={(counted - connected) * 1000:.1f}, '
        f'products;dur={(fetched - counted) * 1000:.1f}, '
        f'serialize;dur={(perf_counter() - fetched) * 1000:.1f}'
    )
    return response


@never_cache
@require_GET
def product_detail(request, pk):
    return JsonResponse(product_data(get_object_or_404(public_products(), pk=pk)))
