import { DataStore } from "../../dataStore/index.js";
import { Book, BookFilter } from "../../../../shared/types.js";
import { NextFunction, Request, Response } from "express";
import { calculatePagination } from "../../utlis/pagination.utlis.js";

export const createBook = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        ISBN,
        title,
        authors,
        publicationYear,
        sellingPrice,
        category,
        stockLevel,
        threshold,
      }: Book = req.body;
      console.log(`[BookService] createBook called with ISBN: ${ISBN}, title: ${title}`);
      if (!ISBN || !title || !publicationYear || !sellingPrice || !category) {
        return res.status(400).json({
          error: "Please fill all required fields",
        });
      }

      const newBook: Book = {
        ISBN,
        title,
        authors,
        publicationYear,
        sellingPrice,
        category,
        stockLevel,
        threshold,
      };

      // await db.createNEWBook(newBook);
      console.log(`[BookService] Book created successfully: ${newBook.ISBN}`);
      res.status(200).json({ message: "Book  successfully", book: newBook });
    } catch (error) {
      console.error(`[BookService] Error in createBook:`, error);
      next(error);
    }
  };
};

export const listAllBooks = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;

      const { limit: limitNumber, offset: offsetNumber } = calculatePagination({
        pageNumber: Number(page) || 1,
        pageSize: Number(limit) || 10,
      });

      console.log(
        `[BookService] Handling listAllBooks request. Page: ${page}, Limit: ${limit}`
      );
      console.log(
        `[BookService] Type of limit: ${typeof limitNumber}, Type of offset: ${typeof offsetNumber}`
      );

      const { books, total } = await db.listAllBooks({
        limit: limitNumber,
        offset: offsetNumber,
      });

      const totalPages = Math.ceil(total / limitNumber);
      const currentPage = Number(page) || 1;

      console.log(
        `[BookService] Retrieved ${books.length} books. Total: ${total}, Total Pages: ${totalPages}`
      );

      res.status(200).json({
        message: "Books retrieved successfully",
        data: books,
        pagination: {
          currentPage,
          totalPages,
          totalBooks: total,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

export const getBookByISBN = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isbn: ISBN } = req.params;

      console.log(req.params);
      console.log(`[BookService] getBookByISBN called with ISBN: ${ISBN}`);
      if (!ISBN) {
        return res.status(400).json({ message: "ISBN parameter is required" });
      }
      const book = await db.getBookByISBN(ISBN);

      if (!book) {
        console.warn(`[BookService] Book not found for ISBN: ${ISBN}`);
        return res.status(404).json({ message: "Book not found" });
      }

      console.log(`[BookService] Book retrieved: ${book.title}`);
      res.status(200).json({ message: "Book retrieved successfully", book });
    } catch (error) {
      console.error(`[BookService] Error in getBookByISBN:`, error);
      next(error);
    }
  };
};

export const updateBookByISBN = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {sellingPrice,stockLevel,threshold}= req.body;
      if(sellingPrice<0 || stockLevel<0 || threshold<0){
        return res.status(400).json({ message: "Invalid values for sellingPrice, stockLevel, or threshold" });
      }
      const { isbn: ISBN } = req.params;
      console.log(`[BookService] updateBookByISBN called with ISBN: ${ISBN}, updates:`, req.body);

      if (!ISBN) {
        return res.status(400).json({ message: "ISBN parameter is required" });
      }

      const result = await db.updateBookByISBN(ISBN,{sellingPrice,stockLevel,threshold});

      if (!result) {
        console.warn(`[BookService] Failed to update. Book not found for ISBN: ${ISBN}`);
        return res.status(404).json({ message: "Book not found" });
      }

      console.log(`[BookService] Book updated successfully: ${ISBN}`);
      res.status(200).json({ message: result });
    } catch (error) {
      console.error(`[BookService] Error in updateBookByISBN:`, error);
      next(error);
    }
  };
};

export const searchBooks = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, categories, author }: { title?: string; categories?: string[]; author?: string } = req.body;
      
      const filter: BookFilter = {};
      if (title) filter.title = title;
      if (categories && Array.isArray(categories) && categories.length > 0) filter.category = categories;
      if (author) filter.author = author;

      if (Object.keys(filter).length === 0) {
        return res.status(400).json({ message: "At least one filter (title, categories, or author) is required" });
      }

      const { page, limit } = req.query;

      const { limit: limitNumber, offset: offsetNumber } = calculatePagination({
        pageNumber: Number(page) || 1,
        pageSize: Number(limit) || 10,
      });

      console.log(`[BookService] searchBooks called with filter:`, filter);

      const { books, total } = await db.searchBook(filter, {
        limit: limitNumber,
        offset: offsetNumber,
      });

      if (books.length === 0) {
        return res.status(404).json({ message: "No books found matching criteria" });
      }

      const totalPages = Math.ceil(total / limitNumber);
      const currentPage = Number(page) || 1;

      res.status(200).json({ 
        message: "Book(s) retrieved successfully", 
        data: books,
        pagination: {
          currentPage,
          totalPages,
          totalBooks: total,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        }
      });
    } catch (error) {
      next(error);
    }
  };
};