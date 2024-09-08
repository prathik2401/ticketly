from tokenize import TokenError
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class AccountsTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.logout_url = reverse('logout')
        self.token_url = reverse('token_obtain_pair')

        # Test user data
        self.user_data = {
            "email": "testuser@example.com",
            "password": "testpassword123"
        }
        
    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User registered successfully")
        user = User.objects.get(email=self.user_data["email"])
        self.assertIsNotNone(user)

    def test_user_logout(self):
        # Register a user
        self.client.post(self.register_url, self.user_data, format='json')

        # Obtain tokens for the user
        response = self.client.post(self.token_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data["access"]
        refresh_token = response.data["refresh"]

        # Set the authentication credentials using the access token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Perform logout using the refresh token
        logout_data = {"refresh_token": refresh_token}
        logout_response = self.client.post(self.logout_url, logout_data, format='json')

        # Assert that the response status code is 205
        self.assertEqual(logout_response.status_code, status.HTTP_205_RESET_CONTENT)

        # Check that the refresh token is blacklisted
        token = RefreshToken(refresh_token)
        try:
            token.check_blacklist()  # This should raise an exception if the token is blacklisted
            self.fail("Token is not blacklisted")
        except TokenError:
            pass  # Expected behavior
