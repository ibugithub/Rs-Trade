from decimal import Decimal
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from catalog.models import Category, Deal, DealProduct, Product, SubCategory


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
    'Books & Stationery': [
        'Fiction Books',
        'Business Books',
        'School Supplies',
        'Office Supplies',
        'Art Supplies',
    ],
    'Automotive': [
        'Car Accessories',
        'Motorbike Accessories',
        'Car Electronics',
        'Cleaning Supplies',
        'Tools & Equipment',
    ],
}


class Command(BaseCommand):
    help = 'Create demo catalog data with 7 categories, 35 subcategories, and 175 products.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--deals-only',
            action='store_true',
            help='Only create or refresh demo deal records from existing products.',
        )

    def handle(self, *args, **options):
        if options['deals_only']:
            products = Product.objects.filter(status=Product.ProductStatus.ACTIVE).order_by('sku', 'name')[:12]
            created_deal_products = self.create_todays_best_deal(products)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Today's Best Deal ready: {created_deal_products} deal products created."
                )
            )
            return

        created_categories = 0
        created_subcategories = 0
        created_products = 0
        deal_products = []

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

                    if product_index == 1:
                        deal_products.append(product)

        created_deal_products = self.create_todays_best_deal(deal_products[:12])

        self.stdout.write(
            self.style.SUCCESS(
                'Demo catalog ready: '
                f'{created_categories} categories, '
                f'{created_subcategories} subcategories, '
                f'{created_products} products, '
                f'{created_deal_products} deal products created.'
            )
        )

    def create_todays_best_deal(self, products):
        now = timezone.now()
        deal, _ = Deal.objects.update_or_create(
            name="Today's Best Deal",
            defaults={
                'slug': 'todays-best-deal',
                'description': 'A rotating demo collection for the homepage best deal section.',
                'starts_at': now,
                'ends_at': now + timedelta(days=1),
                'is_active': True,
                'display_order': 1,
            },
        )

        created_deal_products = 0
        for display_order, product in enumerate(products, start=1):
            _, deal_product_created = DealProduct.objects.update_or_create(
                deal=deal,
                product=product,
                defaults={
                    'deal_price': (product.price * Decimal('0.90')).quantize(Decimal('0.01')),
                    'display_order': display_order,
                    'is_active': True,
                },
            )
            created_deal_products += int(deal_product_created)

        return created_deal_products
