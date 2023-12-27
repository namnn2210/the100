from django.contrib import admin
from .models import Product
from product_images.models import ProductImage  # Import your models
from django.utils.html import format_html


class ProductImageInline(admin.TabularInline):  # You can also use admin.StackedInline for a different display style
    model = ProductImage
    extra = 3  # Number of empty forms to display (you can adjust this as needed)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]

    list_display = (
        'name', 'description', 'display_images', 'supplier', 'category', 'unit_price', 'drop_price', 'status', 'created_at',
        'updated_at')

    def display_images(self, obj):
        images = obj.images.all()  # Assuming you have a related name 'images' for ProductImage
        if images:
            first_image = images.first()
            return format_html('<a href="{}"><img src="{}" width="50" height="50" /></a>', first_image.image.url,
                               first_image.image.url)
        return "No Images"

    display_images.short_description = 'Images'

    list_filter = ('name', 'supplier', 'category', 'unit_price', 'drop_price',)
    search_fields = ('name',)


# Register your models and admin classes
# admin.site.register(Product, ProductAdmin)
# admin.site.register(ProductImage)
