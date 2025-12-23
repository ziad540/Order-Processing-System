import { DataStore } from "../../dataStore/index.js";
import { Router } from "express";
import { SignUp,signin  } from "./customer.service.js";


export const customerController = (db: DataStore)=>{
    const router = Router();
    router.post("/signup", SignUp (db) );
    router.post("/signin", signin (db) );
    return router;

}