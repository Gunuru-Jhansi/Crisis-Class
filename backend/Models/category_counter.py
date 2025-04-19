# models/category_counts.py

from mongoengine import Document, IntField

class CategoryCounts(Document):
    communication = IntField(default=0)
    electricity = IntField(default=0)
    food = IntField(default=0)
    infrastructure = IntField(default=0)
    medical = IntField(default=0)
    not_related = IntField(default=0)
    rescue = IntField(default=0)
    sanitation_and_hygiene = IntField(default=0)
    shelter = IntField(default=0)
    transportation = IntField(default=0)
    water = IntField(default=0)
