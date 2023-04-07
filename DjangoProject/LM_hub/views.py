from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from itertools import chain
from AI_text_detector.models import LM_Script, LM_API

def lm_hub(request):
  data = {"LMs" : get_all_LMs()}
  return render(request, "lm-hub.html", data)

def login(request):
  return render(request, "login.html")

def register(request):
  return render(request, "register.html")

def get_all_LMs():
    scripts = LM_Script.objects.all()
    APIs = LM_API.objects.all()
    LMs = sorted(
        chain(scripts, APIs),
        key=lambda lm: lm.name,)
    return LMs

