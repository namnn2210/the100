from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Supplier


# Register your models here.

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'address', 'status', 'created_at', 'updated_at')
    list_filter = ('name',)
    search_fields = ('name',)