from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CVViewSet, ApplicationViewSet

router = DefaultRouter()

router.register(r"v1/(?P<applicant_id>\d+)/cv", CVViewSet, basename="cv")
router.register(r'v1/applications', ApplicationViewSet, basename="applications")


urlpatterns = [
    path("", include(router.urls)),
]
