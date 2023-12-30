from django.urls import path
from .views import admin_index, list_category, add_product, get_children

urlpatterns = [
    path('', admin_index, name='admin_index'),

    # Category
    path('category/list/', list_category, name='list_category'),
    path('category/children/', get_children, name='get_children'),

    # Product
    path('product/add/', add_product, name='add_product'),

]
