from django.contrib.auth import login, logout
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.create(data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'error': 'Failed to create user.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        errors = serializer.errors
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.authenticated_user
            login(request, user)
            return Response({"user": user.username}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        response = Response({'user': serializer.data}, status=status.HTTP_200_OK)
        response.set_cookie(key='sessionid', value=request.COOKIES.get('sessionid'), httponly=True)
        return response
