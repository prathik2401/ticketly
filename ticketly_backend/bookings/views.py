from rest_framework import generics
from rest_framework.exceptions import ValidationError
from .models import Booking, Event
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from django.db import transaction

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        event_id = self.request.data.get('event')
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise ValidationError("The event does not exist.")
        
        if user.userprofile.is_host and event.user == user:
            raise ValidationError("You cannot book tickets for your own event.")
        
        number_of_tickets = serializer.validated_data['number_of_tickets']
        ticket_tiers = event.tickettier_set.all()
        
        for tier in ticket_tiers:
            if tier.available_tickets >= number_of_tickets:
                tier.available_tickets -= number_of_tickets
                tier.save()
                break
        else:
            raise ValidationError("Not enough tickets available.")
        
        serializer.save(user=user)

# RETRIEVE, UPDATE, and DELETE Booking
class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
