from django.urls import path
from .views import user_login, signup, reset, account, user_logout, update_account


urlpatterns = [
    path('login', user_login, name='login'),
    path('signup', signup, name='signup'),
    path('reset', reset, name='reset'),
    path('account', account, name='account'),
    path('logout/', user_logout, name='logout'),
    path('update_account/', update_account, name='update_account'),
]
