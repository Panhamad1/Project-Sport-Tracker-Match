You are helping me continue coding my full-stack project called Football Score.

Read this file and the real project files before suggesting or editing anything. This project is a football score website where users can view saved football fixtures, scores, match status, match details, league standings, teams, players, predictions, leaderboard, pinned matches, favorite teams, stream links, and the current top match.

The project is database-first because API-FOOTBALL has free-plan request and season limits. Normal users read from MySQL through my backend. API-FOOTBALL is called only by admin sync features, never by normal public routes or frontend code.

==================================================
1. PROJECT NAME AND MAIN GOAL
==================================================

Project name:
Football Score

Main goal:
Build a football score website where users can:
- View fixtures by Cambodia date
- View score and match status such as NS, 1H, HT, FT, AET, PEN
- View match detail page with overview, H2H, prediction data, lineups, statistics, and streams
- View league standings
- Search teams, leagues, players, and matches
- Save favorite teams
- Pin important matches
- Submit match score predictions before kickoff
- See a leaderboard based on prediction points
- See the current top match selected by admin
- Open stream links added by admin when legal/official links are available

Main system rule:
- MySQL is the main source for frontend football data.
- Admin sync routes fetch API-FOOTBALL and save/update MySQL.
- Normal user routes read saved database data only.
- Frontend must never call API-FOOTBALL directly.
- Do not re-add public API fetching unless I specifically ask.

Important scope note:
- This project is Football Score, not a full live-streaming platform.
- It can show match status and score if admin syncs/refreshes fixtures.
- It does not aggressively poll API-FOOTBALL for real-time live updates because the API plan is limited.

==================================================
2. TECH STACK
==================================================

Frontend:
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Icons
- Frontend calls my backend API only

Backend:
- Node.js
- Express.js
- ES module syntax
- Sequelize ORM
- MySQL database
- JWT authentication
- bcrypt for password hashing
- axios for API calls

External API:
- API-FOOTBALL from API-SPORTS
- Base URL from env:
  API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
- API key from env:
  API_FOOTBALL_KEY=...
- Timezone:
  API_FOOTBALL_TIMEZONE=Asia/Phnom_Penh

Backend local server:
- Runs on http://localhost:4000
- Entry file:
  back/src/server.js
- Database connection:
  back/src/config/database.js
- Sequelize uses:
  await sequelize.sync()
- Do not use sequelize.sync({ alter: true }) because it caused duplicate indexes before.

==================================================
3. CURRENT SYSTEM WORKFLOW
==================================================

Normal users and guests:
- Request public football data from backend.
- Backend reads from MySQL only.
- Backend does not call API-FOOTBALL.
- Public responses use API fixture/team/league ids where possible and hide internal local database ids.
- If no data exists, backend returns empty arrays/null or 404 depending on route.

Logged-in users:
- Can favorite teams.
- Can pin/unpin matches.
- Can create/update/delete predictions before a match starts.
- Cannot change predictions after kickoff or after points are awarded.

Admin:
- Logs in like a normal user.
- Backend verifies JWT.
- Backend loads user from database.
- Backend checks req.user.role === "admin".
- Admin can sync data from API-FOOTBALL into MySQL.
- Admin can refresh an individual fixture score/status.
- Admin can sync match details for one match or all matches on a date.
- Admin can add/update/delete stream links.
- Admin can choose the global top match.
- Admin can award prediction points after a match is finished.

API limit rules:
- Normal routes do not call API-FOOTBALL.
- Admin controls every API-FOOTBALL sync.
- Player sync accepts seasons 2022 to 2024 because the API plan returned that limit.
- Fixture sync is date-window limited by the API plan.
- Teams/players/standings may use older seasons such as 2024 while fixtures may be current/newer.

Time rule:
- Backend date filtering and display helper fields use Cambodia time.
- Public fixture/match responses include:
  - match_date_utc
  - match_date_local
  - match_time_local
  - match_datetime_local
  - timezone
- local means Cambodia local time, not browser/user timezone.

==================================================
4. COMPLETED FEATURES
==================================================

Auth:
- Register route works.
- Login route works.
- /me route works.
- Password is stored as password_hash.
- JWT contains id, username, and email.
- Role is not trusted from frontend.
- protect middleware verifies token and loads user from database.
- req.user contains trusted role from database.
- adminOnly middleware checks req.user.role === "admin".

Fixtures:
- Public fixture date route reads database only.
- Admin fixture sync fetches API-FOOTBALL /fixtures.
- Admin can refresh one saved fixture by local fixture id.
- Fixture sync saves/updates leagues, teams, fixtures, and fixture_sync_logs.
- Fixture date filtering uses Cambodia date.
- Public fixture responses hide local fixture/team/league ids.
- Admin fixture helper route exposes local ids where admin tools need them.

Teams:
- Admin team sync fetches API-FOOTBALL /teams by league and season.
- Teams are saved/updated in teams table.

Players:
- Admin player sync fetches API-FOOTBALL /players by team and season.
- Player sync handles pagination up to the free-plan page limit.
- Players and player_statistics are saved/updated.
- Specific player sync is available by player API id.
- Player model uses weight, not weigth.

League standings:
- Admin standings sync fetches API-FOOTBALL /standings by league and season.
- Sync saves/updates leagues, teams, and league_standings.
- Public standings route reads database only.

Match detail:
- Public match detail route reads database only.
- Public match page uses API fixture id:
  /api/football/matches/:apiFixtureId
- Match detail includes overview, h2h, prediction, lineups, statistics, goal_scorers, and streams.
- Overview comes from fixtures/leagues/teams.
- H2H, API prediction, lineups, statistics, and goal events come from match_details.
- Stream links come from stream_links table, not API-FOOTBALL.
- Lineups are enriched with player photos from saved players when available.
- Goal scorers are extracted from saved API fixture events.

Search:
- Public search reads database only.
- Search supports type filters:
  all, teams, leagues, players, matches
- Match search returns public match ids and hides local ids.

Favorite teams:
- Logged-in users can add/get/remove favorite teams.
- Favorite team currently uses local team id.
- Duplicate favorite teams are prevented by unique index user_id + team_id.

Pinned matches:
- Logged-in users can pin/unpin matches by API fixture id.
- Backend stores local fixture_id internally.
- Duplicate pinned matches are prevented by unique index user_id + fixture_id.
- Guests cannot pin matches.

Stream links:
- Admin can add/update/delete stream links for a match.
- Admin route uses API fixture id to add/list by match.
- Public users only see active stream links.
- Match detail streams tab reads active stream links from database.

Top match:
- Admin can choose one global top match.
- Setting a new top match replaces the previous one.
- Public homepage can read the current top match without filtering by date.
- The featured_fixtures table stores the selected match and label.

Predictions:
- Logged-in users can predict home/away score before match starts.
- Prediction locks if status_short is not NS or current time is >= match_date.
- One prediction per user per match.
- Prediction can be updated before lock.
- Prediction cannot be changed after points are awarded.
- Admin awards points after match is finished.
- Simple current scoring:
  - Exact score = 3 points
  - Correct result = 1 point
  - Wrong result = 0 points
- Awarded points are added to users.points.

Leaderboard:
- Public leaderboard reads users ordered by points.
- Admin users are excluded from the leaderboard.

Admin panel/frontend integration:
- Admin panel UI exists.
- Admin panel can call backend sync routes and show immediate response/toast messages.
- Match Detail Helper can be extended to include buttons such as Refresh Score, Sync Details, Set as Top Match, and stream-link management.

==================================================
5. DATABASE TABLES
==================================================

users:
- id
- username
- email
- password_hash
- role
- language
- points
- created_at
- updated_at

leagues:
- id
- api_league_id
- name
- type
- logo
- country
- season
- raw_data
- last_updated
- created_at
- updated_at
- unique index on api_league_id + season

league_standings:
- id
- league_id
- team_id
- season
- rank
- points
- goals_diff
- group_name
- form
- status
- description
- played
- win
- draw
- lose
- goals_for
- goals_against
- raw_data
- last_updated
- created_at
- updated_at
- unique index on league_id + team_id + season

teams:
- id
- api_team_id
- name
- code
- country
- founded
- logo
- venue_name
- venue_city
- raw_data
- last_updated
- created_at
- updated_at
- api_team_id is unique

fixtures:
- id
- api_fixture_id
- league_id
- season
- home_team_id
- away_team_id
- match_date
- status_long
- status_short
- elapsed
- home_goals
- away_goals
- venue_name
- venue_city
- raw_data
- last_updated
- created_at
- updated_at
- api_fixture_id is unique

fixture_sync_logs:
- id
- sync_date
- status
- fixture_count
- error_message
- last_synced_at
- created_at
- updated_at
- sync_date is unique
- Stores latest fixture sync result per date.

match_details:
- id
- fixture_id
- h2h
- prediction
- lineups
- statistics
- streams
- raw_data
- last_synced_at
- created_at
- updated_at
- fixture_id is unique
- Note: public stream links are now served from stream_links table.

favorite_teams:
- id
- user_id
- team_id
- created_at
- updated_at
- unique index on user_id + team_id

pinned_matches:
- id
- user_id
- fixture_id
- created_at
- updated_at
- unique index on user_id + fixture_id

featured_fixtures:
- id
- fixture_id
- featured_date
- priority
- label
- selected_by
- created_at
- updated_at
- Current behavior: stores one global top match; setting a new one replaces old rows.

stream_links:
- id
- fixture_id
- title
- url
- source_name
- is_active
- added_by
- created_at
- updated_at

predictions:
- id
- user_id
- fixture_id
- predicted_home_goals
- predicted_away_goals
- points_awarded
- awarded_at
- created_at
- updated_at
- unique index on user_id + fixture_id

players:
- id
- api_player_id
- name
- firstname
- lastname
- age
- nationality
- height
- weight
- injured
- photo
- raw_data
- last_updated
- created_at
- updated_at

player_statistics:
- id
- player_id
- team_id
- league_id
- season
- position
- rating
- appearances
- lineups
- minutes
- goals
- assists
- yellow_cards
- red_cards
- raw_data
- last_updated
- created_at
- updated_at
- unique index on player_id + team_id + league_id + season

==================================================
6. MODEL RELATIONSHIPS
==================================================

Core football:
- League hasMany Fixture as fixtures
- Fixture belongsTo League as league
- Team hasMany Fixture as homeFixtures
- Fixture belongsTo Team as homeTeam
- Team hasMany Fixture as awayFixtures
- Fixture belongsTo Team as awayTeam

Standings:
- League hasMany LeagueStanding as standings
- LeagueStanding belongsTo League as league
- Team hasMany LeagueStanding as leagueStandings
- LeagueStanding belongsTo Team as team

Match detail:
- Fixture hasOne MatchDetail as detail
- MatchDetail belongsTo Fixture as fixture

Users:
- User hasMany FavoriteTeam as favoriteTeams
- FavoriteTeam belongsTo User as user
- Team hasMany FavoriteTeam as favoriteTeamRecords
- FavoriteTeam belongsTo Team as team

Pinned matches:
- User hasMany PinnedMatch as pinnedMatches
- PinnedMatch belongsTo User as user
- Fixture hasMany PinnedMatch as pinnedMatchRecords
- PinnedMatch belongsTo Fixture as fixture

Stream links:
- User hasMany StreamLink as addedStreamLinks
- StreamLink belongsTo User as admin
- Fixture hasMany StreamLink as streamLinks
- StreamLink belongsTo Fixture as fixture

Top match:
- User hasMany FeaturedFixture as selectedFeaturedFixtures
- FeaturedFixture belongsTo User as selector
- Fixture hasMany FeaturedFixture as featuredFixtureRecords
- FeaturedFixture belongsTo Fixture as fixture

Predictions:
- User hasMany Prediction as predictions
- Prediction belongsTo User as user
- Fixture hasMany Prediction as predictionRecords
- Prediction belongsTo Fixture as fixture

Players:
- Player hasMany PlayerStatistic as statistics
- PlayerStatistic belongsTo Player as player
- Team hasMany PlayerStatistic as playerStatistics
- PlayerStatistic belongsTo Team as team
- League hasMany PlayerStatistic as playerStatistics
- PlayerStatistic belongsTo League as league

==================================================
7. ROUTES
==================================================

Health:
- GET /

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Public fixtures:
- GET /api/football/fixtures/date/:date

Public match detail:
- GET /api/football/matches/:apiFixtureId
- GET /api/football/matches/:apiFixtureId/streams

Public leagues:
- GET /api/football/leagues/:leagueId/standings?season=YYYY

Public search:
- GET /api/football/search?search=word&type=all
- GET /api/football/search?search=word&type=teams
- GET /api/football/search?search=word&type=leagues
- GET /api/football/search?search=word&type=players
- GET /api/football/search?search=word&type=matches

Public top match:
- GET /api/football/featured-fixtures

Public leaderboard:
- GET /api/leaderboard
- GET /api/leaderboard?limit=20

Favorites, logged-in:
- POST /api/favorites/teams/:teamId
- GET /api/favorites/teams
- DELETE /api/favorites/teams/:teamId

Pinned matches, logged-in:
- POST /api/pinned/matches/:apiFixtureId
- GET /api/pinned/matches
- DELETE /api/pinned/matches/:apiFixtureId

Predictions, logged-in:
- POST /api/predictions/matches/:apiFixtureId
- GET /api/predictions/me
- GET /api/predictions/matches/:apiFixtureId/me
- DELETE /api/predictions/matches/:apiFixtureId

Admin sync:
- POST /api/admin/sync/fixtures?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/admin/sync/fixtures/date/:date
- POST /api/admin/sync/fixtures/:fixtureId
- POST /api/admin/sync/teams?league=39&season=2024
- POST /api/admin/sync/players?teamApiId=541&season=2024
- POST /api/admin/sync/players/:playerApiId?season=2024
- POST /api/admin/sync/standings?league=39&season=2024
- POST /api/admin/sync/matches/:matchId/details
- POST /api/admin/sync/matches/details/date/:date

Admin stream links:
- GET /api/admin/stream-links/matches/:apiFixtureId
- POST /api/admin/stream-links/matches/:apiFixtureId
- PATCH /api/admin/stream-links/:streamLinkId
- DELETE /api/admin/stream-links/:streamLinkId

Admin top match:
- GET /api/admin/featured-fixtures
- POST /api/admin/featured-fixtures/:apiFixtureId
- PATCH /api/admin/featured-fixtures/:featuredFixtureId
- DELETE /api/admin/featured-fixtures/:featuredFixtureId

Admin predictions:
- POST /api/admin/predictions/award/:apiFixtureId

==================================================
8. IMPORTANT REQUEST/RESPONSE RULES
==================================================

Login request body:
{
  "identifier": "email_or_username",
  "password": "password"
}

Prediction request body:
{
  "predicted_home_goals": 2,
  "predicted_away_goals": 1
}

Stream link request body:
{
  "title": "Official Stream",
  "url": "https://example.com/watch",
  "source_name": "FIFA",
  "is_active": true
}

Top match request body:
{
  "label": "Top Match"
}

Security:
- Do not accept user_id from frontend for user actions.
- Use req.user.id from protect middleware.
- Do not trust role from frontend.
- Admin-only routes must use protect then adminOnly.
- Public routes must not call API-FOOTBALL.
- Keep API_FOOTBALL_KEY only in backend env.

IDs:
- Public match routes use api_fixture_id.
- Public team/league/player search results use API ids.
- Favorite teams currently use local team id because the original favorite route was built that way.
- Admin fixture refresh uses local fixture id because admin helper can load local ids.

==================================================
9. USEFUL API IDS AND SYNC EXAMPLES
==================================================

Common league ids:
- 1 = World Cup
- 2 = Champions League
- 39 = Premier League
- 140 = LaLiga
- 307 = Saudi Pro League
- 253 = MLS

Common team ids:
- 541 = Real Madrid
- 529 = Barcelona
- 2939 = Al Nassr
- 9568 = Inter Miami

Fixture sync example:
- POST /api/admin/sync/fixtures?from=2026-07-10&to=2026-07-12

Standings examples:
- POST /api/admin/sync/standings?league=39&season=2024
- POST /api/admin/sync/standings?league=140&season=2024

Team sync examples:
- POST /api/admin/sync/teams?league=39&season=2024
- POST /api/admin/sync/teams?league=140&season=2024

Player sync examples:
- POST /api/admin/sync/players?teamApiId=541&season=2024
- POST /api/admin/sync/players?teamApiId=529&season=2024
- POST /api/admin/sync/players?teamApiId=2939&season=2024
- POST /api/admin/sync/players?teamApiId=9568&season=2024
- POST /api/admin/sync/players/:playerApiId?season=2024

Match detail examples:
- POST /api/admin/sync/matches/:matchId/details
- POST /api/admin/sync/matches/details/date/:date

Prediction award example:
- POST /api/admin/predictions/award/:apiFixtureId

==================================================
10. PROJECT FILE STRUCTURE NOTES
==================================================

Backend important files:
- back/src/server.js
- back/src/config/database.js
- back/src/models/index.js
- back/src/middlewares/authMiddleware.js
- back/src/middlewares/adminMiddleware.js
- back/src/providers/apiFootballProvider.js
- back/src/utils/cambodiaTime.js
- back/src/services/fixtureService.js

Cleaned up:
- Old unused back/src/utils/cache.js was removed.
- The old active fixture service name fixtureCacheService.js was renamed to fixtureService.js because the app no longer uses the public cache idea.

Frontend important files:
- front/src/routers/AppRouter.jsx
- front/src/components/NavigationBar.jsx
- front/src/components/SearchDropdown.jsx
- front/src/pages/MatchesPage.jsx
- front/src/pages/MatchDetailPage.jsx
- front/src/pages/AdminPanelPage.jsx
- front/src/components/admin/AdminMatchDetailHelper.jsx
- front/src/api/football/FootballApi.js
- front/src/api/admin/AdminSyncApi.js

==================================================
11. TESTING CHECKLIST
==================================================

Auth:
- Register user
- Login user
- GET /api/auth/me
- Verify admin routes reject no token and normal user token

Admin data:
- Sync fixtures
- Refresh one fixture
- Sync standings
- Sync teams
- Sync players
- Sync match details
- Sync all match details by date

Public data:
- Fixtures by date
- Match detail by API fixture id
- Search all/teams/leagues/players/matches
- Standings by league and season
- Top match
- Leaderboard

Logged-in user:
- Favorite team add/get/delete
- Pinned match add/get/delete
- Prediction create/update/get/delete before kickoff
- Prediction lock after kickoff

Admin content:
- Add stream link
- Public stream route only returns active links
- Set top match
- Award prediction points after match is FT/AET/PEN

==================================================
12. CODING STYLE AND PROJECT RULES
==================================================

Use:
- ES module import/export
- async/await
- Express router/controller/service structure
- Sequelize models from back/src/models/index.js
- snake_case DB columns because underscored: true is used
- Small, readable code
- Database-first public routes
- API fixture id for public match URLs

Avoid:
- Do not over-engineer.
- Do not create repository layer unless needed.
- Do not change many unrelated files at once.
- Do not rename database columns without warning me.
- Do not use sequelize.sync({ alter: true }).
- Do not expose API_FOOTBALL_KEY to frontend.
- Do not make frontend call API-FOOTBALL directly.
- Do not trust user_id or role from frontend body.
- Do not bring back x-sync-secret unless I specifically ask.
- Do not commit, push, merge, or deploy unless I explicitly ask.
- Do not commit/push AGENTS.md unless I explicitly ask.

Git:
- Current integration branch name is backend-frontend-integration.
- Backend branch is backend.
- Friend frontend branches include origin/Front, origin/frontend/home-page, origin/frontend/login-page.
- If switching or merging branches, check git status first.
- Do not overwrite uncommitted user work.

==================================================
13. CURRENT PRACTICAL NEXT WORK
==================================================

Backend is complete for the current project scope.

Current practical work is frontend integration:
- Connect stream-link admin controls in the Streams tab.
- Add pin buttons to match cards/detail for logged-in users.
- Add prediction UI in match detail before kickoff.
- Add leaderboard page or profile section.
- Add top match display on homepage after the homepage design is stable.
- Add league standings page from search league result.

Before pushing:
- Run backend syntax checks for changed files.
- Run frontend lint/build if frontend files changed.
- Check git status.
- Do not include AGENTS.md in commits unless I explicitly approve.
