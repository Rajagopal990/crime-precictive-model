# API Documentation

Base URL: `http://localhost:8000/api/v1`

## Auth

### `POST /auth/register`
Body:
```json
{ "username": "newuser", "password": "StrongPass@123", "role": "officer" }
```
Response:
```json
{ "id": 3, "username": "newuser", "role": "officer", "created_at": "..." }
```

### `POST /auth/login`
Body:
```json
{ "username": "admin", "password": "Admin@123" }
```
Response:
```json
{ "access_token": "...", "token_type": "bearer" }
```

### `GET /auth/users`
Returns all registered users from the database.
Requires an admin bearer token.

## FIR Management

### `POST /firs`
Create FIR (Admin/Officer)

### `GET /firs`
Query params:
- `crime_type`
- `police_station`
- `from_date` (ISO datetime)
- `to_date` (ISO datetime)

### `POST /firs/upload`
Multipart file upload (Admin/Officer)

Supported formats:
- CSV (`.csv`)
- JSON (`.json`)
- Excel (`.xlsx`, `.xls`)
- PDF (`.pdf` text/table PDFs)
- Images (`.png`, `.jpg`, `.jpeg`, `.bmp`, `.webp`, `.tiff`)

Notes:
- Video uploads are rejected (`415 Unsupported Media Type`).
- Image uploads run a lightweight CNN-based analyzer and return `cnn_report`.
- Max upload size: 8MB.

### `POST /firs/predict`
Returns risk probability/label for supplied FIR payload.

## Classification

### `POST /classification/tag`
Maps FIR code/description to acts: `IPC`, `NDPS`, `ARMS`, `MOTOR`.

## Analytics

### `GET /analytics/dashboard`
Returns:
- Summary KPIs
- Hotspots
- Behavioral analysis
- Women safety zones
- Accident clusters
- Patrol route
- Alert feed

## Assistant

### `POST /assistant/chat`
Body:
```json
{ "query": "Where are the highest crime hotspots?" }
```

## Security
- JWT bearer auth
- Role-based route guards
- Pydantic validation on request payloads
- SQLAlchemy ORM parameterized queries (SQL-injection resistant)

## Live Docs
FastAPI Swagger UI: `http://localhost:8000/docs`
