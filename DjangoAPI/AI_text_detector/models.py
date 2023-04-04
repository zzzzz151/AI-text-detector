from django.db import models
class LM(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    author = models.CharField(max_length=50)
    description = models.TextField()

    def __str__():
        return self.name

    # dont create this table
    class Meta:
        abstract = True 
        
class LM_Script(LM):
    script = models.FileField()


class LM_API(LM):
    API = models.CharField(max_length=255)

