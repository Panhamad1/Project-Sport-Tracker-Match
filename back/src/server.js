import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
//routes 
app.get('/',(req,res) =>{
    res.json({
        message: "API is running"
    });
});
app.use("/api/auth",authRoutes);

// start server
try{
    await sequelize.authenticate();
    console.log("Database Connect Success");
    await sequelize.sync({alter:true});
    console.log("Database Sync Success");
    app.listen(PORT, ()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    })

}catch(err){
    console.error("Server fail: ",err);
}