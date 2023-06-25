from django.db import models

class Topic(models.Model):
    name = models.CharField(max_length=100)
    date = models.CharField(max_length=50)
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.name