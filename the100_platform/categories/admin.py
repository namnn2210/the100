from django.contrib import admin
from .models import Category


# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name', 'status',
        'created_at',
        'updated_at')
    list_filter = ('name', 'status',)
    search_fields = ('name', 'status')
