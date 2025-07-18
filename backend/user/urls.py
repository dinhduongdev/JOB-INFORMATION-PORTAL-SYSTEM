from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user.views import AuthViewSet


router = DefaultRouter()

# Import your viewsets here
router.register(r"v1/auth", AuthViewSet, basename="auth")


urlpatterns = [
    path("", include(router.urls)),
]
