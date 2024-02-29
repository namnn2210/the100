from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(null=False, max_length=100, unique=True,default='')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'categories'
