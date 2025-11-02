from django.urls import path

from . import views


app_name = "common"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("users", views.IndexView.as_view(), name="index"),
    # API endpoints
    path("api/auth/user/", views.current_user_view, name="current-user"),
    path("api/auth/signup/", views.signup_view, name="signup"),
    path("api/auth/login/", views.login_view, name="login"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    # Frontend routes - serve React app (with trailing slashes)
    path("login/", views.IndexView.as_view(), name="login"),
    path("signup/", views.IndexView.as_view(), name="signup"),
    path("dashboard/", views.IndexView.as_view(), name="dashboard"),
]
