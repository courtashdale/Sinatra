# api/playback.py
from fastapi import APIRouter, Query, Depends, HTTPException, Request, Body
import spotipy
from db.mongo import users_collection
from services.token import get_token
from services.spotify import build_track_data
from services.cookie import get_user_id_from_request

router = APIRouter(tags=["playback"])


@router.get("/playback")
def get_playback_state(request: Request, access_token: str = Depends(get_token)):
    user_id = get_user_id_from_request(request)

    sp = spotipy.Spotify(auth=access_token)

    try:
        playback = sp.current_playback()

        if playback and playback.get("item"):
            track_data = build_track_data(playback["item"], sp)

            existing = users_collection.find_one(
                {"user_id": user_id}, {"last_played_track": 1}
            )
            if (
                existing
                and existing.get("last_played_track", {}).get("id") == track_data["id"]
            ):
                print("🟡 Track already stored, skipping update.")
                return {"status": "unchanged", "track": track_data}

            users_collection.update_one(
                {"user_id": user_id}, {"$set": {"last_played_track": track_data}}
            )
            return {"playback": track_data}
        else:
            user = users_collection.find_one({"user_id": user_id})
            return {"playback": user.get("last_played_track", None)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recently-played")
def get_recently_played(
    request: Request, access_token: str = Depends(get_token), limit: int = 1
):
    sp = spotipy.Spotify(auth=access_token)

    try:
        recent = sp.current_user_recently_played(limit=limit)
        if not recent["items"]:
            return {"track": None}

        track = recent["items"][0]["track"]
        track_data = build_track_data(track, sp)
        return {"track": track_data}

    except Exception as e:
        print(f"⚠️ Recently played error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to fetch recently played track"
        )


@router.get("/now-playing")
def now_playing(request: Request, access_token: str = Depends(get_token)):
    sp = spotipy.Spotify(auth=access_token)

    try:
        current = sp.current_playback()
        if not current or not current.get("item"):
            return {"track": None}

        track = current["item"]
        track_data = build_track_data(track, sp)

        return {"track": track_data}

    except Exception as e:
        print(f"⚠️ Now playing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch now playing track")


@router.post("/update-playing")
def update_playing(request: Request, data: dict = Body(...)):
    user_id = get_user_id_from_request(request)

    try:
        track_data = data.get("track")
        if not track_data:
            raise HTTPException(status_code=400, detail="👀 Missing track data")

        existing = users_collection.find_one(
            {"user_id": user_id}, {"last_played_track": 1}
        )
        if (
            existing
            and existing.get("last_played_track", {}).get("id") == track_data.get("id")
        ):
            return {"status": "unchanged", "track": existing.get("last_played_track")}

        users_collection.update_one(
            {"user_id": user_id}, {"$set": {"last_played_track": track_data}}
        )

        return {"status": "updated", "track": track_data}

    except Exception as e:
        print(f"❌ Update playing error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to update last played track"
        )


@router.get("/check-recent")
def check_recent_track(request: Request):
    user_id = get_user_id_from_request(request)

    user = users_collection.find_one({"user_id": user_id})
    return {"track": user.get("last_played_track")}
