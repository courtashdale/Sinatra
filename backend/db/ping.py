# db/ping.py
from pymongo.errors import ConnectionFailure
from db.mongo import client

def check_mongo_connection():
    try:
        client.admin.command("ping")
        return True
    except ConnectionFailure:
        return False