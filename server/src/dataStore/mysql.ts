import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class Mysql implements DataStore {
  async filterBookByCategory(
    category: string[],
    pagination: { limit: number; offset: number }
  ): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(pagination.limit);
    const finalOffset = Number(pagination.offset);

    const placeholders = category.map(() => "?").join(", ");
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM books WHERE category IN (${placeholders}) LIMIT ? OFFSET ?`,
      [...category, finalLimit, finalOffset]
    );
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM books WHERE category IN (${placeholders})`,
      [...category]
    );
    const total = countResult[0].total;
    const books = rows as any as Book[];

    return { books, total };
  }
  async getBookByTitle(
    Title: string,
    { limit, offset }: { limit: number; offset: number }
  ): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(limit);
    const finalOffset = Number(offset);

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM books WHERE title LIKE ? LIMIT ? OFFSET ?",
      [`%${Title}%`, finalLimit, finalOffset]
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM books WHERE title LIKE ?",
      [`%${Title}%`]
    );

    const total = countResult[0].total;
    const books = rows as any as Book[];

    return { books, total };
  }
  async updateBookByISBN(
    ISBN: string,
    updates: { sellingPrice?: number; stockLevel?: number; threshold?: number }
  ): Promise<string | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.sellingPrice !== undefined) {
      fields.push("sellingPrice = ?");
      values.push(updates.sellingPrice);
    }
    if (updates.stockLevel !== undefined) {
      fields.push("stockLevel = ?");
      values.push(updates.stockLevel);
    }
    if (updates.threshold !== undefined) {
      fields.push("threshold = ?");
      values.push(updates.threshold);
    }

    if (fields.length === 0) {
      return "No updates provided";
    }

    values.push(ISBN);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE books SET ${fields.join(", ")} WHERE ISBN = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    return "Book updated successfully";
  }
  async getBookByISBN(ISBN: string): Promise<Book | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
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
