# AquaHub Back End

Express 5 + TypeScript API using PostgreSQL and handwritten parameterized SQL.

## Setup

1. Create a PostgreSQL database named `aquahub`.
2. Copy `.env.example` to `.env` and update the values.
3. Install dependencies with `npm install` from this directory.
4. Apply `database/migrations/001_create_initial_tables.sql` to the database.
5. Start the API with `npm run dev`.

The default API URL is `http://localhost:3000`.

## Endpoints

```text
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/aquariums
POST   /api/aquariums
GET    /api/aquariums/:aquariumId
PATCH  /api/aquariums/:aquariumId
DELETE /api/aquariums/:aquariumId
```

Authentication uses a short-lived JWT stored in an HTTP-only cookie. Browser
requests from a separate origin must include credentials.

```ts
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```
