from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, TicketTier
from .serializers import EventSerializer, TicketTierSerializer

# CREATE and LIST Events
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Event
from .serializers import EventSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from .serializers import EventSerializer

# CREATE and LIST Events
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    # Allow anyone to view the events but only authenticated users to create events
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Event.objects.all()
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(name__icontains=search_term) | queryset.filter(description__icontains=search_term)
        return queryset


# RETRIEVE, UPDATE, and DELETE Event
class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

# CREATE and LIST Ticket Tiers for Events
class TicketTierListCreateView(generics.ListCreateAPIView):
    queryset = TicketTier.objects.all()
    serializer_class = TicketTierSerializer
    permission_classes = [IsAuthenticated]

# RETRIEVE, UPDATE, and DELETE Ticket Tier
class TicketTierRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TicketTier.objects.all()
    serializer_class = TicketTierSerializer
    permission_classes = [IsAuthenticated]
