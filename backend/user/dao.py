from django.http import HttpRequest, Http404
from django.utils.timezone import now
from oauth2_provider.models import AccessToken

from .models import User
from .utils import get_user_pk_from_token
from rest_framework.exceptions import NotFound


def get_user_or_404(*args, message="User not found", **kwargs):
    try:
        return User.objects.get(*args, **kwargs)
    except User.DoesNotExist:
        raise NotFound(detail=message)


def get_unexpired_access_token(token: str):
    return AccessToken.objects.filter(token=token, expires__gt=now()).first()


def get_token_from_header(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None


def get_inactive_user_from_token(token: str):
    try:
        pk = get_user_pk_from_token(token)
        return get_user_or_404(pk=pk, is_active=False)
    except NotFound:
        raise Http404("User not found or inactive")