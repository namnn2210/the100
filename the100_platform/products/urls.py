from django.urls import path
from .views import products, product_detail


urlpatterns = [
    path('', products, name='products'),
    path('detail/<int:product_id>/', product_detail, name='product_detail'),
    # path('add', product_add, name='product_add'),
]

