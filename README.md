# NexusAI — Backend API

![Status: Active](https://img.shields.io/badge/status-active-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![License](https://img.shields.io/badge/license-UNSPECIFIED-lightgrey)

A production-ready Express + TypeScript REST API powering NexusAI — a freelancing marketplace with AI integrations. Features include JWT authentication, OAuth (Google), rate limiting, input validation, AI endpoints (Gemini), Cloudinary uploads, and robust error handling.

- Codebase: TypeScript, Express, Mongoose (MongoDB)
- Opinionated structure with services, controllers, routes, models, validations, and middleware
- Ready for local development, seeding, and production builds

---

## Quick links

- Entry point: [src/server.ts](src/server.ts#L1)
- App setup: [src/app.ts](src/app.ts#L1)
- Environment config: [src/config/env.ts](src/config/env.ts#L1)
- Database: [src/config/db.ts](src/config/db.ts#L1)
- Package scripts: [package.json](package.json#L1)

---

## Features

- JWT access + refresh token authentication
- OAuth via Google (Passport)
- Secure defaults: Helmet, CORS, input sanitization, rate limiting
- Type-safe environment validation (Zod)
- AI integration using Gemini (configured via `GEMINI_API_KEY`)
- File uploads support (Cloudinary)
- Modular architecture: controllers, services, routes, models
- Health check endpoint: `/health`

---

## Tech stack

- Node.js >= 18
- TypeScript
- Express
- MongoDB (Mongoose)
- Passport (Google OAuth)
- Zod for environment validation

---

## Getting started (local)

Prerequisites

- Node.js >= 18
- npm or yarn
- MongoDB instance or Atlas cluster
- A Gemini API key (or other AI key if you adapt the AI service)

1. Clone

```bash
git clone <your-repo-url>
cd backend
```

2. Install

```bash
npm install
# or
# yarn
```

3. Environment

Create a `.env` in the `backend` folder. Example variables (full list below):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexusai
JWT_SECRET=verylongsecret_atleast32chars_please_change
JWT_REFRESH_SECRET=anotherlongsecret_atleast32chars
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

4. Seed (optional)

```bash
npm run seed
```

5. Run (development)

```bash
npm run dev
```

Open: http://localhost:5000/health

---

## Available npm scripts

- `npm run dev` — Run in dev mode (ts-node + nodemon)
- `npm run build` — Transpile to `dist/`
- `npm start` — Run production build from `dist/`
- `npm run seed` — Seed database (`src/seed/seed.ts`)
- `npm run lint` — Lint source
- `npm run typecheck` — TypeScript type check

---

## Environment variables

This project validates environment variables in [src/config/env.ts](src/config/env.ts#L1). Key variables:

- `NODE_ENV` — `development|production|test` (default: development)
- `PORT` — HTTP port (default: 5000)
- `MONGO_URI` — MongoDB connection string (required)
- `JWT_SECRET` — Access token secret (min 32 chars)
- `JWT_EXPIRES_IN` — Access token TTL (default `7d`)
- `JWT_REFRESH_SECRET` — Refresh token secret (min 32 chars)
- `JWT_REFRESH_EXPIRES_IN` — Refresh TTL (default `30d`)
- `GEMINI_API_KEY` — AI provider API key (required)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth credentials (optional)
- `CLOUDINARY_*` — Cloudinary credentials (optional)
- `SMTP_*` — Email SMTP settings (optional)
- `CLIENT_URL` — Frontend origin used for OAuth redirects
- `RATE_LIMIT_*` — Rate limiter settings

Always keep secrets out of source control and rotate them periodically.

---

## API Overview

Base URL: `/api/v1`

Auth endpoints (examples):

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login (returns access token)
- `POST /api/v1/auth/refresh` — Refresh access token (uses refresh cookie or body)
- `POST /api/v1/auth/logout` — Logout (clears cookies)
- `GET /api/v1/auth/me` — Get current user (requires auth cookie / bearer)
- `GET /api/v1/ai/*` — AI powered endpoints (rate-limited)

Authentication

- Access tokens are issued as JWTs. The server also sets `accessToken` and `refreshToken` cookies for browser flows. You can pass `Authorization: Bearer <token>` for API clients.

Example using curl (login):

```bash
curl -X POST https://api.example.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

## File structure (detailed)

Below is a compact, human-friendly tree of the `src/` folder with short descriptions and links to key files.

```text
src/
├─ server.ts               # Server bootstrap — connect DB, start HTTP server
├─ app.ts                  # Express app — middleware, security, routing, error handler
├─ config/
│  ├─ env.ts               # Zod-validated env vars and derived flags
│  ├─ db.ts                # Mongoose connection + retry logic
│  ├─ cors.ts              # CORS middleware
│  └─ passport.ts          # Passport strategies (Google OAuth)
├─ routes/
│  ├─ index.ts             # Root router mounting feature routers
│  ├─ auth.routes.ts       # Auth endpoints (login/register/OAuth)
│  ├─ user.routes.ts       # User endpoints
│  ├─ gig.routes.ts        # Gigs CRUD/search
│  ├─ talent.routes.ts     # Talent discovery/profile
│  ├─ review.routes.ts     # Reviews
│  ├─ ai.routes.ts         # AI endpoints (Gemini)
│  ├─ admin.routes.ts      # Admin-only endpoints
│  └─ blog.routes.ts       # Blog CMS endpoints
├─ controllers/
│  ├─ auth.controller.ts   # Auth handlers (register/login/refresh/OAuth)
│  ├─ user.controller.ts   # User CRUD and profile
│  ├─ gig.controller.ts    # Gigs handlers
│  ├─ talent.controller.ts # Talent handlers
│  └─ ai.controller.ts     # Controllers calling AI services
├─ services/
│  ├─ auth.service.ts      # Token generation, cookie management
│  ├─ user.service.ts      # User business logic
│  ├─ gig.service.ts       # Gig business logic
│  └─ ai.service.ts        # AI provider integration (Gemini)
├─ models/
│  ├─ User.model.ts        # User schema, auth helpers
│  ├─ Gig.model.ts         # Gig schema
│  ├─ Review.model.ts      # Review schema
│  └─ AIsession.model.ts   # AI session logs
├─ middleware/
│  ├─ auth.middleware.ts   # Route protection
│  ├─ error.middleware.ts  # Centralized error handling
│  └─ validate.middleware.ts # Zod request validation wrapper
├─ validations/            # Zod schemas for request bodies
├─ utils/                  # Helpers (jwt, ApiError, ApiResponse, prompts)
└─ seed/
  └─ seed.ts             # Database seeding script
```

Quick links to important files:

- `server` — [src/server.ts](src/server.ts#L1)
- `app` — [src/app.ts](src/app.ts#L1)
- `env` — [src/config/env.ts](src/config/env.ts#L1)
- `db` — [src/config/db.ts](src/config/db.ts#L1)
- `auth service` — [src/services/auth.service.ts](src/services/auth.service.ts#L1)
- `user model` — [src/models/User.model.ts](src/models/User.model.ts#L1)
- `AI service` — [src/services/ai.service.ts](src/services/ai.service.ts#L1)
- `routes index` — [src/routes/index.ts](src/routes/index.ts#L1)

Swagger UI: visit `http://localhost:5000/api/v1/docs` after starting the server to preview the OpenAPI spec.

If you want this exported to `docs/FILES.md` or rendered as collapsible sections in the README, I can add that next.

---

## Database & Seeding

The app uses MongoDB via Mongoose. Connection and retry logic are in [src/config/db.ts](src/config/db.ts#L1).

To seed sample data (if `src/seed/seed.ts` is implemented):

```bash
npm run seed
```

---

## Testing & Linting

No bundled test runner found in `package.json`. To add tests, consider Jest or Vitest and add `test` script.

Linting uses ESLint (`npm run lint`). Type checking: `npm run typecheck`.

---

## Docker (optional)

A minimal `Dockerfile` you can adapt:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["node","dist/server.js"]
```

Example `docker-compose.yml` (snippet):

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/nexusai
      - JWT_SECRET=changeme
  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

---

## Security & Production notes

- Use strong, unique `JWT_SECRET` and `JWT_REFRESH_SECRET` (>=32 characters)
- HTTPS termination in front of the app (TLS)
- Store secrets in a secret manager or environment variables (avoid .env in production)
- Consider running behind a process manager (PM2) or container orchestrator
- Monitor logs and set up alerting for error spikes

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with clear description and tests

Please include unit tests for new behaviors and run lint/typecheck before submitting.

---

## TODOS / Suggestions

- Add a `LICENSE` file and update badge
- Add an API reference (OpenAPI / Swagger) for discoverability
- Add tests and CI (GitHub Actions)
- Add a CONTRIBUTING.md for contributor guidelines

---

## Contact

If you need help, open an issue or contact the maintainers listed in the repository.

---

<p align="center">Made with ❤️ — NexusAI Backend</p>
