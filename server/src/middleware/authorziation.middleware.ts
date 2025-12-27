import { NextFunction, Request, Response } from "express";
import { DataStore } from "../dataStore/index.js";

export const authorizationMiddleware = (requiredRole: "Admin" | "Customer", db: DataStore) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {   
            const decodedToken = (req as any).user ;
            if (!decodedToken) {
                return res.status(401).json({ error: "Unauthorized: No token provided" });
            }
            const user = await db.getById(decodedToken.UserID);
            if (!user) {
                return res.status(401).json({ error: "Unauthorized: User not found" });
            }   
            const userRole = await db.getUserRole(user.UserID);
            if (userRole !== requiredRole) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }   
        } catch (error) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        next();
    };
}