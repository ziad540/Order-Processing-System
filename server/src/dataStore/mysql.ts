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
        // If it looks like JSON array
        if (rawAuthors.trim().startsWith('[')) {
           authors = JSON.parse(rawAuthors);
        } else {
           // Assume comma separated or single author
           authors = [rawAuthors]; 
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

    let query = "SELECT * FROM books WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM books WHERE 1=1";
    const params: any[] = [];

    if (filter.title) {
      query += " AND title LIKE ?";
      countQuery += " AND title LIKE ?";
      params.push(`%${filter.title}%`);
    }

    if (filter.category && filter.category.length > 0) {
      const placeholders = filter.category.map(() => "?").join(", ");
      query += ` AND category IN (${placeholders})`;
      countQuery += ` AND category IN (${placeholders})`;
      params.push(...filter.category);
    }

    // Note: Assuming 'authors' column holds JSON array, standard LIKE might not be perfect but acceptable for simple search
    if (filter.author) {
      query += " AND authors LIKE ?"; 
      countQuery += " AND authors LIKE ?";
      params.push(`%${filter.author}%`);
    }

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
      "SELECT * FROM books WHERE ISBN = ?",
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
            "SELECT * FROM books LIMIT ? OFFSET ?",
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
