from __future__ import annotations

from typing import NotRequired, TypedDict


class PublicBook(TypedDict):
    id: str
    name: str
    sourceLabel: str
    sourceStatus: str
    sourceReason: str
    requiresConfirmation: bool
    confirmed: bool
    pageCount: int
    charCount: int
    preview: str
    uploadedAt: str | None
    fileType: str | None


class BookQueryResponse(TypedDict):
    status: str
    book: PublicBook | None
    answer: str
    excerpts: list[dict]
    disclaimer: str
    safetyNote: NotRequired[str | None]
