import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Op} from "sequelize";
import { sequelize, User } from "../models/index.js";

const generateToken = (user) => {
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is Missing");
    }
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email:user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
}
export async function register(req,res){
    let transaction;
    try{
        if(!process.env.JWT_SECRET){
            console.log("JWT_SECRET is missing in .env");
            return res.status(500).json({message: "Unavailable To Register For Now"});
        }
        const { username, email, password } = req.body;
        if (!username || !email || !password){
            return res.status(400).json({
                message: "Username, email, and password are required",
            });
        }
        if(password.length < 6){
            return res.status(400).json({
                message: "Password length must be at least 6 letter",
            });
        }
        // rk merl tha email/username ng mean nv
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, {email}],
            },
        });
        if(existingUser){
            return res.status(400).json({
                message: "username or email already exist",
            });
        }
        //encrypt passwordd bos yg
        const password_hash = await bcrypt.hash(password,10);
        transaction = await sequelize.transaction();
        const user = await User.create({
            username,
            email,
            password_hash,
            role: "user",
        });
        const token = generateToken(user);
        await transaction.commit();
        return res.status(201).json({
            message: "Success Register",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                language: user.language,
                points: user.points,
            },
        });
    } catch(err){
        return res.status(500).json({
            message: "Register Fail",
            error: err.message,
        });
    }
}
export async function login(req,res){
    try{
        if (!process.env.JWT_SECRET) {
            console.log("JWT_SECRET is missing in .env");
            return res.status(500).json({
                message: "Login service unavailable for now",
            });
        }
        const { identifier, password } = req.body;
        if(!identifier || !password){
            return res.status(400).json({
                message: "email/username and password are required",
            });
        }
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: identifier}, {username: identifier}],
            }
        });
        if(!user){
            return res.status(400).json({
                message: "Invalid username/email or password",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password_hash);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid email/username or password",
            });
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: "Login Successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                language: user.language,
                points: user.points,
            },
        });
    }catch(err){
        return res.status(500).json({
            message: "fail to login",
            error: err.message,
        })
    }
}
export async function getMe(req, res) {
  try {
    return res.json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get user profile",
      error: error.message,
    });
  }
}