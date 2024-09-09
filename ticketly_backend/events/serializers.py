from rest_framework import serializers
from .models import Event

class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date_time', 'location', 'image']


class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ['id', 'user']

    def create(self, validated_data):
        return Event.objects.create(**validated_data)

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['name', 'description', 'date_time', 'total_tickets', 'available_tickets', 'ticket_price', 'location', 'location_link', 'image']

    def create(self, validated_data):
        return Event.objects.create(**validated_data)