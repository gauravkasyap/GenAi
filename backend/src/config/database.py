from __future__ import annotations

from functools import lru_cache

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from src.config.settings import DATABASE_NAME, MONGODB_URI


@lru_cache(maxsize=1)
def get_client() -> MongoClient:
    if not MONGODB_URI:
        raise RuntimeError("MONGODB_URI is not configured")

    return MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)


def get_database():
    if not DATABASE_NAME:
        raise RuntimeError("DATABASE_NAME is not configured")

    return get_client()[DATABASE_NAME]


def check_database_connection() -> dict:
    try:
        get_client().admin.command("ping")
        return {
            "status": "ok",
            "database": DATABASE_NAME,
        }
    except (PyMongoError, RuntimeError) as error:
        return {
            "status": "error",
            "database": DATABASE_NAME,
            "error": str(error),
        }


db = get_database()
client = get_client()
