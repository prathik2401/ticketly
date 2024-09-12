from django.urls import path
from .views import CreateBookingView, BookingDetailView, UserBookingsView, AdminBookingsView

urlpatterns = [
    path('events/<uuid:event_id>/book/', CreateBookingView.as_view(), name='create_booking'),
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking_detail'),
    path('user/', UserBookingsView.as_view(), name='user_bookings'),
    path('events/<uuid:event_id>/', AdminBookingsView.as_view(), name='admin-event-bookings'),
]
