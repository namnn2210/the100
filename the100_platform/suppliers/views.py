from django.shortcuts import render, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib import messages
from .models import Supplier
from .forms import SupplierForm
from .forms import SupplierUpdateForm


def create_supplier(request):
    if request.method == 'POST':
        form = SupplierForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('supplier_list')
    else:
        form = SupplierForm()
    return render(request, 'admin/supplier/create.html', {'form': form})

def supplier_detail(request, supplier_id):
    supplier = Supplier.objects.get(pk=supplier_id)
    return render(request, 'admin/supplier/detail.html', {'supplier': supplier})

def update_supplier(request, supplier_id):
    supplier = Supplier.objects.get(pk=supplier_id)
    if request.method == 'POST':
        form = SupplierUpdateForm(request.POST, instance=supplier)
        if form.is_valid():
            form.save()
            return redirect('supplier_list')
    else:
        form = supplierUpdateForm(instance=supplier)
    return render(request, 'admin/supplier/update.html', {'form': form})

def delete_supplier(request, supplier_id):
    supplier = Supplier.objects.get(pk=supplier_id)
    if request.method == 'POST':
        supplier.delete()
        return redirect('supplier_list')
    return render(request, 'admin/supplier/delete.html', {'supplier': supplier})


# def supplier_list(request):
#     categories = supplier.objects.all()
#     return render(request, 'admin/supplier/list.html', {'categories': categories})

def supplier_list(request):
    query = request.GET.get('q','') # Lấy từ khóa tìm kiếm từ query string
    page_number = request.GET.get('page') # Lấy số trang từ query string, mặc định là 1

    if query:
        categories = Supplier.objects.filter(name__icontains=query) # Lọc danh sách supplier theo từ khóa tìm kiếm
    else:
        categories = Supplier.objects.all()

    paginator = Paginator(categories, 10) # Chia danh sách supplier thành các trang, mỗi trang có 10 supplier
    try:
        list_item = paginator.page(page_number)
    except PageNotAnInteger:
        list_item = paginator.page(1)
    except EmptyPage:
        list_item = paginator.page(paginator.num_pages)

    return render(request, 'admin/supplier/list.html', {'list_item': list_item, 'query': query})
