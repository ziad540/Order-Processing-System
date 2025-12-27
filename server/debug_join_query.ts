
import { pool } from "./src/dataStore/index.js";
import dotenv from "dotenv";

dotenv.config();

async function debugJoin() {
    try {
        console.log("Connecting...");
        const mysql = await import("mysql2/promise");
        const connPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'Bookstore',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        // 1. Get a cart ID that has items
        const [carts] = await connPool.query("SELECT DISTINCT CartID FROM CartItems LIMIT 1");
        if ((carts as any[]).length === 0) {
            console.log("No carts found.");
            return;
        }
        const cartId = (carts as any[])[0].CartID;
        console.log("Using CartID:", cartId);

        // 2. Run the exact query from getallCartItems
        const query = `
      SELECT ci.Quantity, b.ISBN, b.Title as title, b.SellingPrice as sellingPrice, b.Category as category,
             p.Name as PublisherName,
             GROUP_CONCAT(a.AuthorName SEPARATOR ', ') as authors
      FROM CartItems ci
      JOIN Books b ON ci.ISBN = b.ISBN
      LEFT JOIN Authors a ON b.ISBN = a.BookISBN
      LEFT JOIN Publishers p ON b.PubID = p.PubID
      WHERE ci.CartID = ?
      GROUP BY ci.Quantity, b.ISBN, b.Title, b.SellingPrice, b.Category, p.Name
    `;

        const [rows] = await connPool.query(query, [cartId]);

        if ((rows as any[]).length > 0) {
            console.log("JOIN Result Keys:", Object.keys((rows as any[])[0]));
            console.log("JOIN Result Sample:", (rows as any[])[0]);
        } else {
            console.log("Query returned no rows for this cart.");
        }

        await connPool.end();
    } catch (e) {
        console.error(e);
    }
}

debugJoin();
