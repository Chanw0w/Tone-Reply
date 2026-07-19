# Re-export app from main.py for backwards compatibility.
# The full application lives in main.py + routes/ + services/.
from main import app  # noqa: F401
