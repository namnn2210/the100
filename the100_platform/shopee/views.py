from django.shortcuts import render
import hmac
import json
import time
import requests
import hashlib
from django.http import JsonResponse


# Create your views here.
def shop_auth(request):
    if request.method == 'POST':

        timest = int(time.time())
        host = "https://partner.shopeemobile.com"
        path = "/api/v2/shop/auth_partner"
        redirect_url = "http://0.0.0.0:8000/authentication/account"
        partner_id = 2005954
        partner_key = b'555253654474564e6a77526a714c6f73616453426a636c6a7a62696f5a6d7151'
        tmp_base_string = "%s%s%s" % (partner_id, path, timest)
        base_string = tmp_base_string.encode()
        sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
        ##generate api
        url = host + path + "?partner_id=%s&timestamp=%s&sign=%s&redirect=%s" % (partner_id, timest, sign, redirect_url)
        print(url)
        return JsonResponse({'url': url})
