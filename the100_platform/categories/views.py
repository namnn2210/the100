from django.shortcuts import render, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib import messages
from .models import Category
from .forms import CategoryForm
from .forms import CategoryUpdateForm


def create_category(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('category_list')
    else:
        form = CategoryForm()
    return render(request, 'admin/category/create.html', {'form': form})

def category_detail(request, category_id):
    category = Category.objects.get(pk=category_id)
    return render(request, 'admin/category/detail.html', {'category': category})

def update_category(request, category_id):
    category = Category.objects.get(pk=category_id)
    if request.method == 'POST':
        form = CategoryUpdateForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect('category_list')
    else:
        form = CategoryUpdateForm(instance=category)
    return render(request, 'admin/category/update.html', {'form': form})

def delete_category(request, category_id):
    category = Category.objects.get(pk=category_id)
    if request.method == 'POST':
        category.delete()
        return redirect('category_list')
    return render(request, 'admin/category/delete.html', {'category': category})

def category_list(request):
    query = request.GET.get('q','') # Lấy từ khóa tìm kiếm từ query string
    page_number = request.GET.get('page') # Lấy số trang từ query string, mặc định là 1

    if query:
        categories = Category.objects.filter(name__icontains=query) # Lọc danh sách category theo từ khóa tìm kiếm
    else:
        categories = Category.objects.all()

    paginator = Paginator(categories, 2) # Chia danh sách category thành các trang, mỗi trang có 10 category
    try:
        list_item = paginator.page(page_number)
    except PageNotAnInteger:
        list_item = paginator.page(1)
    except EmptyPage:
        list_item = paginator.page(paginator.num_pages)

    return render(request, 'admin/category/list.html', {'list_item': list_item, 'query': query})
