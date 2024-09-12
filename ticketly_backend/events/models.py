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
    available_tickets = models.PositiveIntegerField(default=1, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    location = models.CharField(max_length=255)
    location_link = models.URLField(max_length=500)
    image = models.ImageField(upload_to='media/images/', blank=True, null=True, storage=CustomStorage())
    staff = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='events_staff', blank=False, default=True) 

    # Validates that the event date is at least 1 day from now
    def clean(self):
        if self.date_time < timezone.now() + timedelta(days=1):
            raise ValueError("The event date must be at least 1 day from now.")
    # Ensures available_tickets is set to total_tickets if not provided, then saves the event.
    def save(self, *args, **kwargs):
        if self.available_tickets is None:
            self.available_tickets = self.total_tickets
        super().save(*args, **kwargs)
    # Returns the name of the event as its string representation
    def __str__(self):
        return self.name