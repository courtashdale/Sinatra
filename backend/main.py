# main.py

from core.env import load_env
load_env()  # ✅ MUST come before importing anything that depends on env vars

from fastapi import FastAPI
from core.middleware import add_cors_middleware
from core.router import include_routers

app = FastAPI()
add_cors_middleware(app)
include_routers(app)