# api/auth.py
from fastapi import APIRouter, Request, Query, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse
import base64, json, os
import spotipy

from services.spotify_auth import get_spotify_oauth
from db.mongo import users_collection
from services.token import refresh_user_token

router = APIRouter(tags=["auth"])

NODE_ENV = os.getenv("NODE_ENV", "development").lower()
IS_DEV = NODE_ENV == "development"

DEV_BASE_URL = os.getenv("DEV_BASE_URL", "http://localhost:5173")
PRO_BASE_URL = os.getenv("PRO_BASE_URL", "https://sinatra.live")
CALLBACK_URL = os.getenv("DEV_CALLBACK") if IS_DEV else os.getenv("PRO_CALLBACK")


def safe_b64decode(data: str):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding).decode()


@router.get("/login")
async def login(redirect_uri: str = Query(...)):
    state_payload = json.dumps({"redirect_uri": redirect_uri})
    encoded_state = base64.urlsafe_b64encode(state_payload.encode()).decode()

    sp_oauth = get_spotify_oauth(redirect_uri)
    auth_url = sp_oauth.get_authorize_url(state=encoded_state)
    return RedirectResponse(auth_url)


@router.get("/callback")
async def callback(request: Request):
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code or state")

    try:
        decoded_state = safe_b64decode(state)
        redirect_uri = json.loads(decoded_state)["redirect_uri"]
        print(f"✅ Extracted redirect_uri from state: {redirect_uri}")
    except Exception as e:
        print(f"❌ Failed to decode state: {e}")
        raise HTTPException(status_code=400, detail=f"State decode error: {e}")

    try:
        sp_oauth = get_spotify_oauth(redirect_uri)
        token_info = sp_oauth.get_access_token(code, as_dict=True)
        sp = spotipy.Spotify(auth=token_info["access_token"])
        profile = sp.current_user()
        user_id = profile.get("id")
    except Exception as e:
        print(f"❌ Token exchange or user fetch failed: {e}")
        raise HTTPException(status_code=500, detail=f"Internal callback error: {e}")

    if not user_id:
        raise HTTPException(status_code=400, detail="Spotify user ID missing.")

    # Update or create user record
    users_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "access_token": token_info["access_token"],
                "refresh_token": token_info["refresh_token"],
                "expires_at": token_info["expires_at"],
            }
        },
        upsert=True,
    )

    # Build redirect response with secure, server-set cookie
    frontend_base = DEV_BASE_URL if IS_DEV else PRO_BASE_URL
    redirect_url = f"{frontend_base}/home"
    response = RedirectResponse(url=redirect_url)

    response.set_cookie(
        key="sinatra_user_id",
        value=user_id,
        httponly=True,
        secure=not IS_DEV,
        samesite="None" if not IS_DEV else "Lax",
        path="/",
        max_age=3600 * 24 * 7,
    )

    print(f"🍪 Set sinatra_user_id cookie: {user_id}")
    return response


@router.get("/refresh_token")
def refresh_token(refresh_token: str = Query(...)):
    sp_oauth = get_spotify_oauth()
    refreshed = sp_oauth.refresh_access_token(refresh_token)
    return {
        "access_token": refreshed["access_token"],
        "expires_in": refreshed["expires_in"],
    }


@router.get("/refresh-session")
def refresh_session(user_id: str = Query(...)):
    return refresh_user_token(user_id)


@router.get("/logout")
def logout_user():
    response = JSONResponse({"message": "Logged out"})
    response.delete_cookie(
        key="sinatra_user_id",
        path="/",
        samesite="None",  # Match what you used in login
        secure=True,  # Match what you used in login
    )
    return response
