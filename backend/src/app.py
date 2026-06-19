"""HTTP application entry point for the GenAi backend."""

from __future__ import annotations

from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from src.config.settings import APP_DEBUG, HOST, PORT, SERVER_NAME, STATIC_ROOT
from src.middleware.http_utils import read_json, send_cors_headers, send_json, serve_static
from src.routes.api_router import dispatch_get, dispatch_post


class AppHandler(BaseHTTPRequestHandler):
    server_version = SERVER_NAME

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        send_cors_headers(self)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        payload, status = dispatch_get(parsed.path, parse_qs(parsed.query))
        if payload is not None:
            send_json(self, payload, status=status)
            return
        serve_static(self, parsed.path, STATIC_ROOT)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        try:
            payload, status = dispatch_post(parsed.path, read_json(self))
            if payload is not None:
                send_json(self, payload, status=status)
                return
        except ValueError as error:
            send_json(self, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        except Exception as error:  # noqa: BLE001
            payload = {"error": "Backend request failed"}
            if APP_DEBUG:
                payload["details"] = str(error)
            send_json(self, payload, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        if APP_DEBUG:
            super().log_message(format, *args)


def main() -> None:
    httpd = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Serving backend on http://{HOST}:{PORT}")
    httpd.serve_forever()
