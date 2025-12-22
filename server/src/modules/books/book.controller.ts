import { Router } from "express";
import { createBook, getBookByISBN, searchBooks, listAllBooks, updateBookByISBN } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";


export const bookController = (db: DataStore)=>{
    const router = Router();
    router.post("/search", searchBooks(db));
    router.post("/create", createBook(db));
    router.get("/list", listAllBooks(db));
    router.put("/update/:isbn", updateBookByISBN(db));
    router.get("/:isbn", getBookByISBN(db));
    
    
    return router;
}
    