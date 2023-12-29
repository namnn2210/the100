from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from urllib.parse import urlparse, parse_qs

from shopee.views import get_token_shop_level


# Create your views here.
def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        print(username, password)
        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        print('===========', user)

        if user is not None:
            # Log in the user
            login(request, user)

            # Redirect to a success page or another page after login.
            return redirect('index')  # Replace with the actual URL name or path

        else:
            # Authentication failed, display an error message.
            messages.error(request, 'Invalid credentials. Please try again.')
    return render(request, template_name='auth-login.html')


def signup(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        # You may want to add validation and error handling here.

        # Create a new User instance and save it to the database.
        User.objects.create_user(username=username, email=email, password=password, first_name=first_name,
                                 last_name=last_name)

        return redirect('index')  # Replace with the actual URL name or path
    return render(request, template_name='auth-signup.html')


def user_logout(request):
    logout(request)
    return redirect('index')


def reset(request):
    return render(request, template_name='auth-bs-reset.html')


def update_account(request):
    if request.method == 'POST':
        print('==========================')

        first_name = request.POST['first_name']
        last_name = request.POST['last_name']

        user = get_object_or_404(User, pk=request.user.id)
        user.first_name = first_name
        user.last_name = last_name

        user.save()
        return redirect('account')


def has_query_parameters(uri):
    # Parse the URI
    parsed_uri = urlparse(uri)

    # Check if the query component is present and not empty
    if parsed_uri.query:
        return True
    else:
        return False


def extract_parameters(uri):
    # Parse the URI
    parsed_uri = urlparse(uri)

    # Extract the query parameters as a dictionary
    query_parameters = parse_qs(parsed_uri.query)

    # Get the values for 'code' and 'shop_id'
    code = query_parameters.get('code', [None])[0]
    shop_id = query_parameters.get('shop_id', [None])[0]

    return code, shop_id


def account(request):
    request_uri = request.build_absolute_uri()
    if has_query_parameters(request_uri):
        code, shop_id = extract_parameters(request_uri)
        access_token, new_refresh_token = get_token_shop_level(code=code, shop_id=shop_id)
        request.session['access_token'] = access_token
        request.session['new_refresh_token'] = new_refresh_token
        render(request, template_name='shop-myaccount.html')
    return render(request, template_name='shop-myaccount.html')
