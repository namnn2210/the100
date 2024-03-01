from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.
class Category(models.Model):
    name = models.CharField(null=False, max_length=100, default='')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if Category.objects.exclude(pk=self.pk).filter(name=self.name).exists():
            raise ValidationError("A category with this name already exists.")

    class Meta:
        db_table = 'categories'
