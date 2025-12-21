import { Router } from "express";
import { createBook, getBookByISBN, getBookByTitle, listAllBooks, updateBookByISBN } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";


export const bookController = (db: DataStore)=>{
    const router = Router();
    router.post("/create", createBook(db));
    router.get("/list", listAllBooks(db));
    router.get("/:isbn", getBookByISBN(db));
    router.put("/:isbn", updateBookByISBN(db));
    router.get("/getByTitle", getBookByTitle(db))
    return router;
}
    