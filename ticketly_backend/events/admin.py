from django.contrib import admin
from .models import Event, TicketTier

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_and_time', 'total_tickets', 'location')
    search_fields = ('name', 'description', 'location')

@admin.register(TicketTier)
class TicketTierAdmin(admin.ModelAdmin):
    list_display = ('tier_name', 'event', 'price', 'available_tickets', 'total_tickets')
    search_fields = ('tier_name', 'event__name')
    list_filter = ('event',)
