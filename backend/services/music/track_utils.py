# services/music/track_utils.py

from typing import Dict, List
from .wizard import get_parent_genre, get_gradient_for_genre


def apply_meta_gradients(track: Dict) -> Dict:
    """Return a copy of the track with genres mapped to meta genres with gradients."""
    if not isinstance(track, dict):
        return track

    raw_genres: List[str] = track.get("genres") or []
    meta_entries = []
    seen = set()

    for genre in raw_genres:
        parent = get_parent_genre(genre)
        if parent in seen:
            continue
        meta_entries.append(
            {
                "name": parent,
                "gradient": get_gradient_for_genre(parent),
            }
        )
        seen.add(parent)

    updated = track.copy()
    updated["genres"] = meta_entries
    return updated
