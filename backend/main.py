# main.py
from fastapi import FastAPI
from core.middleware import add_cors_middleware
from core.router import include_routers

app = FastAPI()
add_cors_middleware(app)
include_routers(app)