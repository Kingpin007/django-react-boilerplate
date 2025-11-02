from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import ShortURL
from .serializers import ShortURLCreateSerializer, ShortURLSerializer


class ShortURLViewSet(viewsets.ModelViewSet):
    """ViewSet for ShortURL operations."""
    
    queryset = ShortURL.objects.all()
    serializer_class = ShortURLSerializer
    permission_classes = [AllowAny]  # Allow anyone to create short URLs
    
    def get_queryset(self):
        """Filter queryset based on user authentication."""
        queryset = super().get_queryset()
        
        # If user is authenticated, show only their URLs
        if self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        else:
            # For unauthenticated users, return empty queryset for list view
            # but allow creating short URLs
            if self.action == "list":
                queryset = queryset.none()
        
        return queryset.filter(is_active=True)

    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ["list", "retrieve", "destroy", "update", "partial_update"]:
            # Only authenticated users can view/manage their URLs
            return [IsAuthenticated()]
        # Anyone can create short URLs
        return [AllowAny()]

    def get_serializer_class(self):
        """Use different serializer for create action."""
        if self.action == "create":
            return ShortURLCreateSerializer
        return ShortURLSerializer

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def shorten(self, request):
        """Public endpoint to create short URLs."""
        serializer = ShortURLCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            short_url = serializer.save()
            response_serializer = ShortURLSerializer(short_url, context={"request": request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def stats(self, request, pk=None):
        """Get statistics for a short URL."""
        short_url = self.get_object()
        
        # Only allow viewing stats if user owns the URL or it's public
        if short_url.user and short_url.user != request.user:
            return Response(
                {"detail": "You do not have permission to view this."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return Response({
            "short_code": short_url.short_code,
            "original_url": short_url.original_url,
            "click_count": short_url.click_count,
            "created": short_url.created,
            "is_expired": short_url.expires_at and timezone.now() > short_url.expires_at,
        })


def redirect_view(request, short_code):
    """Redirect to original URL based on short code."""
    short_url = get_object_or_404(ShortURL, short_code=short_code, is_active=True)
    
    # Check if URL has expired
    if short_url.expires_at and timezone.now() > short_url.expires_at:
        return HttpResponseRedirect("/?error=expired")
    
    # Increment click count
    short_url.increment_click_count()
    
    return HttpResponseRedirect(short_url.original_url)

