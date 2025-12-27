import { DataStore } from "../../dataStore/index.js";
import { User } from "../../../../shared/types.js";
import { Customer } from "../../../../shared/types.js";
import { hashPassword, verifyPassword } from "../../../utils/passwordUtils.js";
import { NextFunction, Request, Response } from "express";
import { CartItem } from "../../../../shared/types.js";
import { ShoppingCart } from "../../../../shared/types.js";

import { jwtObject } from "../../../../shared/types.js";
import { signJwtToken } from "../../middleware/auth.middleware.js";
import { Sign } from "node:crypto";


export const SignUp = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { Username, email, phones, Password, FirstName, LastName, ShippingAddress } = req.body;
    try {
        const existingUser = await db.existsByUsername(Username);
        if (existingUser) {
            return res.status(400).json({ error: `The username '${Username}' is already taken. Please choose a different one.` });
        }

        const existingEmail = await db.existsByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: `The email address '${email}' is already registered. Please sign in or use another email.` });
        }


        const hashedPassword = await hashPassword(Password);

        const newUser: Omit<User, "UserID"> = {
            Username,
            email,
            phones,
            Password: hashedPassword
        };

        const createdUser = await db.createUser(newUser);

        const user_ID = createdUser.UserID;

        const createdCustomer = await db.createCustomer(user_ID, { ShippingAddress, FirstName, LastName })


        res.status(200).json({ message: "Sign-up successful", createdCustomer });



    }
    catch (error) {

        next(error);


    }



}
export const signin = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, Password } = req.body;
        const user: User | null = await db.getuserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const passwordMatch = await verifyPassword(Password, user.Password);
        const role = await db.getUserRole(user.UserID);

        const jwt = signJwtToken({
            UserID: user.UserID,
            role: role
        });
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        res.status(200).json({
            message: "Sign-in successful",
            user: { ...user, role },
            token: jwt

        });

    }

    catch (error) {

        next(error);
    }
}

export const logout = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = (req as any).user;
    const user = await db.getById(decodedToken.UserID);
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    const block = await db.blackListToken(decodedToken.jti);
    const clearr = await db.clearCart(decodedToken.UserID);
    res.status(200).json({ message: "Logout successful", block }

    );




}

export const getProfile = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = (req as any).user;
        if (!decodedToken || !decodedToken.UserID) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = decodedToken.UserID;
        const user = await db.getById(userId);
        const customer = await db.getCustomerById(userId);
        const role = await db.getUserRole(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Combine user and customer data
        const profileData = {
            ...user, // Contains UserID, Username, email, phones
            ...customer, // Contains ShippingAddress, FirstName, LastName
            role // Add role explicitly
        };

        // Remove sensitive data if necessary (Password is already removed in some flows, but good to be safe)
        const { Password, ...safeProfileData } = profileData as any;

        res.status(200).json(safeProfileData);
    } catch (error) {
        next(error);
    }
}


export const updateProfile = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = (req as any).user;
        if (!decodedToken || !decodedToken.UserID) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { firstName, lastName, email, address } = req.body;
        const userId = decodedToken.UserID;

        // Optional: Basic validation
        if (email && !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Update User table (email)
        if (email) {
            await db.updateEmail(userId, email);
        }

        // Update Customer table (details)
        if (firstName || lastName || address) {
            await db.updateCustomerDetails(userId, {
                firstName,
                lastName,
                shippingAddress: address
            });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updatePassword = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = (req as any).user;
        if (!decodedToken || !decodedToken.UserID) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.UserID;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        const user = await db.getById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const passwordMatch = await verifyPassword(currentPassword, user.Password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update
        await db.updatePassword(userId, hashedNewPassword);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};
