from django.shortcuts import render
from categories.models import Category
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.core import serializers

import json


# Create your views here.
def admin_index(request):
    return render(request=request, template_name='admin/index.html')


def list_category(request):
    list_categories = Category.objects.filter(status=1).all()
    items_per_page = 10
    paginator = Paginator(list_categories, items_per_page)
    page_number = request.GET.get('page')
    category_page = paginator.get_page(page_number)
    return render(request=request, template_name='admin/category/list.html',
                  context={'category_page': category_page})


def get_children(request):
    if request.method == 'POST':
        category_id = json.loads(request.body.decode('utf-8')).get('categoryId')
        print(category_id)
        list_children_query = Category.objects.filter(status=1, parent_category_id=category_id).all()
        data = serializers.serialize('json', list_children_query)
        return JsonResponse({'categories': data}, safe=False)

def get_product_attribute(request):
    pass

def add_product(request):
    list_categories = Category.objects.filter(status=1, parent_category_id=0).all()
    return render(request=request, template_name='admin/product/add.html',
                  context={'list_categories': list_categories})

