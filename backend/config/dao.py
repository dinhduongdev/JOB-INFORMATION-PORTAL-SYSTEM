from functools import lru_cache
from . import _INIT_ACCOUNT_ACTIVATION_TIMEOUT_SEC, _INIT_ACTIVATION_TOKEN_SALT


@lru_cache(maxsize=1)
def get_account_activation_timeout_sec() -> int:
    """Fetch account activation timeout in seconds, defaulting if unset."""

    return _INIT_ACCOUNT_ACTIVATION_TIMEOUT_SEC["value"]

@lru_cache(maxsize=1)
def get_activation_token_salt() -> str:
    """Fetch activation token salt, defaulting if unset."""

    return _INIT_ACTIVATION_TOKEN_SALT["value"]