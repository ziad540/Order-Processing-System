import { DataStore } from "../../dataStore/index.js";
import { Router } from "express";
import { SignUp,signin,logout  } from "./customer.service.js";
import { authMiddleware} from "../../middleware/auth.middleware.js";
import{authorizationMiddleware} from "../../middleware/authorziation.middleware.js";


export const customerController = (db: DataStore)=>{
    const router = Router();
    router.post("/signup",  SignUp (db) );
    router.post("/signin", signin (db) );
    router.post("/signout",authMiddleware,logout (db) );
    return router;

}