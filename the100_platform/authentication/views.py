from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages


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


def account(request):
    return render(request, template_name='shop-myaccount.html')
