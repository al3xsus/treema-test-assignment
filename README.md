# Full-Stack ToDo Monorepo

A minimalist ToDo application built with a monorepo architecture.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Atomic CSS
- **Backend:** Node.js, Koa, MongoDB, Mongoose
- **Shared:** Zod (Schema Validation), TypeScript Interface

## Project Structure

- `apps/client`: frontend client.
- `apps/server`: backend server.
- `packages/shared`: Shared TypeScript types and Zod validation schemas.

## Setup Instructions

### 1. Prerequisites

- Node.js (v22.14.0+)
- MongoDB (Running locally or on Atlas)

### 2. Installation

From the root directory, install all dependencies:

```bash
npm install:all
```

### 3. env files

Create a `.env` file in the **root directory** (refer to `.env.example` in root) for server.

Create a `.env.local` file in the **apps/client** (refer to `apps/client/.env.example`) for client.

### 4. Start

npm run dev

---

Production-ready (Render-tailored) code can be accessed in `render` branch.

Server Endpoint: https://treema-test-assignment.onrender.com

Client endpoint: https://treema-test-assignment-client.onrender.com

Both are deployed on Free tier instances, so pleaste take a time, before they wake up from _sleeping_.
