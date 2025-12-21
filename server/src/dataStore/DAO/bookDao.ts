import { Book } from "../../../../shared/types.js";

export interface bookDao {
    createNEWBook(book: Book): Promise<Book>;
    listAllBooks({ limit, offset }: { limit: number; offset: number }): Promise<{ books: Book[], total: number }>;
    getBookByISBN(ISBN: string): Promise<Book | null>;
    updateBookByISBN(ISBN: string): Promise<Book | null>;
    getBookByTitle(Title: string): Promise<Book | null>;
}