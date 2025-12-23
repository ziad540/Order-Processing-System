import { Book } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { User } from "../../../shared/types.js";
import { Customer } from "../../../shared/types.js";
import { Admin } from "../../../shared/types.js";

export class Mysql implements DataStore {


    private async getCustomerCoreByUserId(userId: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT
      c.FirstName AS firstName,
      c.LastName AS lastName,
      c.ShippingAddress AS shippingAddress
    FROM Customers c
    WHERE c.UserID = ?
    `,
    [userId]
  );

  if (rows.length === 0) return null;
  return rows[0];
}
 
 async getCustomerById(userId: number): Promise<Customer | null> {
  const user = await this.getById(userId);
  if (!user) return null;

  const customerRow = await this.getCustomerCoreByUserId(userId);
  if (!customerRow) return null;

  return {
    ...user,
    FirstName: customerRow.firstName,
    LastName: customerRow.lastName,
    ShippingAddress: customerRow.ShippingAddress
  };
}

  async getCustomerByUsername(username: string): Promise<Customer | null> 
  {
    const user = await this.getByUsername(username);
    if (!user) return null;

    const customerRow = await this.getCustomerCoreByUserId(user.UserID);
    if (!customerRow) return null;
    return {
    
        ...user,
        FirstName: customerRow.firstName,
        LastName: customerRow.lastName,
        ShippingAddress: customerRow.ShippingAddress
    }
}

  async getUserPhones(userId: number): Promise<string[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT PhoneNumber FROM User_Phones WHERE UserID = ?',
    [userId]
  );

  return rows.map(r => r.PhoneNumber);
}

    async getCustomerByEmail(email: string): Promise<Customer | null> {

        const user = await this.getuserByEmail(email);
        if (!user) return null;
        const customerRow = await this.getCustomerCoreByUserId(user.UserID);
        if (!customerRow) return null;
        return {
            ...user,
            FirstName: customerRow.firstName,
            LastName: customerRow.lastName,
            ShippingAddress: customerRow.shippingAddress
        };

     
    }
   async createCustomer(UserID: number, input: { ShippingAddress: string; FirstName: string; LastName: string; }): Promise<Customer> {


    const user = await this.getById(UserID);
    console.log("Creating customer for user:", user);
    if (!user) throw new Error("User not found");

    const { ShippingAddress, FirstName, LastName } = input;

    await pool.execute<ResultSetHeader>(
      'INSERT INTO Customers (UserID, ShippingAddress, FirstName, LastName) VALUES (?, ?, ?, ?)',
      [UserID, ShippingAddress, FirstName, LastName]
    );

    return {
      ...user,
      ShippingAddress,
        FirstName,
        LastName
    };


   }

   async getById(id: number): Promise<User | null> {

       const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE UserID = ?', [id]);
        if (rows.length === 0) return null;

        
        return rows[0] as User;




}
   async getByUsername(username: string): Promise<User | null> {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    
    
    }
  async  getuserByEmail(email: string): Promise<User | null> {

        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return null;
        return rows[0] as User;


}
   async createUser(input: Omit<User, "UserID">): Promise<User> {
        const { Username, email, phones, Password } = input;

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [Username, email, Password]
        );
        const UserID = result.insertId;
        for (const phone of phones) {
            await pool.execute<ResultSetHeader>(
                'INSERT INTO User_Phones (UserID, PhoneNumber) VALUES (?, ?)',
                [UserID, phone]
            );
        }
        return {  UserID, Username, email, phones, Password };


    }

  async  getAdminById(id: number): Promise<Admin | null> {
        const admin = await this.getById(id);
        if (!admin) return null;
        return admin as Admin;
}

   async getAdminByUsername(username: string): Promise<Admin | null> {
        const admin = await this.getByUsername(username);
        if (!admin) return null;
        return admin as Admin;
    }
   async getAdminByEmail(email: string): Promise<Admin | null> {
        const admin = await this.getuserByEmail(email);
        if (!admin) return null;
        return admin as Admin;
    }
  async  createNewAdmin(admin: Admin): Promise<Admin> {
        const user = await this.createUser(admin);
        return user as Admin;
    }

    async existsByEmail(email: string): Promise<boolean> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT 1 FROM Users WHERE Email = ? LIMIT 1',
    [email]
  );
  return rows.length > 0;
}
async existsByUsername(username: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT 1 FROM Users WHERE Username = ? LIMIT 1',
        [username]
    );
    return rows.length > 0;


}
    async getBookById(id: number): Promise<Book | null> {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM books WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return rows[0] as Book;
    }

    async createNEWBook(book: Book): Promise<Book> {
        const { ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel } = book;

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO books (ISBN, title, authors, publicationYear, sellingPrice, category, stockLevel) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ISBN, title, JSON.stringify(authors), publicationYear, sellingPrice, category, stockLevel]
        );
        
        return book;
    }

}