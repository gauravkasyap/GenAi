from src.config.database import db

chats = db["chats"]


class ChatRepository:

    def create_chat(self, chat):
        return chats.insert_one(chat)

    def get_user_chats(self, user_id):
        return list(chats.find({"userId": user_id}))

    def get_chat(self, chat_id):
        return chats.find_one({"_id": chat_id})

    def delete_chat(self, chat_id):
        return chats.delete_one({"_id": chat_id})