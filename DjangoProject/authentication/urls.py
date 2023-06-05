from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
	path('aidetector/register', views.UserRegister.as_view(), name='register'),
	path('aidetector/login', views.UserLogin.as_view(), name='login'),
	path('aidetector/logout', views.UserLogout.as_view(), name='logout'),
	path('aidetector/user', views.UserView.as_view(), name='user'),
]