from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password')

    def validate(self, data):
        # Check if a user with the same username already exists
        if UserModel.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError(_('A user with this username already exists.'))
        # Check if a user with the same email already exists
        if UserModel.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(_('A user with this email already exists.'))
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


class UserLoginSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    password = serializers.CharField()
    authenticated_user = None

    def validate(self, data):
        user_id = data.get('user_id')
        password = data.get('password')

        # Determine if the user_id is an email or a username
        if '@' in user_id:
            try:
                user_id = UserModel.objects.get(email=user_id.lower()).username
            except UserModel.DoesNotExist:
                raise serializers.ValidationError(_('User with this email does not exist.'))

        kwargs = {'username': user_id}

        # Authenticate the user using both email and username
        user = authenticate(**kwargs, password=password)
        if user:
            self.authenticated_user = user
        else:
            raise serializers.ValidationError(_('Invalid email or password.'))

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')
