import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export async function protect(req,res,next){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "Please Login First",
            });
        } 
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
            attributes:{
                exclude: ["password_hash"],
            },
        });
        if(!user){
            return res.status(401).json({
                message: "Unauthorized. user not found",
            });
        }
        req.user = user;
        next();
    } catch(error){
        return res.status(401).json({
              message: "Unauthorized. Invalid or expired token",
              error: error.message,
        });
    }
}