from src.config.database import db

users = db["users"]


class UserRepository:

    def create_user(self, user):
        return users.insert_one(user)

    def find_by_email(self, email):
        return users.find_one({"email": email})

    def find_by_id(self, user_id):
        return users.find_one({"_id": user_id})

    def update_user(self, user_id, data):
        return users.update_one(
            {"_id": user_id},
            {"$set": data}
        )

    def delete_user(self, user_id):
        return users.delete_one({"_id": user_id})