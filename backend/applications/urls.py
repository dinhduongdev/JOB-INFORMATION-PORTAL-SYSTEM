from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CVViewSet

router = DefaultRouter()

router.register(r"v1/(?P<applicant_id>\d+)/cv", CVViewSet, basename="cv")


urlpatterns = [
    path("", include(router.urls)),
]
