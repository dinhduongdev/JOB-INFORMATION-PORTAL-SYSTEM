from functools import lru_cache
from random import choice
from settings import ALLOWED_AVATAR_EXTENSIONS, AVATAR_MAX_SIZE

from .settings import (
    s3_client,
    PUBLIC_BUCKET_NAME,
    AVATARS_PATH,
    AVATARS_DEFAULT_AVATARS_PATH,
)


@lru_cache(maxsize=1)
def _get_default_avatars_keys():
    """Get the keys of default avatars in the S3 bucket

    :return: List of keys for default avatars
    """
    default_avatars_objs = s3_client.list_objects_v2(
        Bucket=PUBLIC_BUCKET_NAME,
        Prefix=AVATARS_DEFAULT_AVATARS_PATH,
    )["Contents"]
    # Extract the keys from the objects
    return [obj["Key"] for obj in default_avatars_objs]


def is_default_avatar_key(key: str) -> bool:
    return key in _get_default_avatars_keys()


def get_random_default_avatar_key() -> str:
    return choice(_get_default_avatars_keys())


def generate_avatar_upload_url(user_id, file_extension) -> dict:
    """
    Generate a presigned URL for direct avatar upload to S3. Note that user must include everything in request to upload the file.

    :param user_id: The ID of the user uploading the avatar
    :param file_extension: The file extension of the avatar (e.g., .jpg, .png)
    :return: Dictionary with URL and fields needed for the upload. Example
        `{
          "url": "...",
          "fields": {
            "key": "...",
            "AWSAccessKeyId": "...",
            "policy": "...",
            "signature": "..."
          }
        }`
    :raises ValueError: If the provided file extension is not allowed
    :raises ClientError: If the S3 client fails to generate the URL
    """
    # Validate the file extension
    if file_extension not in ALLOWED_AVATAR_EXTENSIONS:
        raise ValueError(
            f"Invalid file extension: {file_extension}! Allowed extensions are: {ALLOWED_AVATAR_EXTENSIONS}"
        )
    # Create a unique key for the avatar
    key = f"{AVATARS_PATH}{user_id}.{file_extension}"
    # Define upload conditions
    conditions = [
        # Limit the size of the file to be uploaded (1 KB to 2 MB)
        ["content-length-range", 1_000, AVATAR_MAX_SIZE],
        ["starts-with", "$Content-Type", "image/"],
    ]

    # Generate presigned post data
    return s3_client.generate_presigned_post(
        Bucket=PUBLIC_BUCKET_NAME,
        Key=key,
        Fields={},
        Conditions=conditions,
        ExpiresIn=300,  # URL valid for 5 minutes
    )

