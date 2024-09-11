from django.urls import path
from .views import CreateBookingView, BookingDetailView, UserBookingsView

urlpatterns = [
    path('events/<uuid:event_id>/book/', CreateBookingView.as_view(), name='create_booking'),
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking_detail'),
    path('user/', UserBookingsView.as_view(), name='user_bookings'),
]
