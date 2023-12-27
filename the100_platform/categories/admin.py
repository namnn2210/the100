from django.contrib import admin
from .models import Category


# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status', 'created_at', 'updated_at')
    list_filter = ('name',)
    search_fields = ('name',)

    # form = BlogModelAdminForm
