import pg from "pg";
const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

export default pool;