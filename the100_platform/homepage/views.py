from django.shortcuts import render
from products.models import Product
from product_images.models import ProductImage
from django.forms.models import model_to_dict

# Create your views here.
def index(request):
    list_products = Product.objects.all().order_by('-view')[:8]
    list_product_dict = []
    for item in list_products:
        list_product_dict.append(model_to_dict(item))
    for item in list_product_dict:
        list_img_dict = []
        list_imgs = ProductImage.objects.filter(product_id=item['id'])
        for img in list_imgs:
            list_img_dict.append(model_to_dict(img))
        item['images'] = list_img_dict
    return render(request=request, template_name='index-shop.html',context={'list_products':list_product_dict})


def about(request):
    return render(request=request, template_name='shop-aboutus.html')


