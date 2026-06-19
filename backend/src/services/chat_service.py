from src.repositories.chat_repository import ChatRepository


class ChatService:

    def __init__(self):
        self.chat_repository = ChatRepository()

    def save_chat(self, chat):
        return self.chat_repository.create_chat(chat)

    def get_history(self, user_id):
        return self.chat_repository.get_user_chats(user_id)