from .views import ShortURLViewSet


routes = [
    {"regex": r"short-urls", "viewset": ShortURLViewSet, "basename": "short-url"},
]

