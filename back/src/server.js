import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import fixtureRoutes from "./routes/fixtureRoutes.js";
import favoriteTeamRoutes from "./routes/favoriteTeamRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import adminSyncRoutes from "./routes/adminSyncRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";
import pinnedMatchRoutes from "./routes/pinnedMatchRoutes.js";
import adminStreamLinkRoutes from "./routes/adminStreamLinkRoutes.js";
import featuredFixtureRoutes from "./routes/featuredFixtureRoutes.js";
import adminFeaturedFixtureRoutes from "./routes/adminFeaturedFixtureRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import adminPredictionRoutes from "./routes/adminPredictionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import dreamTeamRoutes from "./routes/dreamTeamRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
//routes 
app.get('/',(req,res) =>{
    res.json({
        message: "API is running"
    });
});
app.use("/api/auth",authRoutes);
app.use("/api/football/fixtures",fixtureRoutes);
app.use("/api/football/matches",matchRoutes);
app.use("/api/football/leagues",leagueRoutes);
app.use("/api/football/featured-fixtures", featuredFixtureRoutes);
app.use("/api/favorites/teams", favoriteTeamRoutes);
app.use("/api/pinned/matches", pinnedMatchRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/dream-team", dreamTeamRoutes);
app.use("/api/football/search",searchRoutes);
app.use("/api/admin/sync",adminSyncRoutes);
app.use("/api/admin/stream-links", adminStreamLinkRoutes);
app.use("/api/admin/featured-fixtures", adminFeaturedFixtureRoutes);
app.use("/api/admin/predictions", adminPredictionRoutes);


// start server
try{
    await sequelize.authenticate();
    console.log("Database Connect Success");
    await sequelize.sync();
    console.log("Database Sync Success");
    app.listen(PORT, ()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    })

}catch(err){
    console.error("Server fail: ",err);
}
