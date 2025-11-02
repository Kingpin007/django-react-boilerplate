from rest_framework.routers import DefaultRouter

from .views import RestViewSet, current_user_view

router = DefaultRouter()
router.register(r"rest", RestViewSet, basename="rest")

routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
]
