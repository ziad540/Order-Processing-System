import pg from 'pg';
import { bookDao } from "./DAO/bookDao.js";

const { Pool } = pg;

export interface DataStore extends bookDao {
  
}

export let db: DataStore;
export let pool: pg.Pool;

export async function initDb() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
  });

  try {
    await pool.connect();
    console.log('Connected to Postgres');
  } catch (err) {
    console.error('Failed to connect to Postgres', err);
    throw err;
  }
}