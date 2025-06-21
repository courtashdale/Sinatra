# db/mongo.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB", "sinatra")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db.users
playlists_collection = db.playlists
