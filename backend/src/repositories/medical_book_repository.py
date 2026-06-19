from src.config.database import db

books = db["medical_books"]


class MedicalBookRepository:

    def save_book(self, book):
        return books.insert_one(book)

    def get_all_books(self):
        return list(books.find())

    def get_book(self, book_id):
        return books.find_one({"_id": book_id})

    def delete_book(self, book_id):
        return books.delete_one({"_id": book_id})