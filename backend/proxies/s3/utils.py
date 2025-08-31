from . import s3_client
from .settings import BUCKET_NAME 


def delete_object(key):
    return s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)


def delete_objects(keys):
    """Delete multiple objects from S3 bucket"""
    to_delete_keys: list[dict] = [{"Key": key} for key in keys]
    return s3_client.delete_objects(
        Bucket=BUCKET_NAME,
        Delete={"Objects": to_delete_keys},
    )
