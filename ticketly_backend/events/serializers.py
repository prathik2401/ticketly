from rest_framework import serializers
from .models import Event
from accounts.models import User
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
    staff = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)  # List of staff
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date_time', 'total_tickets', 'available_tickets', 'ticket_price', 'location', 'location_link', 'image', 'staff']

    def update(self, instance, validated_data):
        staff_users = validated_data.pop('staff', [])
        event = super().update(instance, validated_data)

        for user in staff_users:
            user.is_staff = True
            user.save()
            event.staff.add(user) 

        return event
