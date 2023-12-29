from django.db import models


# Create your models here.
class Category(models.Model):
    parent_category_id = models.IntegerField(null=False, default=0)
    original_category_name = models.TextField(null=False, default='')
    display_category_name = models.TextField(null=False, default='')
    has_children = models.BooleanField(default=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_category_name

    class Meta:
        db_table = 'categories'
