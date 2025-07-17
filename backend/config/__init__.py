from os import getenv

_INIT_ACCOUNT_ACTIVATION_TIMEOUT_SEC = {
    "key": "account_activation_timeout_sec",
    "value": int(getenv("ACCOUNT_ACTIVATION_TIMEOUT_SEC", "43200")),
}

_INIT_ACTIVATION_TOKEN_SALT = {
    "key": "activation_token_salt",
    "value": getenv("ACTIVATION_TOKEN_SALT", "b7@Gx1#Mv$9q!r3Yk^L6z*U0VdN4pZt"),
}