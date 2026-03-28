from __future__ import annotations

from http import HTTPStatus

from src.controllers.books_controller import (
    get_books,
    post_confirm_book,
    post_query_book,
    post_remove_book,
    post_upload_book,
)
from src.controllers.bootstrap_controller import get_bootstrap, get_health
from src.controllers.prescription_controller import post_explain_prescription
from src.controllers.triage_controller import get_hospitals, post_analyze

GET_ROUTES = {
    "/api/bootstrap": get_bootstrap,
    "/api/hospitals": get_hospitals,
    "/api/health": get_health,
    "/api/books": get_books,
}

POST_ROUTES = {
    "/api/analyze": post_analyze,
    "/api/prescription/explain": post_explain_prescription,
    "/api/books/upload": post_upload_book,
    "/api/books/remove": post_remove_book,
    "/api/books/confirm": post_confirm_book,
    "/api/books/query": post_query_book,
}


def dispatch_get(path: str, query: dict[str, list[str]]) -> tuple[dict | None, HTTPStatus]:
    handler = GET_ROUTES.get(path)
    if not handler:
        return None, HTTPStatus.NOT_FOUND
    return handler(query), HTTPStatus.OK


def dispatch_post(path: str, payload: dict) -> tuple[dict | None, HTTPStatus]:
    handler = POST_ROUTES.get(path)
    if not handler:
        return None, HTTPStatus.NOT_FOUND
    return handler(payload), HTTPStatus.OK
