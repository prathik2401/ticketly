from django.urls import path
from .views import CreateBookingView

urlpatterns = [
    path('events/<uuid:event_id>/book/', CreateBookingView.as_view(), name='create_booking'),
]
