import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class Mysql implements DataStore {
  async updateBookByISBN(ISBN: string): Promise<Book | null> {
    const [rows]=await pool.execute<RowDataPacket[]>(
      "SELECT * FROM books WHERE ISBN = ?",
      [ISBN]
    );
    if (rows.length === 0) return null;
    return rows[0] as Book;
    
  }
  async getBookByISBN(ISBN: string): Promise<Book | null> {
    const [rows]=await pool.execute<RowDataPacket[]>(
      "SELECT * FROM books WHERE ISBN = ?",
      [ISBN]
    );
    if (rows.length === 0) return null;
    return rows[0] as Book;
  }
  async listAllBooks({
    limit,
    offset,
  }: {
    limit: number | string;
    offset: number | string;
  }): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(limit); 
    const finalOffset = Number(offset);
    console.log(
      `[Mysql] listAllBooks called with limit: ${finalLimit}, offset: ${finalOffset}`
    );
    return new Promise(async (resolve, reject) => {
      try {
        const [rowsResult, countResult] = await Promise.all([
          pool.query<RowDataPacket[]>(
            "SELECT title,Author,sellingPrice,category,Pub_Year  FROM books LIMIT ? OFFSET ?",
            [finalLimit, finalOffset]
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
