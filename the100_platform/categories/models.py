from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.
class Category(models.Model):
    name = models.CharField(null=False, max_length=255, default='')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (Created At: {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}, Updated At: {self.updated_at.strftime('%Y-%m-%d %H:%M:%S')})"

    def clean(self):
        super().clean()
        if Category.objects.exclude(pk=self.pk).filter(name=self.name).exists():
            raise ValidationError("Tên danh mục đã tồn tại.")

    class Meta:
        db_table = 'categories'
