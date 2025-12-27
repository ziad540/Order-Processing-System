import { DataStore } from "../../dataStore/index.js";
import { Admin } from "../../../../shared/types.js";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types.js";


export const logout = (db: DataStore) => async (req :Request , res:Response,  next: NextFunction) => {

    const decodedToken = (req as any).user ;
    const user =await db.getById(decodedToken.UserID);
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    const block = await db.blackListToken(decodedToken.jti);
    res.status(200).json({ message: "Logout successful" , block  }

    );
    
     

}    