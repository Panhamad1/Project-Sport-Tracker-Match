import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique:true,
            validate:{
                isEmail: true,
            },
        },
        password_hash:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        language:{
            type: DataTypes.STRING(20),
            allowNull:false,
            defaultValue:"en",
        },
        points:{
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0,
        },
    },
    {
        tableName: "users",
        underscored:true,
    }
);
export default User;