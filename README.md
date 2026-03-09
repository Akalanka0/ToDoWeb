# ToDoWeb

[![CI](https://github.com/Akalanka0/ToDoWeb/actions/workflows/ci.yml/badge.svg)](https://github.com/Akalanka0/ToDoWeb/actions/workflows/ci.yml)

Simple full‑stack ToDo app demonstrating a clean React + Express + MongoDB setup that is deployment‑friendly and secure by default.

For a detailed overview of technologies and architecture, see [TECH-STACK.md](./TECH-STACK.md).

## Tech Stack
- Frontend: React 19, Vite 7, Axios, ESLint
- Backend: Node 20, Express 4, MongoDB Driver 6
- Tooling: Concurrently (root scripts), Mocha + Supertest (backend tests)
- Deploy: Vercel (frontend) + Railway (backend)

## Features
- Create, list, toggle, and delete todos
- Optimistic UI updates
- Secure headers, CORS, and rate limiting
- Clean project structure and ready‑to‑deploy configuration

## Project Structure
```
/                     Root (orchestration scripts)
├─ backend/           Express API (MongoDB)
│  ├─ server.js       App entry + routes + security
│  ├─ db.js           Mongo connection helper
│  ├─ test/           Mocha + Supertest tests
│  └─ .env.example    Copy to .env and fill values
├─ frontend/          React app (Vite)
│  ├─ src/            UI and styles
│  ├─ index.html
│  └─ vercel.json     Rewrites /api/* → deployed backend
└─ package.json       Root scripts to run both apps
```

## Environment Variables
Create `backend/.env` using `backend/.env.example`:
```
MONGODB_URI=your-mongodb-connection-string
FRONTEND_URL=http://localhost:5173
PORT=3001
```
Do not commit `.env`. It’s excluded by `.gitignore`. In production, set these in Railway.

## Local Development
From project root:
```
npm run install:all
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:3001

## Build
```
npm run build
```
Outputs static assets to `frontend/dist/`.

## Tests (Backend)
```
cd backend
npm test
```
Runs Mocha + Supertest tests. These do not require a database.

## Security
- Helmet secure headers
- Rate limiting (100 req per 15 minutes)
- CORS restricted to `FRONTEND_URL`
- No secrets in repo; all via environment variables

## Deployment
### Frontend (Vercel)
1. Push this repository to GitHub.
2. Import the repo in Vercel and deploy the `frontend` build.
3. Confirm `frontend/vercel.json` rewrites `/api/(.*)` to your Railway backend URL.

### Backend (Railway)
1. Connect your GitHub repo in Railway.
2. Railway uses `railway.toml` to build from `backend`.
3. Set environment variables in Railway:
   - `MONGODB_URI`
   - `FRONTEND_URL` (your Vercel domain)
4. Deploy and verify `GET /health` and `GET /api/health`.

### Run for One Day, Then Stop
- Vercel: remove or pause the project after demonstration.
- Railway: pause or delete the service/project in the Railway dashboard to avoid charges.

## CI
This repo includes a GitHub Actions workflow to lint, build, and test. Update the badge after pushing:
```
https://github.com/Akalanka0/ToDoWeb/actions/workflows/ci.yml/badge.svg
```

## Optional CD (GitHub Actions)
- A deployment workflow is available at [.github/workflows/cd.yml](.github/workflows/cd.yml). It deploys to:
  - Railway (backend) when these GitHub secrets are set: `RAILWAY_TOKEN`, `RAILWAY_PROJECT_ID`, `RAILWAY_SERVICE_ID`
  - Vercel (frontend) when these GitHub secrets are set: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- It runs on push to `main` and on manual dispatch. If secrets are not present, the corresponding job is skipped.

## License
MIT
