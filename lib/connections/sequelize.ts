// lib/connections/sequelize.ts
import pg from "pg"; // Use 'import pg from "pg";' not 'import * as pg from "pg";'
import { Sequelize } from "sequelize";

declare global {
  var sequelizeInstance: Sequelize | undefined;
}

let sequelize: Sequelize;

if (!global.sequelizeInstance) {
  global.sequelizeInstance = new Sequelize(process.env.DATABASE_POSTGRES_URL, {
    protocol: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // necesario en Neon, Supabase, Render, Railway
      },
    },
  });
}

sequelize = global.sequelizeInstance;

export { sequelize };
