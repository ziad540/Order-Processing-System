import { Router } from "express";
import { createBook } from "./book.service.js";
import { DataStore } from "../../dataStore/index.js";


export const bookController = (db: DataStore)=>{
    const router = Router();
    router.post("/create", createBook(db));
    return router;
}
