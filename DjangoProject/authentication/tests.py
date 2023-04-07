from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json
import os
from django.conf import settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'DjangoAPI.settings'
settings.configure()


class TestViews(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword'
        }
        self.invalid_payload = {
            'username': '',
            'email': 'testuser@example.com',
            'password': 'testpassword'
        }
        self.user = User.objects.create_user(
            username='testuser', 
            email='testuser@example.com',
            password='testpassword'
        )

    def test_register_view(self):
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        response = self.client.post(
            self.register_url,
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_login_view(self):
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'testuser@example.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('access' in response.json())
        self.assertTrue('refresh' in response.json())

        response = self.client.post(
            self.login_url,
            data=json.dumps({
                'email': 'testuser@example.com',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
