from django.db import models
from imagekit.models import ImageSpecField, ProcessedImageField
from imagekit.processors import ResizeToFill
from products.models import Product


# Create your models here.

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = ProcessedImageField(upload_to='product_images',
                                processors=[ResizeToFill(300, 200)],
                                format='JPEG',
                                options={'quality': 90})

    class Meta:
        db_table = 'product_images'