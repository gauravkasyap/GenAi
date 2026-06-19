from src.repositories.user_repository import UserRepository


class AuthService:

    def __init__(self):
        self.user_repository = UserRepository()

    def register(self, user):
        existing = self.user_repository.find_by_email(user["email"])

        if existing:
            raise Exception("Email already exists")

        self.user_repository.create_user(user)

        return {
            "message": "Registration Successful"
        }

    def login(self, email):
        return self.user_repository.find_by_email(email)