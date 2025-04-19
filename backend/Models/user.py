from mongoengine import Document, StringField, EmailField
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=6)
    role = StringField(default="user")
    meta = {'collection': 'users'}

    def hash_password(self):
        """ Hash the password before saving """
        self.password = bcrypt.generate_password_hash(self.password).decode("utf-8")

    def check_password(self, password):
        """ Verify password hash """
        return bcrypt.check_password_hash(self.password, password)
