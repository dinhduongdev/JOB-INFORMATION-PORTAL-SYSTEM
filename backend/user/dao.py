from django.conf import settings
from django.http import Http404
from django.utils.timezone import now
from itsdangerous import URLSafeTimedSerializer
from oauth2_provider.models import AccessToken
from rest_framework.exceptions import NotFound

from .models import User


def get_user_or_404(*args, message="User not found", **kwargs):
    try:
        return User.objects.get(*args, **kwargs)
    except User.DoesNotExist:
        raise NotFound(detail=message)


def get_unexpired_access_token(token: str):
    return AccessToken.objects.filter(token=token, expires__gt=now()).first()


def get_user_pk_from_token(
    token: str,
    expires_sec: int = settings.ACCOUNT_ACTIVATION_TIMEOUT_SEC,
    salt: str = settings.ACTIVATION_TOKEN_SALT,
):
    """
    Get user's pk from token.
    - If the token is invalid raises :exec:`BadSignature`.
    - If the token is expired raise :exc:`SignatureExpired`."""
    s = URLSafeTimedSerializer(settings.SECRET_KEY)
    return s.loads(token, max_age=expires_sec, salt=salt)["pk"]


def get_inactive_user_from_token_or_404(
    token: str,
):
    try:
        pk = get_user_pk_from_token(token)
        return get_user_or_404(pk=pk, is_active=False)
    except Exception:
        raise Http404("Invalid token or user already activated.")


# def get_inactive_user_from_token(token: str):
#     try:
#         pk = get_user_pk_from_token(token)
#         return get_user_or_404(pk=pk, is_active=False)
#     except NotFound:
#         raise Http404("User not found or inactive")
