# Crime Predictive Model & Hotspot Mapping System

Production-ready hackathon demo system for FIR intelligence, hotspot mapping, prediction, behavior analytics, patrol planning, women safety and accident hotspot detection.

## Project Structure

```text
.
+- backend/
¦  +- app/
¦  ¦  +- api/                 # Auth, FIR, analytics, classification, chatbot endpoints
¦  ¦  +- core/                # Config and security helpers
¦  ¦  +- db/                  # SQLAlchemy base/session
¦  ¦  +- models/              # User and FIR entities
¦  ¦  +- schemas/             # Pydantic request/response schemas
¦  ¦  +- services/            # FIR ingestion and ML analytics logic
¦  ¦  +- main.py              # FastAPI app bootstrap
¦  +- data/                   # Generated dummy dataset (1200 records)
¦  +- scripts/                # Data generation and DB seeding
¦  +- API_DOCS.md
¦  +- requirements.txt
¦  +- Dockerfile
+- src/
¦  +- components/             # Dashboard UI modules
¦  +- hooks/
¦  +- services/
¦  +- App.js
¦  +- index.css
+- docker-compose.yml
+- Dockerfile                 # Frontend production container
```

## Features

- FIR data ingestion
  - Manual entry form
  - CSV/JSON bulk upload
- Crime classification
  - IPC / NDPS / Arms / Motor tags
- Hotspot mapping
  - Leaflet interactive map
  - Red/Orange/Green risk markers
  - Area risk classification (High / Medium / Low)
- AI prediction
  - Random Forest model for high-risk probability
- Behavioral analytics
  - Crime vs hour/month charts
- Patrol optimization
  - A* path over risk-weighted graph
  - Smart patrol route suggestions with checkpoints
- Women safety analysis
  - Unsafe-zone markers and density support
- Accident-prone detection
  - DBSCAN clustering
- Security
  - JWT auth
  - Role-based access (Admin/Officer)
  - Request validation and secure ORM usage
- Real-time operations support
  - Dashboard auto-refresh every 15 seconds
  - Live FIR activity feed for quick decisions
- Bonus
  - Dark mode
  - Animated dashboard cards
  - Alert feed
  - Police query chatbot

## Dummy Dataset

Generate 1200 FIR records:

```bash
cd backend
python scripts/generate_dummy_data.py
```

Outputs:
- `backend/data/fir_dummy_1200.csv`
- `backend/data/fir_dummy_1200.json`

## Local Setup (Without Docker)

### 1) Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python scripts/generate_dummy_data.py
uvicorn app.main:app --reload --port 8000
```

Optional DB seed and model train:

```bash
python scripts/seed_db.py
```

Default users:
- Admin: `admin` / `Admin@123`
- Officer: `officer` / `Officer@123`

### 2) Frontend

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

### 3) Custom Local Domain (Windows)

To open the app as `http://rajafrondend:3000` instead of localhost:

```bash
npm run domain:setup
npm run dev:domain
```

This starts backend + frontend together.`r`n`r`nThen open:
- `http://rajafrondend:3000`
- `http://www.rajafrondend:3000`

Note: `npm run domain:setup` must be run in an Administrator terminal.

## Docker Deployment

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

## API Documentation

See: `backend/API_DOCS.md`

## Notes

- The backend auto-retrains prediction model when new FIR data is added/uploaded.
- Dashboard auto-refreshes every 15 seconds for near real-time monitoring.
- For production, rotate JWT secret and enforce HTTPS.



