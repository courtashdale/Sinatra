# main.py
from fastapi import FastAPI
from core.middleware import add_cors_middleware
from core.router import include_routers
from core.env import load_env

load_env()

app = FastAPI()
add_cors_middleware(app)
include_routers(app)
