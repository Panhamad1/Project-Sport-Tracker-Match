import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Tell dotenv to look one folder up ('../') for the .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:process.env.DB_DIALECT,
        logging:false
    }
);
export default sequelize;