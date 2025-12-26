import { DataStore } from "../../dataStore/index.js";
import { Admin } from "../../../../shared/types.js";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types.js";


export  const createAdmin = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { Username, email, phones, Password, FirstName, LastName } = req.body;
    try {
        const existingUser = await db.existsByUsername(Username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const existingEmail = await db.existsByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const newUser: Omit<User, "UserID"> = {
            Username,
            email,  
            phones,
            Password
        };
        const createdUser = await db.createUser(newUser);
        res.status(200).json({ message: "Admin creation successful", createdUser });
    } catch (error) {
        next(error);
    }
};