from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], username=clean_data['username'], password=clean_data['password'])
		user_obj.save()
		return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def check_user(self, clean_data):
        email = clean_data.get('email')
        # from UserModel.objects get username by email
        username = UserModel.objects.get(email=email).username
        
        password = clean_data.get('password')
        
        if email and password:
            user = authenticate(email=email, username=username, password=password)
            if not user:
                raise ValidationError('Invalid email or password')
        else:
            raise ValidationError('Email and password are required')
        
        return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')