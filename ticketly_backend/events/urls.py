from django.urls import path
from .views import EventListView, EventRetrieveUpdateDestroyView, TicketTierListCreateView, TicketTierRetrieveUpdateDestroyView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list-create'),
    path('<str:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='event-detail'),
    path('ticket-tiers/', TicketTierListCreateView.as_view(), name='ticket-tier-list-create'),
    path('ticket-tiers/<str:pk>/', TicketTierRetrieveUpdateDestroyView.as_view(), name='ticket-tier-detail'),
]
