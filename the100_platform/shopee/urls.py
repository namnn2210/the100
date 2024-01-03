from django.urls import path
from .views import shop_auth, get_categories, push_categories, get_attributes, get_brands, get_dts_limit, \
    get_size_chart, get_item_limit, get_channel_list

urlpatterns = [
    path('shop_auth/', shop_auth, name='shop_auth'),
    path('get_categories/', get_categories, name='get_categories'),
    path('push_categories/', push_categories, name='push_categories'),
    path('get_attributes/', get_attributes, name='get_attributes'),
    path('get_brands/', get_brands, name='get_brands'),
    path('get_dts_limit/', get_dts_limit, name='get_dts_limit'),
    path('get_size_chart/', get_size_chart, name='get_size_chart'),
    path('get_item_limit/', get_item_limit, name='get_item_limit'),
    path('get_channel_list/', get_channel_list, name='get_channel_list')
]
