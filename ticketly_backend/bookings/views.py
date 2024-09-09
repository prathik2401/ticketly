from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from events.models import Event

class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id')  # Extract event_id from URL parameters
        try:
            # Check if the event exists
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        number_of_tickets = request.data.get('number_of_tickets')
        if number_of_tickets is None or number_of_tickets <= 0:
            return Response({"error": "Invalid number of tickets"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'user': request.user.id,
            'event': event_id,
            'number_of_tickets': number_of_tickets
        }
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Booking created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
