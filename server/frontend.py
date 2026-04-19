import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


FRONTEND_BUILD_DIR = settings.BASE_DIR / "ui" / "out"


def serve_next_frontend(request, path=""):
    requested_path = (FRONTEND_BUILD_DIR / path).resolve()

    if FRONTEND_BUILD_DIR not in requested_path.parents and requested_path != FRONTEND_BUILD_DIR:
        raise Http404("Frontend asset not found")

    if requested_path.is_dir():
        requested_path = requested_path / "index.html"
    elif not requested_path.exists():
        html_path = requested_path.with_suffix("") / "index.html"
        requested_path = html_path if html_path.exists() else FRONTEND_BUILD_DIR / "404.html"

    if not requested_path.exists() or not requested_path.is_file():
        raise Http404("Frontend build not found. Run `npm run build` inside ui first.")

    content_type, _ = mimetypes.guess_type(requested_path)
    return FileResponse(open(requested_path, "rb"), content_type=content_type)
