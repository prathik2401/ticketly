from django.urls import path
from .views import ListEventsView, EventDetailView, CreateEventView, UserHostEventsView, UpdateEventView, DeleteEventView, EventStaffView

urlpatterns = [
    path('', ListEventsView.as_view(), name='event-list'),
    path('<uuid:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('create/', CreateEventView.as_view(), name='event-create'),
    path('user/host/', UserHostEventsView.as_view(), name='user-host'),
    path('<uuid:pk>/update/', UpdateEventView.as_view(), name='event-update'),
    path('<uuid:pk>/delete/', DeleteEventView.as_view(), name='event-delete'),
    path('<uuid:pk>/staff/', EventStaffView.as_view(), name='event-staff'),
]
