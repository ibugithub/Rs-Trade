from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('catalog', '0003_account_cart'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='AccountCart',
            new_name='Cart',
        ),
    ]
