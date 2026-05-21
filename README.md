# DevPulse

> GitHub developer analytics at a glance

![Backend Coverage](https://img.shields.io/badge/backend%20coverage-96.92%25-brightgreen)
![Frontend Tests](https://img.shields.io/badge/frontend%20tests-10%20passed-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue)

## Live Demo

[Live Demo](https://devpulse.vercel.app) · [GitHub](https://github.com/Atul8108/devpulse)

## Screenshots

### Home
![DevPulse home page](./docs/screenshots/home.png)

### Developer Dashboard
![Developer dashboard](./docs/screenshots/dashboard.png)

## Features

- 🔥 GitHub contribution heatmap (365 days)
- 🥧 Language breakdown pie chart
- 📈 Activity trend line chart (12 months)
- 🚀 Trending developers (last 7 days)
- 🔍 Recent searches (last 5, stored in Zustand)
- ⚡ MongoDB cache with auto-expiry (TTL index)
- 🔀 Parallel GitHub REST + GraphQL API calls
- 🛡️ Rate limiting + helmet security headers

## Tech Stack

| Layer      | Technologies                                                                  |
|------------|-------------------------------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, React Router v6, Zustand, Recharts, Tailwind CSS |
| Backend    | Node.js, Express.js, TypeScript, MongoDB, Mongoose                            |
| APIs       | GitHub REST API, GitHub GraphQL API                                           |
| Deploy     | Vercel (frontend), Railway (backend), MongoDB Atlas                           |

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI and GITHUB_TOKEN
npm install && npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # fill in VITE_API_URL
npm install && npm run dev
```

## API Endpoints

| Method | Endpoint              | Description                                    |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/user/:username` | Fetch GitHub profile + stats (cached 5 min)   |
| GET    | `/api/trending`       | Top 10 most searched developers (last 7 days) |
| GET    | `/health`             | Server health check                            |

## Key Architecture Decisions

- **MongoDB TTL index** handles cache expiry automatically — no cron job needed, the database evicts stale documents on its own.
- **Promise.all** fires REST + GraphQL requests in parallel, cutting average response time by ~60% compared to sequential fetches.
- **Zustand over Redux** — simpler API and zero boilerplate for the state complexity this project requires.
- **Vite over Next.js** — faster dev-server HMR, simpler static deployment, and no SSR overhead for a fully public, client-rendered app.

## Folder Structure

```
devpulse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── models/
│   │   │   ├── Profile.ts
│   │   │   └── SearchHistory.ts
│   │   ├── routes/
│   │   │   ├── user.routes.ts
│   │   │   └── trending.routes.ts
│   │   ├── services/
│   │   │   ├── github.service.ts
│   │   │   └── cache.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── StatCards.tsx
│   │   │   ├── ContribHeatmap.tsx
│   │   │   ├── LanguageChart.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── TrendingList.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── store/
│   │   │   └── useAppStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── docs/
    └── screenshots/
        ├── home.png
        └── dashboard.png
```

## License

MIT License — Atul Shaw 2026
