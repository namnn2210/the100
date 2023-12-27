from django.db import models


# Create your models here.
class Supplier(models.Model):
    name = models.TextField(null=False)
    description = models.TextField(null=False)
    address = models.TextField(null=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'suppliers'
