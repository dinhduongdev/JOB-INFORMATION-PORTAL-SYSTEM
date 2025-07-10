import cloudinary
import cloudinary.uploader
from os import getenv

_CLOUDINARY_CLOUD_NAME = getenv("CLOUDINARY_CLOUD_NAME")
_CLOUDINARY_API_KEY = getenv("CLOUDINARY_API_KEY")
_CLOUDINARY_API_SECRET = getenv("CLOUDINARY_API_SECRET")
_CLOUDINARY_SECURE = getenv("CLOUDINARY_SECURE")


cloudinary.config(
    cloud_name=_CLOUDINARY_CLOUD_NAME,
    api_key=_CLOUDINARY_API_KEY,
    api_secret=_CLOUDINARY_API_SECRET,
    secure=_CLOUDINARY_SECURE,
)
