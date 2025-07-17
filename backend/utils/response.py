import logging

from botocore.exceptions import ClientError
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def api_response(data=None, status=status.HTTP_200_OK, message=""):
    """
    A utility function to create a standardized API response.

    :param data: The data to include in the response.
    :param status: The HTTP status code for the response.
    :param message: An optional message to include in the response.
    :return: A Response object with the specified data and status.
    """
    response_data = {
        "message": message,
    }
    if data is not None:
        response_data["data"] = data
    return Response(response_data, status=status)


def send_email(
    subject: str,
    body: str,
    recipient_list: list,
    fail_silently: bool = False,
    from_email: str = settings.EMAIL_HOST_USER,
    content_subtype: str = "html",
) -> int:
    """
    Send an email using Django's EmailMessage class.

    :param subject: Subject of the email
    :param body: Body of the email
    :param recipient_list: List of recipient email addresses
    :param fail_silently: Whether to suppress errors
    :param from_email: Sender's email address
    :return: Number of successfully sent emails
    """

    email = EmailMessage(subject, body, from_email, to=recipient_list)
    email.content_subtype = content_subtype
    return email.send(fail_silently=fail_silently)


_EXCEPTION_MAPPING = {
    ValueError: {
        "status_code": status.HTTP_400_BAD_REQUEST,
        "message": "Resource not found.",
    },
    PermissionError: {
        "status_code": status.HTTP_400_BAD_REQUEST,
        "message": "Permission denied.",
    },
    ClientError: {
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "message": "Uploading service went wrong.",
    },
    ObjectDoesNotExist: {
        "status_code": status.HTTP_404_NOT_FOUND,
        "message": "Resource not found.",
    },
}


# https://www.django-rest-framework.org/api-guide/exceptions/#custom-exception-handling
def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Get request details for logging
    request = context.get("request")
    view = context.get("view")
    view_name = view.__class__.__name__ if view else "Unknown"

    # Log the exception with context
    logger.error(
        f"Exception in {view_name}: {exc}",
        exc_info=True,
        extra={"path": request.path if request else "Unknown"},
    )

    # If DRF already handled it, format the response consistently
    if response is not None:
        return response

    # For unhandled exceptions, check our mapping
    for exception_class in _EXCEPTION_MAPPING:
        if isinstance(exc, exception_class):
            message = (
                str(exc) if str(exc) else _EXCEPTION_MAPPING[exception_class]["message"]
            )
            return api_response(
                message=message,
                status=_EXCEPTION_MAPPING[exception_class]["status_code"],
            )

    # If we got here, it's a truly unexpected exception
    logger.critical(f"Unhandled exception: {exc}", exc_info=True)
    return api_response(
        message="An unexpected error occurred.",
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )