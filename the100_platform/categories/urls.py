from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_category, name='create_category'),
    path('<int:category_id>/', views.category_detail, name='category_detail'),
    path('<int:category_id>/update/', views.update_category, name='update_category'),
    path('<int:category_id>/delete/', views.delete_category, name='delete_category'),
    path('', views.category_list, name='category_list'),
]
