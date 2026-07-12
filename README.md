# Football Score

Football Score is a full-stack football score website. The system stores football data in MySQL first, then the frontend reads from the backend database. API-FOOTBALL is used only through admin sync routes because the free API plan has request and season limits.

## Main Features

- User register, login, and JWT authentication
- Admin-only data sync from API-FOOTBALL
- Fixtures by Cambodia date
- Match score and status
- Match detail with overview, H2H, prediction data, lineups, statistics, goal scorers, and streams
- League standings
- Search teams, leagues, players, and matches
- Favorite teams
- Pinned matches
- Admin stream-link management
- Global top match selected by admin
- User score predictions before kickoff
- Prediction point awarding by admin
- Public leaderboard

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, Sequelize, MySQL
- Auth: JWT and bcrypt
- External API: API-FOOTBALL from API-SPORTS

## Data Flow

Normal users:
- Read saved football data from MySQL through backend routes.
- Do not trigger API-FOOTBALL requests.

Admins:
- Sync fixtures, teams, players, standings, and match details from API-FOOTBALL.
- Add stream links.
- Select the top match.
- Award prediction points after a match ends.

## Backend Entry

```txt
back/src/server.js
```

Local backend URL:

```txt
http://localhost:4000
```

## Important Rule

Frontend must not call API-FOOTBALL directly. Public routes should stay database-only.
