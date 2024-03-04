# Generated by Django 5.0 on 2024-02-29 15:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
        ('suppliers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('content', models.TextField(null=True)),
                ('unit_price', models.DecimalField(decimal_places=4, default=0.0, max_digits=20)),
                ('drop_price', models.DecimalField(decimal_places=4, default=0.0, max_digits=20)),
                ('view', models.IntegerField(default=666)),
                ('status', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='category', to='categories.category')),
                ('supplier', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='supplier', to='suppliers.supplier')),
            ],
            options={
                'db_table': 'products',
            },
        ),
    ]
