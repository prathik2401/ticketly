from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/events/', include('events.urls')),
    path('api/bookings/', include('bookings.urls')), 
    path('api/accounts/', include('accounts.urls')),
]

