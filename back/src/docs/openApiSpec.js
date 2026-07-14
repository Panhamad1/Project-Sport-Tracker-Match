const jsonContent = {
    "application/json": {
        schema: {
            type: "object",
        },
    },
};

const ok = (description = "Successful response") => ({
    description,
    content: jsonContent,
});

const created = (description = "Created successfully") => ({
    description,
    content: jsonContent,
});

const empty = (description = "No content") => ({
    description,
});

const badRequest = {
    description: "Bad request",
    content: jsonContent,
};

const unauthorized = {
    description: "Authentication token is missing or invalid",
    content: jsonContent,
};

const forbidden = {
    description: "Admin permission required",
    content: jsonContent,
};

const notFound = {
    description: "Resource not found",
    content: jsonContent,
};

const serverError = {
    description: "Server error",
    content: jsonContent,
};

const authResponses = {
    401: unauthorized,
    500: serverError,
};

const adminResponses = {
    401: unauthorized,
    403: forbidden,
    500: serverError,
};

const bearerSecurity = [
    {
        bearerAuth: [],
    },
];

const pathParam = (name, description, schema = { type: "integer" }) => ({
    name,
    in: "path",
    required: true,
    description,
    schema,
});

const queryParam = (name, description, schema = { type: "string" }, required = false) => ({
    name,
    in: "query",
    required,
    description,
    schema,
});

const requestBody = (schema, required = true) => ({
    required,
    content: {
        "application/json": {
            schema,
        },
    },
});

const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Football Score API",
        version: "1.0.0",
        description: "REST API documentation for the Football Score full-stack project. Public routes read saved database data, while admin routes sync data from external providers.",
    },
    servers: [
        {
            url: "/",
            description: "Current backend server",
        },
    ],
    tags: [
        { name: "System" },
        { name: "Auth" },
        { name: "Fixtures" },
        { name: "Matches" },
        { name: "Leagues" },
        { name: "Teams" },
        { name: "Players" },
        { name: "Search" },
        { name: "Favorites" },
        { name: "Pinned Matches" },
        { name: "Predictions" },
        { name: "Leaderboard" },
        { name: "Dream Team" },
        { name: "Notifications" },
        { name: "News" },
        { name: "Admin Sync" },
        { name: "Admin Streams" },
        { name: "Admin Featured Match" },
        { name: "Admin Predictions" },
    ],
    paths: {
        "/": {
            get: {
                tags: ["System"],
                summary: "API health check",
                responses: {
                    200: ok("API is running"),
                },
            },
        },
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: requestBody({
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: { type: "string", example: "panha" },
                        email: { type: "string", format: "email", example: "panha@example.com" },
                        password: { type: "string", format: "password", example: "password123" },
                    },
                }),
                responses: {
                    201: created("User registered successfully"),
                    400: badRequest,
                    500: serverError,
                },
            },
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login with email or username",
                requestBody: requestBody({
                    type: "object",
                    required: ["identifier", "password"],
                    properties: {
                        identifier: { type: "string", example: "panha@example.com" },
                        password: { type: "string", format: "password", example: "password123" },
                    },
                }),
                responses: {
                    200: ok("Login successful"),
                    400: badRequest,
                    401: unauthorized,
                    500: serverError,
                },
            },
        },
        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authenticated user",
                security: bearerSecurity,
                responses: {
                    200: ok("Current user loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/football/fixtures/feed": {
            get: {
                tags: ["Fixtures"],
                summary: "Get fixture feed from database",
                parameters: [
                    queryParam("from", "Start date in YYYY-MM-DD", { type: "string", format: "date" }),
                    queryParam("to", "End date in YYYY-MM-DD", { type: "string", format: "date" }),
                    queryParam("limit", "Maximum fixtures to return", { type: "integer", example: 40 }),
                ],
                responses: {
                    200: ok("Fixture feed loaded"),
                    500: serverError,
                },
            },
        },
        "/api/football/fixtures/date/{date}": {
            get: {
                tags: ["Fixtures"],
                summary: "Get fixtures by Cambodia date",
                parameters: [
                    pathParam("date", "Fixture date in YYYY-MM-DD", { type: "string", format: "date" }),
                ],
                responses: {
                    200: ok("Fixtures loaded from database"),
                    400: badRequest,
                    500: serverError,
                },
            },
        },
        "/api/football/matches/{matchId}": {
            get: {
                tags: ["Matches"],
                summary: "Get match detail by API fixture id",
                parameters: [
                    pathParam("matchId", "API fixture id"),
                ],
                responses: {
                    200: ok("Match detail loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/football/matches/{matchId}/streams": {
            get: {
                tags: ["Matches"],
                summary: "Get active public stream links for a match",
                parameters: [
                    pathParam("matchId", "API fixture id"),
                ],
                responses: {
                    200: ok("Stream links loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/football/leagues/{leagueId}/standings": {
            get: {
                tags: ["Leagues"],
                summary: "Get league standings from database",
                parameters: [
                    pathParam("leagueId", "API league id"),
                    queryParam("season", "Season year", { type: "integer", example: 2024 }),
                ],
                responses: {
                    200: ok("League standings loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/football/teams/{teamId}": {
            get: {
                tags: ["Teams"],
                summary: "Get team profile by API team id",
                parameters: [
                    pathParam("teamId", "API team id"),
                    queryParam("season", "Player statistics season", { type: "integer", example: 2024 }),
                ],
                responses: {
                    200: ok("Team loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/football/players/{playerId}": {
            get: {
                tags: ["Players"],
                summary: "Get player profile by API player id",
                parameters: [
                    pathParam("playerId", "API player id"),
                    queryParam("season", "Statistics season", { type: "integer", example: 2024 }),
                ],
                responses: {
                    200: ok("Player loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/football/search": {
            get: {
                tags: ["Search"],
                summary: "Search teams, leagues, players, and matches from database",
                parameters: [
                    queryParam("search", "Search keyword", { type: "string", example: "madrid" }, true),
                    queryParam("type", "Search type", { type: "string", enum: ["all", "teams", "leagues", "players", "matches"], example: "all" }),
                    queryParam("position", "Player position filter", { type: "string", example: "GK" }),
                ],
                responses: {
                    200: ok("Search results loaded"),
                    400: badRequest,
                    500: serverError,
                },
            },
        },
        "/api/football/featured-fixtures": {
            get: {
                tags: ["Matches"],
                summary: "Get global top match selected by admin",
                responses: {
                    200: ok("Top match loaded"),
                    500: serverError,
                },
            },
        },
        "/api/favorites/teams": {
            get: {
                tags: ["Favorites"],
                summary: "Get current user's favorite teams",
                security: bearerSecurity,
                responses: {
                    200: ok("Favorite teams loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/favorites/teams/{teamId}": {
            post: {
                tags: ["Favorites"],
                summary: "Add favorite team by local team id",
                security: bearerSecurity,
                parameters: [
                    pathParam("teamId", "Local team id"),
                ],
                responses: {
                    201: created("Favorite team added"),
                    400: badRequest,
                    404: notFound,
                    ...authResponses,
                },
            },
            delete: {
                tags: ["Favorites"],
                summary: "Remove favorite team by local team id",
                security: bearerSecurity,
                parameters: [
                    pathParam("teamId", "Local team id"),
                ],
                responses: {
                    200: ok("Favorite team removed"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/pinned/matches": {
            get: {
                tags: ["Pinned Matches"],
                summary: "Get current user's pinned matches",
                security: bearerSecurity,
                responses: {
                    200: ok("Pinned matches loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/pinned/matches/{apiFixtureId}": {
            post: {
                tags: ["Pinned Matches"],
                summary: "Pin a saved match by API fixture id",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    201: created("Match pinned"),
                    400: badRequest,
                    404: notFound,
                    ...authResponses,
                },
            },
            delete: {
                tags: ["Pinned Matches"],
                summary: "Remove pinned match by API fixture id",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Pinned match removed"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/predictions/me": {
            get: {
                tags: ["Predictions"],
                summary: "Get current user's prediction history",
                security: bearerSecurity,
                responses: {
                    200: ok("Predictions loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/predictions/matches/{apiFixtureId}/options": {
            get: {
                tags: ["Predictions"],
                summary: "Get prediction odds/options for a match",
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Prediction options loaded"),
                    404: notFound,
                    500: serverError,
                },
            },
        },
        "/api/predictions/matches/{apiFixtureId}/me": {
            get: {
                tags: ["Predictions"],
                summary: "Get current user's prediction for one match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Prediction loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/predictions/matches/{apiFixtureId}/picks": {
            post: {
                tags: ["Predictions"],
                summary: "Save or replace a prediction pick before kickoff",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    required: ["fixture_odd_id"],
                    properties: {
                        fixture_odd_id: { type: "integer", example: 1 },
                    },
                }),
                responses: {
                    200: ok("Prediction pick saved"),
                    400: badRequest,
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/predictions/matches/{apiFixtureId}": {
            post: {
                tags: ["Predictions"],
                summary: "Save prediction pick for a match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    required: ["fixture_odd_id"],
                    properties: {
                        fixture_odd_id: { type: "integer", example: 1 },
                    },
                }),
                responses: {
                    200: ok("Prediction saved"),
                    400: badRequest,
                    404: notFound,
                    ...authResponses,
                },
            },
            delete: {
                tags: ["Predictions"],
                summary: "Delete current user's prediction for a match before kickoff",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Prediction deleted"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/predictions/picks/{predictionPickId}": {
            delete: {
                tags: ["Predictions"],
                summary: "Delete one prediction pick before kickoff",
                security: bearerSecurity,
                parameters: [
                    pathParam("predictionPickId", "Prediction pick id"),
                ],
                responses: {
                    200: ok("Prediction pick deleted"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/leaderboard": {
            get: {
                tags: ["Leaderboard"],
                summary: "Get public prediction leaderboard",
                parameters: [
                    queryParam("limit", "Maximum users", { type: "integer", example: 50 }),
                ],
                responses: {
                    200: ok("Leaderboard loaded"),
                    500: serverError,
                },
            },
        },
        "/api/dream-team/formations": {
            get: {
                tags: ["Dream Team"],
                summary: "Get available dream team formations",
                responses: {
                    200: ok("Formations loaded"),
                    500: serverError,
                },
            },
        },
        "/api/dream-team/me": {
            get: {
                tags: ["Dream Team"],
                summary: "Get current user's dream teams",
                security: bearerSecurity,
                responses: {
                    200: ok("Dream teams loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/dream-team": {
            post: {
                tags: ["Dream Team"],
                summary: "Create a dream team",
                security: bearerSecurity,
                requestBody: requestBody({
                    type: "object",
                    required: ["name", "formation", "players"],
                    properties: {
                        name: { type: "string", example: "My XI" },
                        formation: { type: "string", example: "4-3-3" },
                        players: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    slot: { type: "string", example: "GK" },
                                    api_player_id: { type: "integer", example: 154 },
                                },
                            },
                        },
                    },
                }),
                responses: {
                    201: created("Dream team created"),
                    400: badRequest,
                    ...authResponses,
                },
            },
        },
        "/api/dream-team/{dreamTeamId}": {
            patch: {
                tags: ["Dream Team"],
                summary: "Update a dream team",
                security: bearerSecurity,
                parameters: [
                    pathParam("dreamTeamId", "Dream team id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    properties: {
                        name: { type: "string", example: "Updated XI" },
                        formation: { type: "string", example: "4-4-2" },
                        players: { type: "array", items: { type: "object" } },
                    },
                }, false),
                responses: {
                    200: ok("Dream team updated"),
                    400: badRequest,
                    404: notFound,
                    ...authResponses,
                },
            },
            delete: {
                tags: ["Dream Team"],
                summary: "Delete a dream team",
                security: bearerSecurity,
                parameters: [
                    pathParam("dreamTeamId", "Dream team id"),
                ],
                responses: {
                    200: ok("Dream team deleted"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/notifications": {
            get: {
                tags: ["Notifications"],
                summary: "Get current user's notifications",
                security: bearerSecurity,
                responses: {
                    200: ok("Notifications loaded"),
                    ...authResponses,
                },
            },
        },
        "/api/notifications/read-all": {
            patch: {
                tags: ["Notifications"],
                summary: "Mark all notifications as read",
                security: bearerSecurity,
                responses: {
                    200: ok("Notifications marked as read"),
                    ...authResponses,
                },
            },
        },
        "/api/notifications/{notificationId}/read": {
            patch: {
                tags: ["Notifications"],
                summary: "Mark one notification as read",
                security: bearerSecurity,
                parameters: [
                    pathParam("notificationId", "Notification id"),
                ],
                responses: {
                    200: ok("Notification marked as read"),
                    404: notFound,
                    ...authResponses,
                },
            },
        },
        "/api/news": {
            get: {
                tags: ["News"],
                summary: "Get saved football news articles",
                parameters: [
                    queryParam("search", "Search saved news", { type: "string", example: "football" }),
                    queryParam("limit", "Maximum articles", { type: "integer", example: 12 }),
                ],
                responses: {
                    200: ok("News articles loaded"),
                    500: serverError,
                },
            },
        },
        "/api/admin/sync/fixtures": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync fixtures by date range",
                security: bearerSecurity,
                parameters: [
                    queryParam("from", "Start date in YYYY-MM-DD", { type: "string", format: "date" }, true),
                    queryParam("to", "End date in YYYY-MM-DD", { type: "string", format: "date" }, true),
                ],
                responses: {
                    200: ok("Fixtures synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/fixtures/date/{date}": {
            get: {
                tags: ["Admin Sync"],
                summary: "Load saved fixtures for admin helper",
                security: bearerSecurity,
                parameters: [
                    pathParam("date", "Fixture date in YYYY-MM-DD", { type: "string", format: "date" }),
                ],
                responses: {
                    200: ok("Admin fixtures loaded"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/fixtures/{fixtureId}": {
            post: {
                tags: ["Admin Sync"],
                summary: "Refresh one saved fixture score/status",
                security: bearerSecurity,
                parameters: [
                    pathParam("fixtureId", "Local fixture id"),
                ],
                responses: {
                    200: ok("Fixture refreshed"),
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/teams": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync teams by league for supported seasons",
                security: bearerSecurity,
                parameters: [
                    queryParam("league", "API league id", { type: "integer", example: 39 }, true),
                ],
                responses: {
                    200: ok("Teams synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/players": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync players by team and season",
                security: bearerSecurity,
                parameters: [
                    queryParam("teamApiId", "API team id", { type: "integer", example: 541 }, true),
                    queryParam("season", "Season year", { type: "integer", example: 2024 }, true),
                ],
                responses: {
                    200: ok("Players synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/players/{playerApiId}": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync one player by API player id and season",
                security: bearerSecurity,
                parameters: [
                    pathParam("playerApiId", "API player id"),
                    queryParam("season", "Season year", { type: "integer", example: 2024 }, true),
                ],
                responses: {
                    200: ok("Player synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/standings": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync league header and standings",
                security: bearerSecurity,
                parameters: [
                    queryParam("league", "API league id", { type: "integer", example: 39 }, true),
                ],
                responses: {
                    200: ok("Standings synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/news": {
            post: {
                tags: ["Admin Sync", "News"],
                summary: "Sync latest English football news from GNews",
                security: bearerSecurity,
                responses: {
                    200: ok("News synced"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/matches/details/date/{date}": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync match details for all saved fixtures on a date",
                security: bearerSecurity,
                parameters: [
                    pathParam("date", "Fixture date in YYYY-MM-DD", { type: "string", format: "date" }),
                ],
                responses: {
                    200: ok("Match details synced by date"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/sync/matches/{matchId}/details": {
            post: {
                tags: ["Admin Sync"],
                summary: "Sync match details for one local fixture id",
                security: bearerSecurity,
                parameters: [
                    pathParam("matchId", "Local fixture id"),
                ],
                responses: {
                    200: ok("Match details synced"),
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/predictions/sync-odds/{apiFixtureId}": {
            post: {
                tags: ["Admin Predictions"],
                summary: "Sync prediction odds for one match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Prediction odds synced"),
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/predictions/award/{apiFixtureId}": {
            post: {
                tags: ["Admin Predictions"],
                summary: "Award prediction points for a finished match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Prediction points awarded"),
                    400: badRequest,
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/stream-links/matches/{apiFixtureId}": {
            get: {
                tags: ["Admin Streams"],
                summary: "Get all stream links for admin",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                responses: {
                    200: ok("Admin stream links loaded"),
                    ...adminResponses,
                },
            },
            post: {
                tags: ["Admin Streams"],
                summary: "Add a stream link to a match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    required: ["title", "url"],
                    properties: {
                        title: { type: "string", example: "Official stream" },
                        url: { type: "string", example: "https://example.com/watch" },
                        source_name: { type: "string", example: "TV Channel" },
                    },
                }),
                responses: {
                    201: created("Stream link added"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/stream-links/{streamLinkId}": {
            patch: {
                tags: ["Admin Streams"],
                summary: "Update a stream link",
                security: bearerSecurity,
                parameters: [
                    pathParam("streamLinkId", "Stream link id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        source_name: { type: "string" },
                    },
                }, false),
                responses: {
                    200: ok("Stream link updated"),
                    404: notFound,
                    ...adminResponses,
                },
            },
            delete: {
                tags: ["Admin Streams"],
                summary: "Delete a stream link",
                security: bearerSecurity,
                parameters: [
                    pathParam("streamLinkId", "Stream link id"),
                ],
                responses: {
                    200: ok("Stream link deleted"),
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/featured-fixtures": {
            get: {
                tags: ["Admin Featured Match"],
                summary: "Get current admin top match",
                security: bearerSecurity,
                responses: {
                    200: ok("Admin top match loaded"),
                    ...adminResponses,
                },
            },
        },
        "/api/admin/featured-fixtures/{apiFixtureId}": {
            post: {
                tags: ["Admin Featured Match"],
                summary: "Set global top match",
                security: bearerSecurity,
                parameters: [
                    pathParam("apiFixtureId", "API fixture id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    properties: {
                        featured_date: { type: "string", format: "date", example: "2026-07-14" },
                        priority: { type: "integer", example: 1 },
                        label: { type: "string", example: "Top Match" },
                    },
                }, false),
                responses: {
                    201: created("Top match selected"),
                    400: badRequest,
                    ...adminResponses,
                },
            },
        },
        "/api/admin/featured-fixtures/{featuredFixtureId}": {
            patch: {
                tags: ["Admin Featured Match"],
                summary: "Update featured match metadata",
                security: bearerSecurity,
                parameters: [
                    pathParam("featuredFixtureId", "Featured fixture id"),
                ],
                requestBody: requestBody({
                    type: "object",
                    properties: {
                        featured_date: { type: "string", format: "date" },
                        priority: { type: "integer" },
                        label: { type: "string" },
                    },
                }, false),
                responses: {
                    200: ok("Featured match updated"),
                    404: notFound,
                    ...adminResponses,
                },
            },
            delete: {
                tags: ["Admin Featured Match"],
                summary: "Remove featured match",
                security: bearerSecurity,
                parameters: [
                    pathParam("featuredFixtureId", "Featured fixture id"),
                ],
                responses: {
                    200: ok("Featured match deleted"),
                    404: notFound,
                    ...adminResponses,
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    error: { type: "string" },
                },
            },
            User: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    username: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["user", "admin"] },
                    points: { type: "number" },
                },
            },
            Fixture: {
                type: "object",
                properties: {
                    api_fixture_id: { type: "integer" },
                    match_date: { type: "string", format: "date-time" },
                    status_short: { type: "string" },
                    home_goals: { type: "integer", nullable: true },
                    away_goals: { type: "integer", nullable: true },
                },
            },
            NewsArticle: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    url: { type: "string" },
                    image: { type: "string", nullable: true },
                    source_name: { type: "string", nullable: true },
                    published_at: { type: "string", format: "date-time", nullable: true },
                },
            },
        },
    },
};

export default openApiSpec;
