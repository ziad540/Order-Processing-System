import { Router } from "express";
import { createBook, getBookByISBN, listAllBooks, updateBookByISBN } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";


export const bookController = (db: DataStore)=>{
    const router = Router();
    router.post("/create", createBook(db));
    router.get("/list", listAllBooks(db));
    router.get("/:isbn", getBookByISBN(db));
    router.put("/:isbn", updateBookByISBN(db));
    return router;
}
    