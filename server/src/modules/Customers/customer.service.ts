import { DataStore } from "../../dataStore/index.js";
import { User } from "../../../../shared/types.js";
import { Customer } from "../../../../shared/types.js";
import { hashPassword, verifyPassword }  from  "../../../utils/passwordUtils.js";
import { NextFunction, Request, Response } from "express";
import{ CartItem } from "../../../../shared/types.js";
import { ShoppingCart } from "../../../../shared/types.js";



export const SignUp = (db: DataStore) => async (req :Request , res:Response,  next: NextFunction) => {
    const { Username, email, phones, Password, FirstName, LastName, ShippingAddress } = req.body;
    try {
        const existingUser = await db.existsByUsername(Username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });}

        const existingEmail = await db.existsByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });}


        const hashedPassword = await hashPassword(Password);

        const newUser: Omit<User, "UserID"> = {
            Username,
            email,
            phones,
            Password: hashedPassword
        };

        const createdUser = await db.createUser(newUser);

        const user_ID = createdUser.UserID;

        const createdCustomer= await  db.createCustomer(user_ID,{ ShippingAddress, FirstName ,LastName } )

        const createdcart:ShoppingCart = await db.createCartForUser(user_ID);




      res.status(200).json({ message: "Sign-up successful", createdCustomer , createdcart  });


    
    }
    catch (error) {

              next(error);    
   
   
            }



}
export const signin = (db: DataStore) => async (req :Request , res:Response,  next: NextFunction) => {
try{
    const { email, Password } = req.body;
    const user : User|null = await db.getuserByEmail(email);
    if (!user) {
        return  res.status(400).json({ error: "Invalid email or password" });
    }
console.log("User fetched by email:", user);
 
console.log({
  Password,

    userPassword: user.Password

});
    const passwordMatch = await verifyPassword(Password, user.Password);
    if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Sign-in successful", user });

}

catch (error) {

            next(error);
}}