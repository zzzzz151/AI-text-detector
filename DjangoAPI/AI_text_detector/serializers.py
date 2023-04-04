from rest_framework import serializers
from models import *

class LM_Script_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.LM_Script
        fields = "__all__"

class LM_Script_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.LM_API
        fields = "__all__"