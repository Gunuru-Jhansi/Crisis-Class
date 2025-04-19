""" from mongoengine import Document, StringField, EmailField

class UserMessage(Document):
    email = EmailField(required=True)  # User Email (Unique)
    message = StringField(required=True)  # Message Sent by User
    location = StringField(required=True)  # Location (Stored as String)

    meta = {'collection': 'user_messages'}  # Collection name in MongoDB
 """
from mongoengine import Document, StringField, EmailField, DateTimeField, DictField,BooleanField
from datetime import datetime
import pytz

class UserMessage(Document):
    email = EmailField(required=True)
    message = StringField(required=True)
    timestamp = DateTimeField(default=lambda: datetime.now(pytz.timezone("Asia/Kolkata")))
    location = StringField(required=False)
    classification = DictField(required=False)  # Store classification results
    status = StringField(default='pending', choices=['pending', 'in_progress', 'resolved'])
    is_emergency = BooleanField(default=False)
    
    meta = {
        'collection': 'user_messages',
        'indexes': ['email', 'timestamp', 'status']
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'message': self.message,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'location': self.location if self.location else None,
            'classification': self.classification if self.classification else None,
            'status': self.status,
            'is_emergency': self.is_emergency
        }