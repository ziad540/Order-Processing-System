import { Book } from "../../../../shared/types.js";

export interface bookDao {
    createNEWBook(book: Book): Promise<Book>;
    getBookById(id: number): Promise<Book | null>;

}