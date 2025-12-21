import { Router } from "express";
import { createBook, listAllBooks } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";

export const bookController = (db: DataStore)=>{
    const router = Router();
    router.post("/create", createBook(db));
    router.get("/list", listAllBooks(db));
    return router;
}
