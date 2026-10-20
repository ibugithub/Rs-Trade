from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('orders', '0001_initial')]

    operations = [
        migrations.AddField(
            model_name='order',
            name='customer_update',
            field=models.TextField(
                blank=True, max_length=2000,
                help_text='Visible to the customer on My orders. Do not include private staff notes.',
            ),
        ),
    ]
