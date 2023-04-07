from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def validate(self, data):
        # Check if a user with the same username already exists
        if UserModel.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'A user with this username already exists.'})
        # Check if a user with the same email already exists
        if UserModel.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        return data

    def create(self, validated_data):
        try:
            user = UserModel.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except Exception as e:
            # Log the error or handle it as appropriate for your application
            return None


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'password')

    def check_user(self, clean_data):
        email = clean_data.get('email')
        # from UserModel.objects get username by email
        username = UserModel.objects.get(email=email).username

        password = clean_data.get('password')

        if email and password:
            user = authenticate(email=email, username=username, password=password)
            if user:
                return user
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')
