import mysql from 'mysql2/promise';
import { bookDao } from "./DAO/bookDao.js";
import { Mysql } from "./mysql.js"; // Import Mysql class
import { CustomerDao } from './DAO/customerDao.js';
import { UserDao } from './DAO/userDao.js';
import { adminDao } from './DAO/adminDao.js';

export interface DataStore extends bookDao , CustomerDao, UserDao, adminDao {

  
}




export let db: DataStore;
export let pool: mysql.Pool;

export async function initDb() {
  
  if (process.env.DATABASE_URL) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  } else {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  try {
    const connection = await pool.getConnection(); 
    console.log('Connected to MySQL');
    connection.release();
    db = new Mysql(); // Initialize db
  } catch (err) {
    console.error('Failed to connect to MySQL', err);
    throw err;
  }
}