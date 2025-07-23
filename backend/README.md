# 🎛️ Backend

This directory contains the Python-based backend for the Sinatra application, built with FastAPI. It handles logic, data storage, and integration with the Spotify API.

## 🗺️ Folder Structure

- **api/**: Contains the API endpoints, with each file corresponding to a specific resource (e.g., `playback.py`, `playlists.py`).
- **core/**: Core application components, such as environment variable management and middleware.
- **db/**: Database-related modules, including the MongoDB connection and data read/write functions.
- **dev/**: Development-related scripts, documentation, and mind-mapping.
- **models/**: Pydantic models for data validation and serialization.
- **services/**: Business logic and services that interact with external APIs like Spotify.

## 👩‍🎤 Key Files

- **main.py**: The entry point for the FastAPI application.
- **requirements.txt**: A list of the Python dependencies for the project.
- **Procfile**: A file that specifies the commands to be executed by the Heroku platform.
- **example.env**: An example environment file.

## 🛰️ Technologies

- **FastAPI**: A modern, fast web framework for building APIs.
- **MongoDB**: A NoSQL database for storing application data.
- **Spotipy**: A lightweight Python library for the Spotify Web API.
- **Uvicorn**: An ASGI server for running the FastAPI application.

## 🔫 Setup and Execution

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Set up environment variables**: Copy `example.env` to `.env` and fill in the required values.
3. **Run the development server**: `uvicorn main:app --reload`
