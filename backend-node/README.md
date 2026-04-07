# Role-Based FIR Module (Node.js + Express)

This module adds a complete role-based FIR workflow with MySQL, JWT, and RBAC.

## Roles
- `admin`
- `police_officer`
- `public_user`

## Workflow
1. Public user submits complaint (`POST /api/complaint`).
2. Admin reviews and assigns complaint to officer (`PUT /api/complaints/:id/assign`).
3. Police officer verifies and creates FIR (`POST /api/fir`).
4. FIR status moves through lifecycle (`PUT /api/fir/:id/status`).
5. Data feeds hotspot and prediction endpoints.

## Backend Setup
```bash
cd backend-node
copy .env.example .env
npm install
```

Create database and tables:
```bash
# in MySQL
CREATE DATABASE crime_rbac;
USE crime_rbac;
SOURCE sql/schema.sql;
```

Run backend:
```bash
npm run dev
```

## APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/complaint`
- `GET /api/complaints`
- `PUT /api/complaints/:id/assign`
- `POST /api/fir`
- `GET /api/firs`
- `PUT /api/fir/:id/status`
- `GET /api/analytics/hotspots`
- `GET /api/analytics/predictions`
- `GET /api/alerts/safety`

## Frontend
React module component:
- `src/components/rbac/RoleBasedFIRModule.js`

It provides separate screens for Admin, Police Officer, and Public User.
