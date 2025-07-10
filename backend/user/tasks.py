from celery import shared_task
from django.template.loader import render_to_string

@shared_task
def send_account_activation_email(url_path: str, user_data: dict, token: str):
    to_email = user_data.get("email")
    html_template = "emails/activation_email.html"
    context = {
        "full_name": f"{user_data.get('first_name')} {user_data.get('last_name')}",
        "activation_link": f"{url_path}{token}",
    }

    html_message = render_to_string(html_template, context)
    # send_email(
    #     subject="Activate your account",
    #     body=html_message,
    #     recipient_list=[to_email],
    # )

    return f"Sending account activation email to {to_email} ({url_path}{token})"