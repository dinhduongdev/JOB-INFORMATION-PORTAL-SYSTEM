import cloudinary.api
import cloudinary.uploader
from functools import lru_cache
import random
import logging
from os import getenv


_CLOUDINARY_DEFAULT_AVATARS_PATH = getenv("CLOUDINARY_DEFAULT_AVATARS_PATH")
_CLOUDINARY_USERS_AVATARS_PATH = getenv("CLOUDINARY_USERS_AVATARS_PATH")


@lru_cache(maxsize=1)
def _get_cloudinary_default_avatar_urls():
    """
    Fetch the default avatars from CLOUDINARY_DEFAULT_AVATARS_PATH and return their urls.
    """
    try:
        logging.info("Fetching default images from cloudinary")
        resources = cloudinary.api.resources_by_asset_folder(
            _CLOUDINARY_DEFAULT_AVATARS_PATH, fields=["secure_url"]
        )
    except Exception as e:
        logging.error(f"Error fetching default images from cloudinary: {e}")
        return ["none"]
    return [resource["secure_url"] for resource in resources["resources"]]


def get_random_default_avatar() -> str:
    """
    Get a random default avatar url from CLOUDINARY_DEFAULT_AVATARS_PATH."""
    return random.choice(_get_cloudinary_default_avatar_urls())


def replace_avatar(old_avatar: str, new_avatar) -> str:
    """
    Replace the old avatar with the new one. If the old avatar is a default avatar,
    create a new one in CLOUDINARY_USERS_AVATARS_PATH.

    :param old_avatar: The old avatar url
    :param new_avatar:
        The asset to upload. This can be:
         - A local file path (string)
         - A file-like object / stream
         - A Data URI (Base64 encoded)
         - A remote FTP, HTTP, or HTTPS URL
         - A private storage bucket (S3 or Google Storage) URL from a whitelisted bucket
    :type new_avatar: str or file-like object

    :return: The new avatar url
    :rtype: str
    """
    if old_avatar not in _get_cloudinary_default_avatar_urls():
        cloudinary.uploader.destroy(old_avatar)
    res = cloudinary.uploader.upload(
        new_avatar,
        use_asset_folder_as_public_id_prefix=True,
        folder=_CLOUDINARY_USERS_AVATARS_PATH,
    )
    return res["secure_url"]
