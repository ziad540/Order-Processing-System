 
 // create token for useer upon login or signup
    import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtObject } from "../../../shared/types.js";
import{ DataStore } from "../dataStore/index.js";
    import { v4 as uuidv4 } from "uuid";


 
        export function signJwtToken(payload: jwtObject): string {
            const secret= process.env.JWT_SECRET_KEY as string;


return jwt.sign(payload, secret,   { expiresIn: '1h', jwtid: uuidv4() } );  

    
        }

    export function verifyJwtToken(token: string): jwtObject {
        const secret= process.env.JWT_SECRET_KEY as string;
        return jwt.verify(token, secret 

        ) as jwtObject;
    }
    


    export  const authMiddleware =  (db: DataStore)=> async(req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization?.split(' ')[1];
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        try {
            const decoded = verifyJwtToken(authHeader);
            const UserID = decoded.UserID;
            
            const Userr= await db.getById(UserID);
            if (!Userr) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const isBlackListed = await db.isTokenBlackListed(authHeader);
            if (isBlackListed) {
                return res.status(401).json({ error: 'Token has been blacklisted' });
            }




            (req as any).user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }


    }



