from django.shortcuts import render, get_object_or_404
from .models import Product
from django.core.paginator import Paginator
from product_images.models import ProductImage
from django.forms.models import model_to_dict

# Create your views here.
def products(request):
    list_products = Product.objects.prefetch_related('images').filter(status=True)
    list_product_dict = []
    for item in list_products:
        list_product_dict.append(model_to_dict(item))
    for item in list_product_dict:
        list_img_dict = []
        list_imgs = ProductImage.objects.filter(product_id=item['id'])
        for img in list_imgs:
            list_img_dict.append(model_to_dict(img))
        item['images'] = list_img_dict
    items_per_page = 10
    paginator = Paginator(list_product_dict, items_per_page)
    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)
    return render(request=request, template_name='shop-lists.html', context={'page': page})


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id, status=True)
    product_dict = model_to_dict(product)
    list_imgs = ProductImage.objects.filter(product_id=product_dict['id'])
    list_img_dict = []
    for img in list_imgs:
        list_img_dict.append(model_to_dict(img))
        product_dict['images'] = list_img_dict
    return render(request=request, template_name='shop-product-detail.html', context={'product': product_dict})
