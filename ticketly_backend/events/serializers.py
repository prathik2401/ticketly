from rest_framework import serializers
from .models import Event, TicketTier

class EventSerializer(serializers.ModelSerializer):
    available_tickets = serializers.ReadOnlyField(source='get_available_tickets')

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date_and_time', 'total_tickets', 'location', 'location_link', 'image', 'available_tickets']

class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ['id', 'event', 'tier_name', 'price', 'available_tickets', 'total_tickets']
