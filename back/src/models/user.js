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
        role:{
            type: DataTypes.ENUM("user","admin"),
            allowNull: false,
            defaultValue: "user",
        },
        language:{
            type: DataTypes.STRING(20),
            allowNull:false,
            defaultValue:"en",
        },
        points:{
            type: DataTypes.DECIMAL(10, 2),
            allowNull:false,
            defaultValue:0.00,
        },
    },
    {
        tableName: "users",
        underscored:true,
    }
);
export default User;
