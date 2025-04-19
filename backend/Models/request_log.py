# models/request_log.py
from mongoengine import Document, StringField, DateTimeField,ReferenceField
from datetime import datetime
from Models.adminMsgs import UserMessage

class RequestLog(Document):
    category = StringField(required=True)
    timestamp = DateTimeField(default=datetime.utcnow)
    message = ReferenceField(UserMessage)  # Add this line

