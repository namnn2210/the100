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
        host = "https://partner.test-stable.shopeemobile.com"
        path = "/api/v2/shop/auth_partner"
        redirect_url = "http://127.0.0.1:8000/authentication/account"
        partner_id = 1007418
        partner_key = b'5547537971494a4968454b694f6e6a595a6d4f526864525853634e5070664d47'
        tmp_base_string = "%s%s%s" % (partner_id, path, timest)
        base_string = tmp_base_string.encode()
        sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
        ##generate api
        url = host + path + "?partner_id=%s&timestamp=%s&sign=%s&redirect=%s" % (partner_id, timest, sign, redirect_url)
        print(url)
        return JsonResponse({'url': url})
