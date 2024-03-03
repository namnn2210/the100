from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError


# Create your models here.
class Supplier(models.Model):
    name = models.CharField(null=False, max_length=255)
    description = models.TextField()
    address = models.CharField(null=False, max_length=255)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if Supplier.objects.exclude(pk=self.pk).filter(name=self.name).exists():
            raise ValidationError("Tên nhà cung cấp đã tồn tại.")

    class Meta:
        db_table = 'suppliers'
