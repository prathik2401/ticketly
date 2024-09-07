# Generated by Django 5.1.1 on 2024-09-07 09:05

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('events', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('number_of_tickets', models.PositiveIntegerField()),
                ('booking_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('confirmed', 'Confirmed'), ('canceled', 'Canceled'), ('pending', 'Pending')], default='pending', max_length=20)),
                ('payment_status', models.CharField(choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')], default='unpaid', max_length=20)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-booking_date'],
                'unique_together': {('user', 'event')},
            },
        ),
    ]
