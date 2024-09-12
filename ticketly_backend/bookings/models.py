import uuid
from django.db import models
from accounts.models import User
from events.models import Event
from events.storage_backends import CustomStorage
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
import boto3
from botocore.exceptions import NoCredentialsError
class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    number_of_tickets = models.PositiveIntegerField()
    booking_date_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    qr_code = models.CharField(max_length=500)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.event.name}"
    # logic to generate QR code for the booking
    def generate_qr_code(self):
        qr_data = f"Booking ID: {self.id}\nEvent: {self.event.name}\nUser: {self.user.username}\nNumber of Tickets: {self.number_of_tickets}"
        qr_img = qrcode.make(qr_data)
        with BytesIO() as buffer:
            qr_img.save(buffer, format="PNG")
            buffer.seek(0)
            #  Save the QR code in the S3 bucket
            event_folder = "bookings_qr/"
            file_name = f"{self.id}.png"
            s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            try:
                s3.upload_fileobj(buffer, settings.AWS_STORAGE_BUCKET_NAME, f"{event_folder}{file_name}")
            except NoCredentialsError:
                raise Exception("S3 Credentials not available")

            # Save the S3 URL of the QR code in the model
            self.qr_code = f"{event_folder}{file_name}"
            self.save()