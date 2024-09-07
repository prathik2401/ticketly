from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, TicketTier
from .serializers import EventSerializer, TicketTierSerializer

# CREATE and LIST Events
class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    
class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

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
