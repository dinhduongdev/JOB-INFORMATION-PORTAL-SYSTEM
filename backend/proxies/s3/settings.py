from os import getenv

ALLOWED_AVATAR_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".svg",
]

ALLOWED_DOCUMENT_EXTENSIONS = [
    ".pdf",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
]

AVATAR_MAX_SIZE = 5 * 1024 * 1024  # 5 MB
DOCUMENT_MAX_SIZE = 50 * 1024 * 1024  # 50 MB

# Your AWS credentials should be configured in ~/.aws/credentials or environment variables
AWS_ACCESS_KEY_ID = getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_REGION_NAME = getenv("AWS_S3_REGION_NAME")

PUBLIC_BUCKET_NAME = getenv("BUCKET_NAME")

# Prefixes for organizing content
AVATARS_PATH = "avatars/"
AVATARS_DEFAULT_AVATARS_PATH = "avatars/default/"
DOCUMENTS_PATH = "doctor_documents/"
STATIC_PATH = "static/"
