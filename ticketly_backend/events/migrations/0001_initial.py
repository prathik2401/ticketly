# Generated by Django 5.1.1 on 2024-09-09 06:50

import django.db.models.deletion
import events.storage_backends
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date_time', models.DateTimeField()),
                ('total_tickets', models.PositiveIntegerField(default=1)),
                ('available_tickets', models.PositiveIntegerField(default=1)),
                ('ticket_price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('location', models.CharField(max_length=255)),
                ('location_link', models.URLField(max_length=500)),
                ('image', models.ImageField(blank=True, null=True, storage=events.storage_backends.CustomStorage(), upload_to='media/images/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
