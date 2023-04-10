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
from django.urls import include, path, re_path
from AI_text_detector.views import handle_request, LM_Upload, get_LMs, my_LM_as_API, execute_code
from authentication.views import *
from LM_hub.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('authentication/', include('authentication.urls', namespace='authentication')),
    re_path(r'api/v1/?$', handle_request),
    re_path(r'api/v1/uploadLM/?$', LM_Upload.as_view()),
    re_path(r'api/v1/LMs/?$', get_LMs),
    re_path(r'api/v1/myLM/?$', my_LM_as_API),
    re_path(r'api/v1/executeCode/?$', execute_code),
    path('LM-hub', lm_hub, name="lm-hub"),
    path('login', login, name="login"),
    path('register', register, name="register"),

]