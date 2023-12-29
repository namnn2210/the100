from django.urls import path
from .views import shop_auth, get_categories, push_categories,get_attributes

urlpatterns = [
    path('shop_auth/', shop_auth, name='shop_auth'),
    path('get_categories/', get_categories, name='get_categories'),
    path('push_categories/', push_categories, name='push_categories'),
    path('get_attributes/', get_attributes, name='get_attributes'),
]
