import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class Mysql implements DataStore {

    async getBookById(id: number): Promise<Book | null> {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM books WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return rows[0] as Book;
    }

    async createNEWBook(book: Book): Promise<Book> {
        const { ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel } = book;

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO books (ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ISBN, title, JSON.stringify(authors), publicationYear, sellingPrice, category, stockLevel]
        );
        
        return book;
    }
}