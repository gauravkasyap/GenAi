from __future__ import annotations

from src.services.book_service import confirm_book, list_books, query_book, remove_book, upload_book


def get_books(query: dict[str, list[str]]) -> dict:
    user_email = query.get("user", [None])[0]
    return list_books(user_email)


def post_upload_book(payload: dict) -> dict:
    return upload_book(payload)


def post_remove_book(payload: dict) -> dict:
    return remove_book(payload)


def post_confirm_book(payload: dict) -> dict:
    return confirm_book(payload)


def post_query_book(payload: dict) -> dict:
    return query_book(payload)
