from django.db import models

class LM_Script(models.Model):
    name = models.CharField(max_length=30)
    script = models.FileField()


class LM_API(models.Model):
    name = models.CharField(max_length=30)
    api = models.CharField(max_length=255)
