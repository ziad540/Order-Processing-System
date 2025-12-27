
import { pool } from "./src/dataStore/index.js";
import dotenv from "dotenv";

dotenv.config();

async function inspect() {
    try {
        console.log("Connecting...");
        // Assuming environment variables are set or defaults in index.js work
        // We might need to initialize the pool if index.js doesn't auto-init on import
        // But index.js exports 'pool' and 'initDb'.

        // We will manually init for safety if needed, matching index.js logic
        // But importing 'db' from index.js runs initDb? No, initDb is a function.
        // Let's implement a mini connection here to be sure.

        const mysql = await import("mysql2/promise");
        const connPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password', // adjust as needed or rely on env
            database: process.env.DB_NAME || 'Bookstore',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        console.log("Querying CartItems...");
        const [rows] = await connPool.query("SELECT * FROM CartItems LIMIT 1");

        if ((rows as any[]).length > 0) {
            console.log("Row Keys:", Object.keys((rows as any[])[0]));
            console.log("Row Sample:", (rows as any[])[0]);
        } else {
            console.log("CartItems table is empty.");
        }

        await connPool.end();
    } catch (e) {
        console.error(e);
    }
}

inspect();
