from django.views.generic import TemplateView
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


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
