"""DjangoAPI URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path, re_path
from AI_text_detector.views import  my_model_as_API, execute_code, handle_text_request, handle_models_request
from authentication.views import *
from model_hub.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('authentication/', include('authentication.urls', namespace='authentication')),
    re_path(r'api/v1/?$', handle_text_request),
    re_path(r'api/v1/models/?$', handle_models_request),
    re_path(r'api/v1/my-model/?$', my_model_as_API),
    re_path(r'api/v1/execute-code/?$', execute_code),
    path('model-hub', model_hub, name="model-hub"),
    path('aidetector/login', login, name="login"),
    path('aidetector/register', register, name="register"),
    path('logout', logout, name='logout')
]