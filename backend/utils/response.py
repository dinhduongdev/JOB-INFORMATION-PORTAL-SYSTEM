from botocore.exceptions import ClientError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler
import logging

logger = logging.getLogger(__name__)

def api_response(data=None, status=200, message=None):
    """
    A utility function to create a standardized API response.

    :param data: The data to include in the response.
    :param status: The HTTP status code for the response.
    :param message: An optional message to include in the response.
    :return: A Response object with the specified data and status.
    """
    response_data = {
        'status': 'success' if status < 400 else 'error',
        'data': data,
        'message': message
    }
    return Response(response_data, status=status)


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