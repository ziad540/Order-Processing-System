import { Book } from "../../../../shared/types.js";

export interface bookDao {
    createNEWBook(book: Book): Promise<Book>;
    listAllBooks({ limit, offset }: { limit: number; offset: number }): Promise<{ books: Book[], total: number }>;
    getBookByISBN(ISBN: string): Promise<Book | null>;
    updateBookByISBN(ISBN: string, updates:{ sellingPrice?: number; stockLevel?: number; threshold?: number }): Promise<string | null>;
    getBookByTitle(Title: string, pagination: { limit: number; offset: number }): Promise<{ books: Book[], total: number }>;
    filterBookByCategory(category: string[], pagination: { limit: number; offset: number }): Promise<{ books: Book[], total: number }>;
}