from itsdangerous import URLSafeTimedSerializer

from backend.settings import SECRET_KEY
from config import dao as config_dao


def get_user_pk_from_token(
        token: str,
        expires_sec: int = config_dao.get_account_activation_timeout_sec(),
        salt: str = config_dao.get_activation_token_salt(),) -> int:
    """
    Decodes a user primary key from a token using itsdangerous.

    :param token: The token to decode.
    :param secret_key: The secret key used for signing the token.
    :param salt: The salt used for the token.
    :return: The user primary key if valid, otherwise None.
    """
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    try:
        return serializer.loads(token, max_age=expires_sec, salt=salt)["pk"]  # Token is valid for 24 hour or 12 hours if not initialized
    except Exception:
        return None