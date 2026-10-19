# EcoSort

EcoSort is a full-stack smart waste management platform. Users can record sorted waste, earn EcoPoints, find smart bins, redeem rewards, and compare their recycling activity on a leaderboard. Administrators can monitor users, waste activity, rewards, and bin capacity.

## Features

- User registration, login, and JWT authentication
- Waste disposal records across eight material categories
- Deterministic EcoPoints and material recovery scoring
- Dashboard statistics and disposal history
- Location-based smart bin discovery and capacity status
- EcoPoints rewards and voucher redemptions
- Community leaderboard
- Admin overview and management tools

## Technology

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, and Lucide React
- **Backend:** Node.js, Express, MongoDB, Mongoose, and JWT

## Project Structure

```text
backend/     Express API and MongoDB models/routes
frontend/    Next.js web application
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, either local or hosted

## Getting Started

### 1. Configure the backend

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecosort
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Its health endpoints are `/` and `/api/test`.

### 2. Configure the frontend

The frontend defaults to `http://localhost:5000/api`. To use another API URL, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install dependencies and start Next.js in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Available Scripts

### Backend

- `npm run dev` starts the API with Node's watch mode.
- `npm start` starts the API normally.

### Frontend

- `npm run dev` starts the Next.js development server.
- `npm run build` creates a production build.
- `npm start` serves the production build.
- `npm run lint` runs ESLint.

## Database Seeding

The API seeds the default smart bins automatically when the bin collection is empty. To run the location-bin seed script explicitly:

```bash
cd backend
node scripts/seedLocationBins.js
```

The script uses the MongoDB connection string from `backend/.env`.

## API Areas

The backend exposes routes under these prefixes:

- `/api/users`
- `/api/waste`
- `/api/bins`
- `/api/dashboard`
- `/api/admin`
- `/api/rewards`

Keep secrets in environment files. Environment files are ignored by Git; commit only safe example configuration when needed.
