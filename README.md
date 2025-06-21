# Combined Sinatra

This repository contains both the FastAPI backend and the React frontend of Sinatra that previously existed in separate repositories.

## Development

1. Install Python dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Install frontend dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

3. Start both servers
```bash
npm run dev: all
```
This runs the Vite dev server and the FastAPI backend together.

## Fortmatting

Run `npm run format` inside `frontend/` to format both projects. It formats the React code with Prettier and the backend with Black.