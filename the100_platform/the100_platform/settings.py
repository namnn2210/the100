"""
Django settings for the100_platform project.

Generated by 'django-admin startproject' using Django 5.0.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-w66ljarm3jh7v8^^r7kan2#q+zdfv((_-95p3cm2keb-qt%i$7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', '0.0.0.0', '103.241.43.112', 'https://the100.vn/', 'the100.vn', 'www.the100.vn']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'corsheaders',
    'homepage',
    'products',
    'authentication',
    'categories',
    'orders',
    'suppliers',
    'product_images',
    'tinymce',
    'shopee'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'the100_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'the100_platform.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'the100',
        'USER': 'root',
        'PASSWORD': 'ngocnam2210',
        'HOST': '103.241.43.112',  # Change this if your MySQL server is on a different host
        'PORT': '3306',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:8000',
    "http://localhost:8000",
    "http://103.241.43.112:8000",
    'https://the100.vn'
]

CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8000',
    "http://localhost:8000",
    'http://103.241.43.112:8000',
    'https://the100.vn'
]

TINYMCE_DEFAULT_CONFIG = {
    'height': 360,
    'width': 800,
    'toolbar': 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat',
    'plugins': 'advlist autolink lists link image charmap print preview anchor',
}

LOGOUT_REDIRECT_URL = '/'

PARTNER_ID = 2005954
LIVE_KEY = b'555253654474564e6a77526a714c6f73616453426a636c6a7a62696f5a6d7151'
SHOP_AUTH_HOST = "https://partner.shopeemobile.com"
SHOP_AUTH_PATH = "/api/v2/shop/auth_partner"
TOKEN_GET_PATH = "/api/v2/auth/token/get"
# SHOP_AUTH_REDIRECT_URL = "https://the100.vn/authentication/account"
SHOP_AUTH_REDIRECT_URL = "http://127.0.0.1:8000/authentication/account"