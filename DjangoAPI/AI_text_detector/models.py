from django.db import models

# Create your models here.

class LM_Script(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=30)
    script = models.FieldField(blank=True, default="", upload_to="LMs/")

class LM_API(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=30)
    api = models.CharField(max_length=200)
