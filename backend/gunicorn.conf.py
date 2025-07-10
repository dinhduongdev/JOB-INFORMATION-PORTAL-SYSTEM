# Gunicorn configuration file
# https://docs.gunicorn.org/en/stable/configure.html#configuration-file
# https://docs.gunicorn.org/en/stable/settings.html
import multiprocessing
from os import getenv

# logs will be printed to stdout instead of a file.
log_file = "-"

# Gunicorn documentation
workers = multiprocessing.cpu_count() * 2 + 1
workers = 1

# binds Gunicorn to an IP and port
bind = f"{getenv('BACKEND_HOST')}:{getenv('BACKEND_PORT')}"

# request timeout to 600 seconds (10 minutes)
timeout = 600
