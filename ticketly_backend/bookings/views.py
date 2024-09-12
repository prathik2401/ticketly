from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from events.models import Event
import boto3
from django.core.mail import EmailMessage
from django.conf import settings

class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user == event.user:
            return Response({"error": "Hosts cannot book their own events"}, status=status.HTTP_403_FORBIDDEN)

        existing_booking = Booking.objects.filter(user=request.user, event=event).exists()
        if existing_booking:
            return Response({"error": "You have already booked for this event"}, status=status.HTTP_400_BAD_REQUEST)

        number_of_tickets = request.data.get('number_of_tickets')
        if number_of_tickets is None or int(number_of_tickets) <= 0:
            return Response({"error": "Invalid number of tickets"}, status=status.HTTP_400_BAD_REQUEST)

        if event.available_tickets < int(number_of_tickets):
            return Response({"error": "Not enough tickets available"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'user': request.user.id,
            'event': event_id,
            'number_of_tickets': number_of_tickets
        }
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            booking = serializer.save()

            event.available_tickets -= int(number_of_tickets)
            event.save()

            booking.generate_qr_code()

            self.send_booking_email(booking)

            return Response({
                "message": "Booking created successfully",
                "booking_id": booking.id,
                "booking_date_time": booking.booking_date_time
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_booking_email(self, booking):
        email_subject = f"Booking Confirmation for {booking.event.name}"
        email_body = f"Dear {booking.user.username},\n\nThank you for booking your tickets for {booking.event.name}.\nAttached is your QR code.\n\nBest regards,\nTicketly Team"

        email = EmailMessage(
            email_subject,
            email_body,
            settings.EMAIL_HOST_USER,
            [booking.user.email],
        )

        s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        file_name = booking.qr_code
        try:
            response = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
            qr_code_content = response['Body'].read()
        except s3.exceptions.NoSuchKey:
            raise Exception(f"The QR code with key {file_name} does not exist in the bucket.")

        email.attach(f"{booking.id}.png", qr_code_content, 'image/png')

        email.send()


class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        booking_id = kwargs.get('pk')
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if booking.user != request.user:
            return Response({"error": "You are not authorized to view this booking"}, status=status.HTTP_403_FORBIDDEN)

        # Construct the public URL for the QR code
        qr_code_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{booking.qr_code}"

        serializer = self.get_serializer(booking)
        data = serializer.data
        data['qr_code_url'] = qr_code_url

        return Response(data)

class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

class AdminBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is either an admin or the host of the event
        if not request.user.is_staff and request.user != event.user:
            return Response({"error": "You are not authorized to view the bookings for this event"}, status=status.HTTP_403_FORBIDDEN)

        # Fetch all bookings for the event
        bookings = Booking.objects.filter(event=event)
        serializer = self.get_serializer(bookings, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
