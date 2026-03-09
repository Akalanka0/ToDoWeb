# ToDoWeb (React + Vite + Express + MongoDB)

Simple full‑stack ToDo app that is deployment‑friendly and secure by default.

## Tech Stack
- Frontend: React 19, Vite 7, Axios, ESLint
- Backend: Node 20, Express 4, MongoDB Driver 6
- Tooling: Concurrently (root scripts), Mocha + Supertest (backend tests)
- Deploy: Vercel (frontend) + Railway (backend)

## Project Structure
```
/
├─ backend/        # Express API (MongoDB)
│  ├─ server.js
│  ├─ db.js
│  ├─ test/
│  └─ .env.example # copy to .env and fill values
├─ frontend/       # React app (Vite)
│  ├─ src/
│  ├─ index.html
│  └─ vercel.json  # rewrites /api/* to deployed backend
└─ package.json    # root scripts to run both apps
```

## Prerequisites
- Node.js 20.x (LTS)
- A MongoDB connection string (e.g., MongoDB Atlas)

## Environment Variables
Create a `backend/.env` file by copying `backend/.env.example`:
```
MONGODB_URI=your-mongodb-connection-string
FRONTEND_URL=http://localhost:5173
```
- Never commit `.env`. The repository `.gitignore` already excludes it.
- In production, set `MONGODB_URI` and `FRONTEND_URL` in the hosting provider (Railway).

## Install & Run (Local)
From the project root:
```
npm run install:all
npm run dev
```
- Frontend dev server: http://localhost:5173
- API dev server: http://localhost:3001
- During development, Vite proxies `/api/*` to the backend via `frontend/vite.config.js`.

## Build
```
npm run build
```
Outputs production assets to `frontend/dist/`.

## Tests (Backend)
```
cd backend
npm test
```
Runs Mocha + Supertest basic route tests. These do not require a database.

## Security & Hardening
- Helmet enabled for common HTTP headers.
- Rate limiting (15 min window, 100 requests) on the API.
- CORS restricted to `FRONTEND_URL`.
- No secrets in the repo; use environment variables.
- Dependency audits addressed via `npm audit fix`.

## Deployment
### Frontend (Vercel)
- Connect the repository to Vercel and deploy the `frontend` build automatically.
- Ensure `frontend/vercel.json` rewrites `/api/(.*)` to your deployed backend URL.

### Backend (Railway)
- Railway picks `backend` as build root via `railway.toml`.
- Set environment variables in Railway:
  - `MONGODB_URI`
  - `FRONTEND_URL` (your deployed Vercel domain)
- Backend `package.json` pins Node `20.x`.

## Notes
- API base path in the frontend is relative (`/api/todos`) to work both in dev and prod.
- Health endpoints:
  - `GET /api/health` – static OK
  - `GET /health` – includes DB ping status
