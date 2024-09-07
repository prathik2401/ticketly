from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        user = User.objects.create(
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Verify JWT 
@api_view(['GET'])
def verify_token(request):
    auth_header = request.headers.get('Authorization', None)
    if not auth_header:
        return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(' ')[1]
    try:
        AccessToken(token)
        return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)



# Handle Logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
