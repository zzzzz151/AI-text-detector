from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


class UserRegisterTestCase(APITestCase):
    def test_register_user(self):
        url = reverse('register')
        data = {'username': 'test_user', 'email': 'test@test.com', 'password': 'test1234'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test_user')


class UserLoginLogoutTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('test_user', 'test@test.com', 'test1234')

    def test_login_user_with_correct_credentials(self):
        url = reverse('login')
        data = {'email': 'test@test.com', 'password': 'test1234'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('sessionid' in response.cookies)

    def test_login_user_with_incorrect_credentials(self):
        url = reverse('login')
        data = {'email': 'test@test.com', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('sessionid' in response.cookies)

    def test_logout_user(self):
        self.client.login(email='test@test.com', password='test1234')
        url = reverse('logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse('sessionid' in response.cookies)


class UserViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('test_user', 'test@test.com', 'test1234')
        url = reverse('login')
        data = {'email': 'test@test.com', 'password': 'test1234'}
        response = self.client.post(url, data, format='json')
        self.assertTrue(self.user.is_authenticated)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('sessionid' in response.cookies)
        self.cookie = self.client.cookies.get('sessionid')

    def test_get_user(self):
        url = reverse('user')
        headers = {'Cookie': f'sessionid={self.cookie.value}'}
        response = self.client.get(url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'test_user')
        self.assertTrue('sessionid' in response.cookies)
