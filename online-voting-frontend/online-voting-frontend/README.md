# Online Voting System — Frontend (React + Vite)

## Requirements
- Node.js 18+
- The backend running on http://localhost:8080 (see ../online-voting-backend/README.md)

## Setup

```bash
npm install
npm run dev
```

The app will start on **http://localhost:5173**

## What's included

- **React Router** for client-side routing (`src/App.jsx`)
- **AuthContext** (`src/context/AuthContext.jsx`) — stores the logged-in user and JWT in memory + localStorage
- **Axios instance** (`src/services/api.js`) — automatically attaches the JWT to every request and logs the user out on 401
- **Pages**:
  - `/` — Home
  - `/login`, `/register` — Auth
  - `/candidates` — Public candidate list
  - `/voter` — Voter dashboard (protected, VOTER role)
  - `/vote` — Cast a vote (protected, VOTER role, blocks duplicate votes)
  - `/admin` — Admin dashboard: add/edit/delete candidates, view registered voters (protected, ADMIN role)
  - `/results` — Live results with vote percentages

## Connecting to the backend

By default the API base URL is set in `src/services/api.js`:
```js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})
```
Change this if your backend runs on a different host/port.

## Build for production

```bash
npm run build
```
Output goes to `dist/`.
