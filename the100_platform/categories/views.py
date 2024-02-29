from django.shortcuts import render, redirect
from .models import Category

def create_category(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        status = request.POST.get('status', True)  # Default status is True
        category = Category.objects.create(name=name, status=status)
        return redirect('category_list', category_id=category.id)
    return render(request, 'admin/category/create.html')

def category_detail(request, category_id):
    category = Category.objects.get(pk=category_id)
    return render(request, 'admin/category/detail.html', {'category': category})

def update_category(request, category_id):
    category = Category.objects.get(pk=category_id)
    if request.method == 'POST':
        name = request.POST.get('name')
        status = request.POST.get('status', True)  # Default status is True
        category.name = name
        category.status = status
        category.save()
        return redirect('category_detail', category_id=category.id)
    return render(request, 'admin/category/detail.html', {'category': category})

def delete_category(request, category_id):
    category = Category.objects.get(pk=category_id)
    if request.method == 'POST':
        category.delete()
        return redirect('category_list')
    return render(request, 'admin/category/delete.html', {'category': category})

def category_list(request):
    categories = Category.objects.all()
    return render(request, 'admin/category/list.html', {'categories': categories})
