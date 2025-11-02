import secrets
import string

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import IndexedTimeStampedModel


def generate_short_code(length=8):
    """Generate a random short code for URL shortening."""
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


class ShortURL(IndexedTimeStampedModel):
    """Model for storing shortened URLs."""
    
    original_url = models.URLField(_("Original URL"), max_length=2048)
    short_code = models.CharField(
        _("Short Code"),
        max_length=20,
        unique=True,
        db_index=True,
        help_text=_("Unique short code for the URL"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="short_urls",
        help_text=_("User who created this short URL (optional)"),
    )
    click_count = models.PositiveIntegerField(_("Click Count"), default=0)
    is_active = models.BooleanField(_("Is Active"), default=True)
    expires_at = models.DateTimeField(
        _("Expires At"),
        null=True,
        blank=True,
        help_text=_("Optional expiration date for the short URL"),
    )

    class Meta:
        verbose_name = _("Short URL")
        verbose_name_plural = _("Short URLs")
        ordering = ["-created"]
        indexes = [
            models.Index(fields=["short_code"]),
            models.Index(fields=["user", "-created"]),
        ]

    def __str__(self):
        return f"{self.short_code} -> {self.original_url[:50]}"

    def save(self, *args, **kwargs):
        """Generate short code if not provided."""
        if not self.short_code:
            # Generate unique short code
            while True:
                code = generate_short_code()
                if not ShortURL.objects.filter(short_code=code).exists():
                    self.short_code = code
                    break
        super().save(*args, **kwargs)

    def increment_click_count(self):
        """Increment the click count."""
        self.click_count += 1
        self.save(update_fields=["click_count"])

    @property
    def short_url(self):
        """Get the full short URL."""
        from django.contrib.sites.models import Site
        
        try:
            site = Site.objects.get_current()
            domain = site.domain
        except Site.DoesNotExist:
            domain = "localhost:8000"
        
        protocol = "https" if not settings.DEBUG else "http"
        return f"{protocol}://{domain}/{self.short_code}"

