import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate(
    "credentials/firebase-admin.json"
)

firebase_admin.initialize_app(cred)

from firebase_admin import auth

def verify_token(id_token):
    return auth.verify_id_token(id_token)

authorization = headers.get("Authorization")

token = authorization.replace("Bearer ", "")

decoded = verify_token(token)

uid = decoded["uid"]
email = decoded["email"]