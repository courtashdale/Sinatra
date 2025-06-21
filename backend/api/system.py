# api/system.py
from fastapi import APIRouter, FastAPI
from db.mongo import client
from datetime import datetime
from pymongo.errors import ConnectionFailure
import os, requests
from fastapi import Request, HTTPException, Query
from fastapi.responses import RedirectResponse
from db.mongo import users_collection, playlists_collection
from fastapi.responses import JSONResponse, PlainTextResponse


router = APIRouter(tags=["system"])

@router.get("/status")
def get_system_status():
    # Mongo
    try:
        client.admin.command("ping")
        mongo_status = "online"
    except ConnectionFailure:
        mongo_status = "offline"

    # Spotify
    try:
        res = requests.get("https://api.spotify.com/v1", timeout=2)
        spotify_status = "online" if res.status_code == 200 else "degraded"
    except Exception:
        spotify_status = "offline"

    # Vercel (ping frontend)
    frontend_url = os.getenv("PRO_FRONTEND_URL", "https://sinatra.live")
    try:
        res = requests.get(frontend_url, timeout=2)
        vercel_status = "online" if res.status_code == 200 else "degraded"
    except Exception:
        vercel_status = "offline"

    return {
        "backend": "online",
        "mongo": mongo_status,
        "spotify": spotify_status,
        "vercel_frontend": vercel_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/", response_class=PlainTextResponse, include_in_schema=False)
def health_check():
    return "Sinatra backend is alive."