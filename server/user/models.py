from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Add your custom fields here
    age = models.IntegerField(null=True, blank=True)
    profile_picture = models.CharField(max_length=2000, null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(max_length=254)

    def __str__(self):
        return self.email
    