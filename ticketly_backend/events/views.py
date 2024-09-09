from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from .serializers import EventListSerializer, EventDetailSerializer, EventSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied

class EventPagination(PageNumberPagination):
    page_size = 30 

class ListEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    queryset = Event.objects.all()
    pagination_class = EventPagination
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticated]

class CreateEventView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

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

    def perform_update(self, serializer):
        user = self.request.user
        if not user.isHost:
            raise PermissionDenied({"message": "You do not have permission to update this event."})
        event = serializer.save(user=user)
        return Response({"message": "Event updated successfully"}, status=status.HTTP_200_OK)
