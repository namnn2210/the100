from django.db import models
from suppliers.models import Supplier
from categories.models import Category
import random

# Create your models here.
class Product(models.Model):
    name = models.TextField(null=False)
    description = models.TextField(null=False)
    # images = models.ImageField(upload_to='product_images')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, related_name='supplier')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, related_name='category')
    unit_price = models.DecimalField(max_digits=20, decimal_places=4, default=0.0000)
    drop_price = models.DecimalField(max_digits=20, decimal_places=4, default=0.0000)
    view = models.IntegerField(default=random.randint(100,1000))
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'



