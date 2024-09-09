from django.urls import path
from .views import CreateEventView, ListEventsView, EventDetailView, UpdateEventView

urlpatterns = [
    path('create/', CreateEventView.as_view(), name='create_event'),
    path('', ListEventsView.as_view(), name='list_events'),
    path("<uuid:pk>/", EventDetailView.as_view(), name='event_detail'),
    path("<uuid:pk>/update/", UpdateEventView.as_view(), name='update_event'),
]
