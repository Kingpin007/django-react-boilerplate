from django.urls import path

from . import views


app_name = "common"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("users", views.IndexView.as_view(), name="index"),
    path("api/auth/user/", views.current_user_view, name="current-user"),
]
