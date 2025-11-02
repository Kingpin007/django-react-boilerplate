from django.contrib.auth import authenticate, login, logout
from django.views.generic import TemplateView
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import LoginSerializer, SignupSerializer, UserSerializer


class IndexView(TemplateView):
    """Main index view that renders the React app."""
    template_name = "common/index.html"


class RestViewSet(viewsets.ViewSet):
    """Basic REST viewset for testing."""

    def list(self, request):
        return Response({"message": "Hello from Django REST API!"})


@api_view(["GET"])
@permission_classes([AllowAny])
def rest_view(request):
    """Basic REST view for testing."""
    return Response({"message": "Hello from Django REST API!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current authenticated user info."""
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    """Create a new user account."""
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "Account created successfully!", "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """Authenticate and login a user."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                "message": "Login successful!",
                "user": UserSerializer(user).data
            })
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout the current user."""
    logout(request)
    return Response({"message": "Logout successful!"})
