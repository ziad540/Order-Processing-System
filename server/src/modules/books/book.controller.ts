import { Router } from "express";
import { createBook, filterBookByCategory, getBookByISBN, getBookByTitle, listAllBooks, updateBookByISBN } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";


export const bookController = (db: DataStore)=>{
    const router = Router();
    router.get("/getByTitle", getBookByTitle(db));
    router.get("/filterByCategories", filterBookByCategory(db));
    router.post("/create", createBook(db));
    router.get("/list", listAllBooks(db));
    router.put("/update/:isbn", updateBookByISBN(db));
    router.get("/:isbn", getBookByISBN(db));
    
    
    return router;
}
    