import { DataStore } from "../../dataStore/index.js";
import { Router } from "express"; 


import { logout } from "./admin.service.js";
import { authMiddleware} from "../../middleware/auth.middleware.js";

export const adminController = (db: DataStore)=>{
    const router = Router();
    router.post("/logout",authMiddleware, logout (db) );

    return router;
}

