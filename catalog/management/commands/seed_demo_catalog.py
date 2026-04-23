from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from catalog.models import Category, Product, SubCategory


DEMO_CATALOG = {
    'Electronics': [
        'Smartphones',
        'Laptops',
        'Headphones',
        'Cameras',
        'Gaming Consoles',
    ],
    'Home Appliances': [
        'Refrigerators',
        'Washing Machines',
        'Microwaves',
        'Air Conditioners',
        'Vacuum Cleaners',
    ],
    'Fashion': [
        'Men Clothing',
        'Women Clothing',
        'Footwear',
        'Watches',
        'Bags',
    ],
    'Beauty & Personal Care': [
        'Skincare',
        'Hair Care',
        'Fragrances',
        'Makeup',
        'Grooming Tools',
    ],
    'Sports & Outdoors': [
        'Fitness Equipment',
        'Cycling',
        'Camping',
        'Team Sports',
        'Outdoor Clothing',
    ],
}


class Command(BaseCommand):
    help = 'Create demo catalog data with 5 categories, 25 subcategories, and 125 products.'

    def handle(self, *args, **options):
        created_categories = 0
        created_subcategories = 0
        created_products = 0

        for category_index, (category_name, subcategory_names) in enumerate(DEMO_CATALOG.items(), start=1):
            category, category_created = Category.objects.update_or_create(
                name=category_name,
                defaults={
                    'slug': slugify(category_name),
                    'description': f'Demo products for {category_name.lower()}.',
                    'is_active': True,
                },
            )
            created_categories += int(category_created)

            for subcategory_index, subcategory_name in enumerate(subcategory_names, start=1):
                subcategory, subcategory_created = SubCategory.objects.update_or_create(
                    category=category,
                    name=subcategory_name,
                    defaults={
                        'slug': slugify(subcategory_name),
                        'description': f'Demo {subcategory_name.lower()} products in {category_name}.',
                        'is_active': True,
                    },
                )
                created_subcategories += int(subcategory_created)

                for product_index in range(1, 6):
                    product_name = f'{subcategory_name} Demo Product {product_index}'
                    price = Decimal('19.99') + Decimal(category_index * 50)
                    price += Decimal(subcategory_index * 7) + Decimal(product_index * 3)

                    product, product_created = Product.objects.update_or_create(
                        sku=f'DEMO-{category_index:02d}-{subcategory_index:02d}-{product_index:02d}',
                        defaults={
                            'category': category,
                            'subcategory': subcategory,
                            'name': product_name,
                            'slug': slugify(product_name),
                            'short_description': f'Demo {subcategory_name.lower()} item #{product_index}.',
                            'description': (
                                f'This is demo product {product_index} for the '
                                f'{subcategory_name} subcategory under {category_name}.'
                            ),
                            'price': price,
                            'compare_at_price': price + Decimal('10.00'),
                            'stock_quantity': 25 + product_index,
                            'status': Product.ProductStatus.ACTIVE,
                            'is_featured': product_index == 1,
                        },
                    )
                    created_products += int(product_created)

        self.stdout.write(
            self.style.SUCCESS(
                'Demo catalog ready: '
                f'{created_categories} categories, '
                f'{created_subcategories} subcategories, '
                f'{created_products} products created.'
            )
        )
