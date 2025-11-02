from rest_framework import serializers

from .models import ShortURL


class ShortURLSerializer(serializers.ModelSerializer):
    """Serializer for ShortURL model."""
    
    short_url = serializers.ReadOnlyField()
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ShortURL
        fields = [
            "id",
            "original_url",
            "short_code",
            "short_url",
            "user",
            "user_email",
            "click_count",
            "is_active",
            "expires_at",
            "created",
            "modified",
        ]
        read_only_fields = ["id", "short_code", "short_url", "click_count", "created", "modified"]

    def create(self, validated_data):
        """Create a new short URL."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


class ShortURLCreateSerializer(serializers.Serializer):
    """Serializer for creating short URLs."""
    
    original_url = serializers.URLField(required=True)
    custom_code = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        help_text="Optional custom short code (must be unique)",
    )
    expires_at = serializers.DateTimeField(required=False, allow_null=True)

    def validate_custom_code(self, value):
        """Validate custom code if provided."""
        if value:
            # Check if code already exists
            if ShortURL.objects.filter(short_code=value).exists():
                raise serializers.ValidationError("This short code is already taken.")
            # Validate code format (alphanumeric only)
            if not value.isalnum():
                raise serializers.ValidationError("Short code must contain only letters and numbers.")
        return value

    def create(self, validated_data):
        """Create short URL."""
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        
        short_code = validated_data.pop("custom_code", None)
        expires_at = validated_data.pop("expires_at", None)
        
        short_url = ShortURL.objects.create(
            original_url=validated_data["original_url"],
            short_code=short_code,
            user=user,
            expires_at=expires_at,
        )
        return short_url

