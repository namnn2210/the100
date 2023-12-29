from django.shortcuts import render
import hmac
import json
import time
import requests
import hashlib
from django.http import JsonResponse
from django.conf import settings


# Create your views here.
def shop_auth(request):
    if request.method == 'POST':
        timest = int(time.time())
        host = settings.SHOP_AUTH_HOST
        path = settings.SHOP_AUTH_PATH
        redirect_url = settings.SHOP_AUTH_REDIRECT_URL
        partner_id = settings.PARTNER_ID
        partner_key = settings.LIVE_KEY
        tmp_base_string = "%s%s%s" % (partner_id, path, timest)
        base_string = tmp_base_string.encode()
        sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
        ##generate api
        url = host + path + "?partner_id=%s&timestamp=%s&sign=%s&redirect=%s" % (partner_id, timest, sign, redirect_url)
        print(url)
        return JsonResponse({'url': url})


def get_token_shop_level(code, shop_id):
    partner_id = settings.PARTNER_ID
    partner_key = settings.LIVE_KEY
    timest = int(time.time())
    host = settings.SHOP_AUTH_HOST
    path = settings.TOKEN_GET_PATH
    body = {"code": code, "shop_id": shop_id, "partner_id": partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s" % (partner_id, timest, sign)
    # print(url)
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token
