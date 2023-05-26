from django.db import models
class LM(models.Model):
    class Status(models.TextChoices):
        AWAITING_EVALUATION = 'AE'
        IN_EVALUATION = 'IE'
        OFFLINE = 'OFF'
        ONLINE = 'ON'

    name = models.CharField(max_length=30, primary_key=True)
    author = models.CharField(max_length=50)
    description = models.TextField()
    status = models.CharField(max_length=3, choices=Status.choices, default=Status.AWAITING_EVALUATION)

    def __str__(self):
        return self.name

    # dont create this table
    class Meta:
        abstract = True 
        

class LM_Script(LM):
    TYPE = "script"
    script = models.CharField(max_length=200)


class LM_API(LM):
    TYPE = "API"
    API = models.CharField(max_length=255)

