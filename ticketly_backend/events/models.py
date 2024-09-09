from django.db import models
import uuid
from .storage_backends import CustomStorage
from django.conf import settings
from datetime import timedelta, timezone
class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date_time = models.DateTimeField()
    total_tickets = models.PositiveIntegerField(default=1)
    available_tickets = models.PositiveIntegerField(default=1)  
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    location = models.CharField(max_length=255)
    location_link = models.URLField(max_length=500)
    image = models.ImageField(upload_to='media/images/', blank=True, null=True, storage=CustomStorage())

    def clean(self):
        if self.date_time < timezone.now() + timedelta(days=1):
            raise ValueError("The event date must be at least 1 day from now.")

    def __str__(self):
        return self.name