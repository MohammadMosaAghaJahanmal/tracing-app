import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  logging: false,
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
  }
});
