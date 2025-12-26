import { DataStore } from "../../dataStore/index.js";
import { Router } from "express"; 


import { createAdmin } from "./admin.service.js";

export const adminController = (db: DataStore)=>{
    const router = Router();
    router.post("/createAdmin", createAdmin (db) );
    return router;
}

