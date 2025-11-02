from django.contrib import admin

from .models import ShortURL


@admin.register(ShortURL)
class ShortURLAdmin(admin.ModelAdmin):
    list_display = ["short_code", "original_url", "user", "click_count", "is_active", "created"]
    list_filter = ["is_active", "created", "user"]
    search_fields = ["short_code", "original_url", "user__email", "user__username"]
    readonly_fields = ["short_code", "click_count", "created", "modified"]
    fieldsets = (
        (
            "URL Information",
            {
                "fields": ("original_url", "short_code", "short_url"),
            },
        ),
        (
            "User Information",
            {
                "fields": ("user",),
            },
        ),
        (
            "Statistics",
            {
                "fields": ("click_count", "is_active", "expires_at"),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created", "modified"),
            },
        ),
    )

    def short_url(self, obj):
        return obj.short_url

    short_url.short_description = "Short URL"

