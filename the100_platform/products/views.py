from django.shortcuts import render, get_object_or_404
from .models import Product
from django.core.paginator import Paginator

# Create your views here.
def products(request):
    list_products = Product.objects.prefetch_related('images').filter(status=True)
    for item in list_products:
        print(item.images)
    items_per_page = 10
    paginator = Paginator(list_products, items_per_page)
    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)
    return render(request=request, template_name='shop-lists.html', context={'page': page})


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id, status=True)
    return render(request=request, template_name='shop-product-detail.html', context={'product': product})
