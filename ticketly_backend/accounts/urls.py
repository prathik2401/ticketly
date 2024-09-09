from django.urls import path
from .views import CustomTokenObtainPairView, RegisterView, LogoutView, VerifyTokenView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-token/', VerifyTokenView.as_view(), name='token_verify'),  # Token verification
]
