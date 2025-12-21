import { DataStore } from "../../dataStore/index.js";
import { Book } from "../../../../shared/types.js";
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
      // console.log(req.body);
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
      res.status(200).json({ message: "Book  successfully", book: newBook });
    } catch (error) {
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
      if (!ISBN) {
        return res.status(400).json({ message: "ISBN parameter is required" });
      }
      const book = await db.getBookByISBN(ISBN);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book retrieved successfully", book });
    } catch (error) {
      next(error);
    }
  };
};

export const getBookByTitle = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title: Title } = req.body;

      console.log(`[BookService] getBookByTitle called with title: ${Title}`);
      if (!Title) {
        return res.status(400).json({ message: "Title parameter is required" });
      }
      const { page, limit } = req.query;

      const { limit: limitNumber, offset: offsetNumber } = calculatePagination({
        pageNumber: Number(page) || 1,
        pageSize: Number(limit) || 10,
      });

      const { books, total } = await db.getBookByTitle(Title, {
        limit: limitNumber,
        offset: offsetNumber,
      });

      if (books.length === 0) {
        return res.status(404).json({ message: "No books found with that title" });
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

export const updateBookByISBN = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {sellingPrice,stockLevel,threshold}= req.body;
      if(sellingPrice<0 || stockLevel<0 || threshold<0){
        return res.status(400).json({ message: "Invalid values for sellingPrice, stockLevel, or threshold" });
      }
      const { isbn: ISBN } = req.params;
      if (!ISBN) {
        return res.status(400).json({ message: "ISBN parameter is required" });
      }

      const result = await db.updateBookByISBN(ISBN,{sellingPrice,stockLevel,threshold});

      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  };
};



export const filterBookByCategory = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categories } = req.body;
     if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ message: "Categories parameter is required and should be a non-empty array" });
      }

      const { page, limit } = req.query;

      const { limit: limitNumber, offset: offsetNumber } = calculatePagination({
        pageNumber: Number(page) || 1,
        pageSize: Number(limit) || 10,
      });

      const { books, total } = await db.filterBookByCategory(categories, {
        limit: limitNumber,
        offset: offsetNumber,
      });

      if (books.length === 0) {
        return res.status(404).json({ message: "No books found with that category" });
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