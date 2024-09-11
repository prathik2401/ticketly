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
        event_id = kwargs.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is the host
        if request.user == event.user:
            return Response({"error": "Hosts cannot book their own events"}, status=status.HTTP_403_FORBIDDEN)

        # Check if the user already has a booking for this event
        existing_booking = Booking.objects.filter(user=request.user, event=event).exists()
        if existing_booking:
            return Response({"error": "You have already booked for this event"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the number of tickets
        number_of_tickets = request.data.get('number_of_tickets')
        if number_of_tickets is None or int(number_of_tickets) <= 0:
            return Response({"error": "Invalid number of tickets"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if enough tickets are available
        if event.available_tickets < int(number_of_tickets):
            return Response({"error": "Not enough tickets available"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the booking
        data = {
            'user': request.user.id,
            'event': event_id,
            'number_of_tickets': number_of_tickets
        }
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            booking = serializer.save()

            # Decrement the available tickets for the event
            event.available_tickets -= int(number_of_tickets)
            event.save()

            return Response({
                "message": "Booking created successfully",
                "booking_id": booking.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        booking_id = kwargs.get('pk')
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if booking.user != request.user:
            return Response({"error": "You are not authorized to view this booking"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(booking)
        return Response(serializer.data)

class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)