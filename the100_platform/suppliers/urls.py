from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_supplier, name='create_supplier'),
    path('<int:supplier_id>/', views.supplier_detail, name='supplier_detail'),
    path('<int:supplier_id>/update/', views.update_supplier, name='update_supplier'),
    path('<int:supplier_id>/delete/', views.delete_supplier, name='delete_supplier'),
    path('', views.supplier_list, name='supplier_list'),
]
