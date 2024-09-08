from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Booking, Event
from events.models import TicketTier
from accounts.models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken

class BookingTests(TestCase):
    def setUp(self):
        # Create users
        self.user_host = User.objects.create_user(username='host', email='host@example.com', password='password123')
        self.user_regular = User.objects.create_user(username='regular', email='regular@example.com', password='password123')

        # Ensure UserProfile is created only once per user
        UserProfile.objects.get_or_create(user=self.user_host, defaults={'is_host': True})
        UserProfile.objects.get_or_create(user=self.user_regular, defaults={'is_host': False})

        # Create event and ticket tier
        self.event = Event.objects.create(
            name='Test Event',
            description='Event Description',
            date_and_time=timezone.now() + timezone.timedelta(days=30),
            total_tickets=100,
            user=self.user_host
        )
        self.ticket_tier = TicketTier.objects.create(
            event=self.event,
            tier_name='General Admission',
            price=20.00,
            available_tickets=100,
            total_tickets=100
        )

        self.client = APIClient()

    def get_auth_headers(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'
        }

    def test_regular_user_can_book_for_existing_event(self):
        headers = self.get_auth_headers(self.user_regular)
        url = reverse('booking-list-create')
        response = self.client.post(url, {
            'event': str(self.event.id),
            'number_of_tickets': 2,
            'total_amount': 40.00
        }, **headers)
    
        print(response.data)
    
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        booking = Booking.objects.first()
        self.assertEqual(booking.user, self.user_regular)
        self.assertEqual(booking.event, self.event)
        self.assertEqual(booking.number_of_tickets, 2)
        self.assertEqual(booking.total_amount, 40.00)
        # Check that the ticket tier has 98 tickets left
        self.ticket_tier.refresh_from_db()
        self.assertEqual(self.ticket_tier.available_tickets, 98)
    
    