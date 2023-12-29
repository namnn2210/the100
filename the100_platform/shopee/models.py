from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class ShopAuth(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    code = models.TextField(null=False)
    shop_id = models.IntegerField(null=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shop_auth'


class ShopAccessToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    access_token = models.TextField(null=False)
    refresh_token = models.TextField(null=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shop_access_token'
