from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from .serializers import EventListSerializer, EventDetailSerializer, EventSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from accounts.models import User
from bookings.models import Booking
from events.models import Event

class EventPagination(PageNumberPagination):
    page_size = 30  # Set the number of events per page

class ListEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    queryset = Event.objects.all()
    pagination_class = EventPagination
    permission_classes = [AllowAny]

    # Handle GET request to list events
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticated]

    # Handle GET request to retrieve event details
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class CreateEventView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    # Handle POST request to create a new event
    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.save(user=user)
        user.isHost = True
        user.save()
        return Response({"message": "Event created successfully"}, status=status.HTTP_201_CREATED)
    
class UpdateEventView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    # Handle PUT request to update an existing event
    def perform_update(self, serializer):
        user = self.request.user
        if not user.isHost:
            raise PermissionDenied({"message": "You do not have permission to update this event."})
        event = serializer.save(user=user)
        return Response({"message": "Event updated successfully"}, status=status.HTTP_200_OK)

class EventStaffView(APIView):
    permission_classes = [IsAuthenticated]

    # Handle POST request to add staff to an event
    def post(self, request, pk):
        try:
            event = Event.objects.get(id=pk)
            if event.user != request.user:
                return Response({'detail': 'You are not the host of this event.'}, status=status.HTTP_403_FORBIDDEN)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            event = serializer.save()
            staff_ids = request.data.get('staff', [])
            for user_id in staff_ids:
                try:
                    user = User.objects.get(id=user_id)
                    user.is_staff = True
                    user.save()
                    event.staff.add(user)
                except User.DoesNotExist:
                    return Response({'detail': f'User with ID {user_id} not found.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteEventView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    # Handle DELETE request to delete an event
    def delete(self, request, *args, **kwargs):
        user = request.user
        event = self.get_object()
        if not user.isHost:
            raise PermissionDenied({"message": "You do not have permission to delete this event."})
        if event.user != user:
            raise PermissionDenied({"message": "You are not authorized to delete this event."})
        
        # Cancel related bookings
        Booking.objects.filter(event=event).update(status='Cancelled')
        
        # Delete the event
        event.delete()
        
        # Check if the user is hosting any other events
        if not Event.objects.filter(user=user).exists():
            user.isHost = False
            user.save()
        
        return Response({"message": "Event deleted successfully, and related bookings have been cancelled."}, status=status.HTTP_204_NO_CONTENT)

class UserHostEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]
    
    # Get the list of events hosted by the user
    def get_queryset(self):
        user = self.request.user
        if not user.isHost:
            raise PermissionDenied({"message": "You are not authorized to view events created by hosts."})
        return Event.objects.filter(user__isHost=True, user_id=user.id)