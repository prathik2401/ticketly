import uuid
from django.db import models
from django.contrib.auth.models import User
from events.models import Event

# Creating a Booking model to store information about a booking
class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    number_of_tickets = models.PositiveIntegerField()
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('confirmed', 'Confirmed'), ('canceled', 'Canceled'), ('pending', 'Pending')],
        default='pending'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')],
        default='unpaid'
    )

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} - {self.event.name} ({self.status})"

    def confirm_booking(self):
        self.status = 'confirmed'
        self.save()

    def cancel_booking(self):
        self.status = 'canceled'
        self.save()

    class Meta:
        unique_together = ('user', 'event')
        ordering = ['-booking_date']
