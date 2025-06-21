# models/playlists.py
from pydantic import BaseModel
from typing import List


class PlaylistSummary(BaseModel):
    id: str
    name: str
    image: str
    tracks: int

class PlaylistToSave(BaseModel):
    id: str

class PlaylistID(BaseModel):
    id: str

class SaveAllPlaylistsRequest(BaseModel):
    user_id: str
    playlists: List[PlaylistToSave]

class FeaturedPlaylistsUpdateRequest(BaseModel):
    user_id: str
    playlist_ids: List[str]