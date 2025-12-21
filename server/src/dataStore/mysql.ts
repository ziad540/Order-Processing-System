import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class Mysql implements DataStore {
  async listAllBooks({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<{ books: Book[]; total: number }> {
    console.log(
      `[Mysql] listAllBooks called with limit: ${limit}, offset: ${offset}`
    );
    return new Promise(async (resolve, reject) => {
      try {
        const [rowsResult, countResult] = await Promise.all([
          pool.query<RowDataPacket[]>(
            "SELECT id, title, authors, sellingPrice, category, stockLevel, publicationYear, ISBN FROM books LIMIT ? OFFSET ?",
            [limit, offset]
          ),
          pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM books"),
        ]);

        const rows = rowsResult[0] as Book[];
        const total = (countResult[0] as RowDataPacket[])[0].total;

        console.log(
          `[Mysql] listAllBooks retrieved ${rows.length} books. Total count: ${total}`
        );
        resolve({ books: rows, total });
      } catch (error) {
        console.error("[Mysql] Error in listAllBooks:", error);
        reject(error);
      }
    });
  }

  async getBookById(id: number): Promise<Book | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0] as Book;
  }

  async createNEWBook(book: Book): Promise<Book> {
    const {
      ISBN,
      title,
      authors,
      publicationYear,
      sellingPrice,
      category,
      stockLevel,
    } = book;

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO books (ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        ISBN,
        title,
        JSON.stringify(authors),
        publicationYear,
        sellingPrice,
        category,
        stockLevel,
      ]
    );

    return book;
  }
}
