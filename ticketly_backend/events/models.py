from django.db import models
import uuid
from .storage_backends import CustomStorage

class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    date_and_time = models.DateTimeField()
    total_tickets = models.PositiveIntegerField()
    location = models.CharField(max_length=255, blank=True, null=True)
    location_link = models.URLField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='media/images/', blank=True, null=True, storage=CustomStorage())

    def __str__(self):
        return self.name

    def get_available_tickets(self):
        return sum(tier.available_tickets for tier in self.tickettier_set.all())

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class TicketTier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    tier_name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_tickets = models.PositiveIntegerField()
    total_tickets = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.tier_name} for {self.event.name}"

    def save(self, *args, **kwargs):
        if self.available_tickets > self.total_tickets:
            self.available_tickets = self.total_tickets
        super().save(*args, **kwargs)