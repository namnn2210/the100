from django.contrib import admin
from .models import Category


# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'parent_category_id', 'original_category_name', 'display_category_name', 'has_children', 'status',
        'created_at',
        'updated_at')
    list_filter = ('display_category_name', 'parent_category_id', 'has_children',)
    search_fields = ('display_category_name', 'original_category_name', 'parent_category_id',)
