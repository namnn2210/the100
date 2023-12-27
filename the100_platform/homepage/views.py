from django.shortcuts import render


# Create your views here.
def index(request):
    return render(request=request, template_name='index-shop.html')


def about(request):
    return render(request=request, template_name='shop-aboutus.html')


