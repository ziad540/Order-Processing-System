import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { BookFilter } from "../../../shared/types.js";

export class Mysql implements DataStore {
  private mapRowToBook(row: any): Book {
    console.log('DEBUG MAP ROW:', row);
    
    let authors: string[] = [];
    const rawAuthors = row.authors || row.Author || row.author || '[]';
    try {
      if (typeof rawAuthors === 'string') {
        // If it looks like JSON array (old logic or backup)
        if (rawAuthors.trim().startsWith('[')) {
           authors = JSON.parse(rawAuthors);
        } else {
           // If it came from GROUP_CONCAT, it is comma separated
           authors = rawAuthors.split(',').map(a => a.trim());
        }
      } else if (Array.isArray(rawAuthors)) {
        authors = rawAuthors;
      }
    } catch (e) {
      authors = [];
    }

    return {
      ISBN: row.ISBN || row.isbn,
      title: row.title || row.Title,
      authors: authors,
      publisher: row.publisher || row.Publisher || 'Unknown Publisher',
      publicationYear: row.publicationYear || row.Pub_Year || row.Year || new Date().getFullYear(),
      category: row.category || row.Category || 'General',
      sellingPrice: Number(row.SellingPrice ?? row.Price ?? 0),
      stockLevel: Number(row.StockLevel ?? row.quantity ?? row.Quantity ?? row.Stock ?? 0),
      threshold: Number(row.threshold ?? row.Threshold ?? 10),
      coverImage: row.coverImage || row.CoverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
    };
  }

  async searchBook(
    filter: BookFilter,
    pagination: { limit: number; offset: number }
  ): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(pagination.limit);
    const finalOffset = Number(pagination.offset);

    let query = "SELECT books.*, GROUP_CONCAT(Authors.AuthorName) as authors FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN WHERE 1=1";
    let countQuery = "SELECT COUNT(DISTINCT books.ISBN) as total FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN WHERE 1=1";
    const params: any[] = [];

    if (filter.title) {
      query += " AND books.title LIKE ?";
      countQuery += " AND books.title LIKE ?";
      params.push(`%${filter.title}%`);
    }

    if (filter.category && filter.category.length > 0) {
      const placeholders = filter.category.map(() => "?").join(", ");
      query += ` AND books.category IN (${placeholders})`;
      countQuery += ` AND books.category IN (${placeholders})`;
      params.push(...filter.category);
    }

    if (filter.author) {
      query += " AND Authors.AuthorName LIKE ?"; 
      countQuery += " AND Authors.AuthorName LIKE ?";
      params.push(`%${filter.author}%`);
    }

    query += " GROUP BY books.ISBN";

    console.log(`[Mysql] searchBook query: ${query}`);

    const [rows] = await pool.query<RowDataPacket[]>(
      query + " LIMIT ? OFFSET ?",
      [...params, finalLimit, finalOffset]
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      countQuery,
      params
    );

    const total = countResult[0].total;
    const books = rows.map(row => this.mapRowToBook(row));

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
      "SELECT books.*, GROUP_CONCAT(Authors.AuthorName) as authors FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN WHERE books.ISBN = ? GROUP BY books.ISBN",
      [ISBN]
    );
    if (rows.length === 0) return null;
    return this.mapRowToBook(rows[0]);
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
            "SELECT books.*, GROUP_CONCAT(Authors.AuthorName) as authors FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN GROUP BY books.ISBN LIMIT ? OFFSET ?",
            [finalLimit, finalOffset]
          ),
          pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM books"),
        ]);

        const rows = rowsResult[0] as any[]; // RowDataPacket[]
        const total = (countResult[0] as RowDataPacket[])[0].total;

        console.log(
          `[Mysql] listAllBooks retrieved ${rows.length} books. Total count: ${total}`
        );
        const books = rows.map(row => this.mapRowToBook(row));
        resolve({ books, total });
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
      threshold,
      PubID,
      coverImage,
    } = book;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        "INSERT INTO books (ISBN, title, Pub_Year, sellingPrice, category, stockLevel, threshold, PubID, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          ISBN,
          title,
          publicationYear,
          sellingPrice,
          category,
          stockLevel,
          threshold ?? 10,
          PubID,
          coverImage || null
        ]
      );

      if (authors && Array.isArray(authors) && authors.length > 0) {
        for (const author of authors) {
          await connection.execute(
            "INSERT INTO Authors (AuthorName, BookISBN) VALUES (?, ?)",
            [author, ISBN]
          );
        }
      }

      await connection.commit();
    } catch (error: any) {
      await connection.rollback();
      if (error.errno === 1452) {
        throw new Error("Foreign Key Constraint: PubID not found");
      }
      throw error;
    } finally {
      connection.release();
    }

    return book;
  }
}
