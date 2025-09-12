import uuid

from . import s3_client
from .settings import (
    BUCKET_NAME,
    DOCUMENTS_PATH,
)


def generate_document_key(profile_id, file_extension):
    """Generate a unique key for a document"""
    unique_id = str(uuid.uuid4())[:16]  # Use first 8 chars of UUID for brevity
    return f"{DOCUMENTS_PATH}{profile_id}/{unique_id}.{file_extension}"


def list_profile_document_keys(profile_id):
    """List all document keys for a doctor profile in the S3 bucket

    :param profile_id: The ID of the doctor profile
    :return: List of document keys for the specified doctor profile
    """
    # List objects in the S3 bucket with the specified prefix
    doctor_documents_objs = s3_client.list_objects_v2(
        Bucket=BUCKET_NAME,
        Prefix=f"{DOCUMENTS_PATH}{profile_id}/",
    ).get("Contents", [])
    # Extract the keys from the objects
    return [obj["Key"] for obj in doctor_documents_objs]


def upload_document(key, file_content):
    # Upload the file to S3
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=file_content,
    )


# def generate_document_upload_url(profile_id, file_extension):
#     """Generate a presigned URL for uploading a document directly to S3
#
#     :param profile_id: The ID of the doctor profile
#     :param file_extension: File extension (e.g., pdf, jpg) without the dot
#     :return: Dict containing the presigned URL and fields for direct upload. Example
#         `{
#           "url": "...",
#           "fields": {
#             "key": "...",
#             "AWSAccessKeyId": "...",
#             "policy": "...",
#             "signature": "..."
#           }
#         }`
#     :raises ValueError: If the provided file extension is not allowed
#     :raises ClientError: If the S3 client fails to generate the URL
#     """
#     # Validate the file extension
#     if file_extension not in ALLOWED_DOCUMENT_EXTENSIONS:
#         raise ValueError(f"Invalid file extension: {file_extension}")
#
#     # Create a unique key for the document
#     key = f"{generate_document_key(profile_id, file_extension)}"
#
#     # Define upload conditions
#     conditions = [
#         # Limit the size of the file to be uploaded (1 KB to configured max size)
#         ["content-length-range", 1_000, DOCUMENT_MAX_SIZE],
#     ]
#
#     # Generate presigned post data
#     return s3_client.generate_presigned_post(
#         Bucket=BUCKET_NAME,
#         Key=key,
#         Fields={},
#         Conditions=conditions,
#         ExpiresIn=300,  # URL valid for 5 minutes
#     )
