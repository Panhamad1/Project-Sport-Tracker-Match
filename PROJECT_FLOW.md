# Football Score Project Flow

## Project Overview

Football Score is a full-stack football score website. The system saves football data in MySQL first, then the frontend reads that saved data through backend routes.

API-FOOTBALL is used only by admin sync features because the free API plan has request and season limits. Public users and guests never call API-FOOTBALL directly.

## Main Goals

- View football fixtures by Cambodia date
- View scores and match status such as NS, 1H, HT, FT, AET, and PEN
- View match details with overview, H2H, prediction data, lineups, statistics, goal scorers, and stream links
- View league standings
- Search teams, leagues, players, and matches
- Save favorite teams
- Pin important matches
- Submit prediction picks before kickoff
- View a public leaderboard
- Build a dream team
- Let admin choose a global top match
- Let admin sync and maintain football data

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Icons

Backend:
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT authentication
- bcrypt password hashing
- axios for external API requests

External data source:
- API-FOOTBALL from API-SPORTS
- Base URL: `https://v3.football.api-sports.io`
- Timezone: `Asia/Phnom_Penh`

## Core System Rule

The project is database-first.

Normal public flow:
1. User opens frontend.
2. Frontend calls backend public routes.
3. Backend reads football data from MySQL.
4. Backend returns saved data.
5. If no saved data exists, backend returns an empty result or no-data response.

Admin sync flow:
1. Admin logs in.
2. Backend verifies JWT.
3. Backend loads the user from MySQL.
4. Backend checks `role === "admin"`.
5. Admin calls sync routes.
6. Backend fetches API-FOOTBALL data.
7. Backend saves or updates MySQL.
8. Public users see the updated saved data.

## Authentication Flow

Register:
1. User sends username, email, and password.
2. Backend validates required fields.
3. Backend checks duplicate username or email.
4. Password is hashed with bcrypt.
5. User is created with role `user`.
6. Backend returns JWT and user profile.

Login:
1. User sends identifier and password.
2. Identifier can be username or email.
3. Backend checks password with bcrypt.
4. Backend returns JWT and user profile.

Protected routes:
1. Frontend sends `Authorization: Bearer TOKEN`.
2. Backend verifies token.
3. Backend loads user from database.
4. Route uses `req.user`.

Admin routes:
1. Route uses `protect`.
2. Route uses `adminOnly`.
3. Backend checks the role from database.

## Admin Account Setup

Admin accounts are created by registering normally, then updating the role in MySQL:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin_email@gmail.com';
```

This prevents normal users from creating admin accounts through the frontend.

## Fixture Flow

Admin sync:
1. Admin calls fixture sync with a date range.
2. Backend fetches fixtures from API-FOOTBALL.
3. Backend filters by allowed league ids.
4. Backend saves leagues, teams, fixtures, and fixture sync logs.
5. Existing fixtures are updated by `api_fixture_id`.

Public fixture view:
1. User selects a date.
2. Frontend calls `GET /api/football/fixtures/date/:date`.
3. Backend reads fixtures from MySQL by Cambodia date range.
4. Backend returns saved fixtures only.

## Match Detail Flow

Admin detail sync:
1. Admin loads saved fixtures by date.
2. Admin syncs one match detail or all match details for that date.
3. Backend fetches statistics, lineups, prediction data, H2H, and events where available.
4. Backend saves match detail data in MySQL.

Public match detail:
1. User opens a match detail page.
2. Frontend calls `GET /api/football/matches/:apiFixtureId`.
3. Backend returns overview, H2H, prediction data, lineups, statistics, goal scorers, and stream links.
4. If a section has no data, frontend can show "No Data Yet".

## League And Standing Flow

Admin sync:
1. Admin chooses league id and season.
2. Backend fetches standings from API-FOOTBALL.
3. Backend saves the league header and standing rows.

Public view:
1. Frontend requests standings by league and season.
2. Backend reads saved standings from MySQL.
3. Frontend shows league table and team rows.

## Team And Player Flow

Team sync:
1. Admin chooses league id and season.
2. Backend fetches teams from API-FOOTBALL.
3. Backend saves or updates teams.

Player sync by team:
1. Admin chooses team id and season.
2. Backend fetches player data by team and season.
3. Backend saves players and player statistics.
4. Pagination is limited for API plan safety.

Specific player sync:
1. Admin chooses player id and season.
2. Backend fetches that player.
3. Backend saves player profile, team, league, and statistics data.

## Search Flow

Search is database-only.

Supported types:
- all
- teams
- leagues
- players
- matches

Flow:
1. User types in the search bar.
2. Frontend calls backend search route.
3. Backend searches MySQL.
4. Frontend shows grouped results.
5. Recent searches can be stored in browser local storage.

## User Features

Favorite teams:
1. Logged-in user favorites a team.
2. Backend uses `req.user.id`.
3. Backend saves `user_id` and `team_id`.
4. Duplicate favorites are prevented by a unique index.
5. User can view and remove favorite teams.

Pinned matches:
1. Logged-in user pins a match by API fixture id.
2. Backend finds the local fixture.
3. Backend saves `user_id` and `fixture_id`.
4. User can view and remove pinned matches.

Dream team:
1. Logged-in user chooses a formation.
2. User selects players for formation slots.
3. Backend stores the dream team as formation plus player slot data.
4. User can update or delete the dream team.

## Admin Match Features

Top match:
1. Admin selects one global top match.
2. Backend stores it in `featured_fixtures`.
3. Public home page can request the current top match.
4. It is not limited by date, so admin can feature any saved match.

Stream links:
1. Admin opens a match detail page.
2. Admin goes to the Streams tab.
3. Admin adds a stream title, source, and URL.
4. Backend saves the link to `stream_links`.
5. Public users see active stream links in the Streams tab.
6. Admin can remove stream links.

## Prediction Flow

Prediction markets:
- Winner: Home, Draw, Away
- Over/Under: only 0.5, 1.5, 2.5, 3.5, 4.5, and 5.5 lines

Admin odds sync:
1. Admin opens a match detail page.
2. Admin goes to the Prediction tab.
3. Admin clicks Sync Odds.
4. Backend fetches odds from API-FOOTBALL.
5. Backend saves supported odds in `fixture_odds`.

User pick flow:
1. Logged-in user opens a match before kickoff.
2. User selects a winner or over/under option.
3. Backend saves the selected odd snapshot.
4. Prediction locks when the match starts.

Point flow:
1. Admin refreshes final score/status.
2. Admin awards prediction points after match finishes.
3. Correct pick adds the odd value.
4. Wrong pick subtracts the odd value.
5. User points are stored as decimals.

Example:
- Pick odd: 1.85
- Correct: +1.85 points
- Wrong: -1.85 points

## Leaderboard Flow

1. Backend reads users ordered by points.
2. Admin users are excluded.
3. Points are decimal values because prediction points come from odds.
4. Public leaderboard returns rank, username, points, prediction count, settled count, correct count, wrong count, pending count, and win rate.

## Main Backend Routes

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Fixtures:
- `GET /api/football/fixtures/date/:date`

Matches:
- `GET /api/football/matches/:apiFixtureId`
- `GET /api/football/matches/:apiFixtureId/streams`

Leagues:
- `GET /api/football/leagues/:leagueId/standings?season=YYYY`

Search:
- `GET /api/football/search?search=word&type=all`

Favorites:
- `POST /api/favorites/teams/:teamId`
- `GET /api/favorites/teams`
- `DELETE /api/favorites/teams/:teamId`

Pinned matches:
- `POST /api/pinned/matches/:apiFixtureId`
- `GET /api/pinned/matches`
- `DELETE /api/pinned/matches/:apiFixtureId`

Predictions:
- `GET /api/predictions/matches/:apiFixtureId/options`
- `POST /api/predictions/matches/:apiFixtureId/picks`
- `DELETE /api/predictions/picks/:predictionPickId`
- `GET /api/predictions/me`

Leaderboard:
- `GET /api/leaderboard`

Dream team:
- `GET /api/dream-team/formations`
- `GET /api/dream-team/me`
- `POST /api/dream-team`
- `PATCH /api/dream-team/:dreamTeamId`
- `DELETE /api/dream-team/:dreamTeamId`

Admin sync:
- `POST /api/admin/sync/fixtures?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/admin/sync/fixtures/date/:date`
- `POST /api/admin/sync/fixtures/:fixtureId`
- `POST /api/admin/sync/teams?league=&season=`
- `POST /api/admin/sync/players?teamApiId=&season=`
- `POST /api/admin/sync/players/:playerApiId?season=`
- `POST /api/admin/sync/standings?league=&season=`
- `POST /api/admin/sync/matches/:matchId/details`
- `POST /api/admin/sync/matches/details/date/:date`

Admin prediction:
- `POST /api/admin/predictions/sync-odds/:apiFixtureId`
- `POST /api/admin/predictions/award/:apiFixtureId`

Admin stream links:
- `GET /api/admin/stream-links/matches/:apiFixtureId`
- `POST /api/admin/stream-links/matches/:apiFixtureId`
- `DELETE /api/admin/stream-links/:streamLinkId`

Admin top match:
- `GET /api/admin/featured-fixtures`
- `POST /api/admin/featured-fixtures/:apiFixtureId`
- `PATCH /api/admin/featured-fixtures/:featuredFixtureId`
- `DELETE /api/admin/featured-fixtures/:featuredFixtureId`

## Main Database Tables

- users
- leagues
- league_standings
- teams
- fixtures
- fixture_sync_logs
- match_details
- players
- player_statistics
- favorite_teams
- pinned_matches
- featured_fixtures
- stream_links
- fixture_odds
- prediction_picks
- dream_teams

## Database Notes

The project uses:

```js
await sequelize.sync()
```

It does not use:

```js
sequelize.sync({ alter: true })
```

Reason:
- Automatic alter can duplicate MySQL indexes and unique keys.
- New tables can be created by `sync()`.
- Existing column changes should use manual SQL.

Manual decimal point update:

```sql
ALTER TABLE users MODIFY points DECIMAL(10,2) NOT NULL DEFAULT 0.00;
```

## Testing Checklist

Auth:
- Register user
- Login user
- Get profile with token
- Confirm admin routes reject normal users

Admin sync:
- Sync fixtures by date
- Sync standings by league and season
- Sync teams by league and season
- Sync players by team and season
- Sync specific player
- Sync match detail
- Sync odds

Public data:
- Load fixtures by date
- Load match detail
- Search saved data
- Load standings
- Load stream links
- Load top match

Logged-in user:
- Favorite team
- Pin match
- Save prediction pick
- Remove prediction pick before kickoff
- Save dream team

Admin finalization:
- Refresh finished match score
- Award prediction points
- Check leaderboard
