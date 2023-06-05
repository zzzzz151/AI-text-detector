import requests
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from itertools import chain

from django.urls import reverse

from AI_text_detector.models import LM_Script, LM_API
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

def model_hub(request):
    user = request.session.get('user')
    data = {"LMs" : get_all_LMs(user=user), 'user': user}
    return render(request, "model-hub.html", data)

def login(request):
    if request.POST:
        data = {'user_id': request.POST['email'], 'password': request.POST['password']}
        url = reverse('authentication:login')
        response = requests.post(request.build_absolute_uri(url), data)
        if response.status_code == 200:
            request.session['user'] = response.json().get('user')
            #request.session['LMs'] = get_all_LMs(user=response.json().get('user'))
            return redirect('model-hub')
    return render(request, "registration/login.html")

def register(request):
    if request.POST:
        data = {'username': request.POST['username'], 'email': request.POST['email'], 'password': request.POST['password']}
        url = reverse('authentication:register')
        print(url)
        response = requests.post(request.build_absolute_uri(url), data, timeout=3)
        if response.status_code == 201:
            return redirect('login')
    return render(request, "register.html")

def logout(request):
    print(request.POST)
    url = reverse('authentication:logout')
    response = requests.post(request.build_absolute_uri(url))
    if response.status_code == 200:
        request.session.pop('user')
        return redirect('model-hub')
    data = {"LMs" : get_all_LMs(user=user), 'user': user}
    return render(request, "model-hub.html", data)

def get_all_LMs(user=None):
    scripts = LM_Script.objects.all()
    APIs = LM_API.objects.all()
    LMs = list(chain(scripts, APIs))
    LMs = sorted(LMs, key=lambda lm: lm.name.lower())
    
    if user:
        user_LMs = [lm for lm in LMs if lm.author == user]
        other_LMs = [lm for lm in LMs if lm.author != user]
        LMs = user_LMs + other_LMs
    
    return LMs
