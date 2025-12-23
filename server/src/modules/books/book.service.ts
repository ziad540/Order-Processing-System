import { DataStore } from "../../dataStore/index.js";
import { Book } from "../../../../shared/types.js";
import { NextFunction, Request, Response } from "express";


export const createBook = (db: DataStore) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel ,threshold}: Book = req.body;
            // console.log(req.body);
            if (!ISBN || !title || !publicationYear || !sellingPrice || !category) {
                 return res.status(400).json({
                    error: "Please fill all required fields"
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
                threshold
            };

            // await db.createNEWBook(newBook);
            res.status(200).json({ message: "Book  successfully", book: newBook });

        } catch (error) {
            next(error);
        }
    }
}