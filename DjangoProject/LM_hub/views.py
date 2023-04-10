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

def lm_hub(request):
  data = {"LMs" : get_all_LMs()}
  return render(request, "lm-hub.html", data)

def login(request):
    if request.POST:
        data = {'user_id': request.POST['email'], 'password': request.POST['password']}
        url = reverse('authentication:login')
        response = requests.post(request.build_absolute_uri(url), data)
        if response.status_code == 200:
            return render(request, 'lm-hub.html', {"LMs" : get_all_LMs()})
    return render(request, "registration/login.html")

def register(request):
    if request.POST:
        print(request.POST)
        data = {'username': request.POST['username'], 'email': request.POST['email'], 'password': request.POST['password']}
        url = reverse('authentication:register')
        response = requests.post(request.build_absolute_uri(url), data)
        if response.status_code == 201:
            return redirect('login')
    return render(request, "register.html")

def get_all_LMs():
    scripts = LM_Script.objects.all()
    APIs = LM_API.objects.all()
    LMs = sorted(
        chain(scripts, APIs),
        key=lambda lm: lm.name,)
    return LMs

