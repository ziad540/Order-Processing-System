import { DataStore } from "../../dataStore/index.js";
import { Router } from "express";
import { SignUp, signin, logout, getProfile, updateProfile, updatePassword } from "./customer.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorziation.middleware.js";


export const customerController = (db: DataStore) => {
    const router = Router();
    router.post("/signup", SignUp(db));
    router.post("/signin", signin(db));
    router.post("/signout", authMiddleware(db), logout(db));
    router.get("/profile", authMiddleware(db), getProfile(db));
    router.put("/profile", authMiddleware(db), updateProfile(db));
    router.put("/password", authMiddleware(db), updatePassword(db));
    return router;

}