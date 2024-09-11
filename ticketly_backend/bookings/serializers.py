from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    date_time = serializers.ReadOnlyField(source='event.date_time')
    location = serializers.ReadOnlyField(source='event.location')
    location_link = serializers.ReadOnlyField(source='event.location_link')
    ticket_price = serializers.ReadOnlyField(source='event.ticket_price')

    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'number_of_tickets', 'booking_date', 'date_time', 'location', 'location_link', 'ticket_price', 'status']
