from django.urls import path
from .views import shop_auth


urlpatterns = [
    path('shop_auth/', shop_auth, name='shop_auth'),
]

