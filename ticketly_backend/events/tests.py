from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from accounts.models import UserProfile
from .models import Event

class EventCreationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.event_data = {
            'name': 'Test Event',
            'description': 'This is a test event',
            'date_and_time': '2023-12-31T23:59:59Z',
            'total_tickets': 100,
            'location': 'Test Location',
            'location_link': 'http://testlocation.com',
        }

    def test_create_event_and_mark_user_as_host(self):
        url = reverse('event-list-create')  # Adjust the URL name as per your URL configuration
        response = self.client.post(url, self.event_data, format='json')
        
        # Check if the event was created successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check if the user is marked as host
        user_profile = UserProfile.objects.get(user=self.user)
        self.assertTrue(user_profile.is_host)

        # Check if the event is associated with the user
        event = Event.objects.get(name='Test Event')
        self.assertEqual(event.user, self.user)

# Add this test case to your tests.py file in the same app where your views are defined.