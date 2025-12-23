import { Book, CartItem, ShoppingCart } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { User } from "../../../shared/types.js";
import { Customer } from "../../../shared/types.js";
import { Admin } from "../../../shared/types.js";



export class Mysql implements DataStore {
  async getCartByUserId(UserID: number): Promise<ShoppingCart | null> {

  const [cartRows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT CartID
    FROM ShoppingCarts
    WHERE UserID = ?
    `,
    [UserID]
  );

  if (cartRows.length === 0) return null;

  const cartId = cartRows[0].CartID;

  const [itemRows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT
      ci.Quantity,
      b.ISBN,
      b.Title,
      b.Authors,
      b.SellingPrice,
      b.Category
    FROM CartItems ci
    JOIN Books b ON ci.ISBN = b.ISBN
    WHERE ci.CartID = ?
    `,
    [cartId]
  );

  const items: CartItem[] = itemRows.map(row => ({
    quantity: row.Quantity,
    book: {
      ISBN: row.ISBN,
      title: row.Title,
      authors: row.Authors ? JSON.parse(row.Authors) : undefined,
      sellingPrice: row.SellingPrice,
      category: row.Category
    }
  }));

  return {
    cartId,
    UserID,
    items
  };
}

   async createCartForUser(UserID: number): Promise<ShoppingCart> {


        
    const cart = await this.getCartByUserId(UserID);
  
    if (cart) throw new Error("cart already exists for this user");


    const [result] =await pool.execute<ResultSetHeader>(
      'INSERT INTO ShoppingCarts (UserID) VALUES (?)',
      [UserID]
    );

    return {
        cartId: result.insertId,
        UserID,
        items: []
    

    };






    }
    addItemToCart(userId: number, isbn: string, quantity: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeItemFromCart(userId: number, isbn: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateItemQuantity(userId: number, isbn: string, quantity: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    clearCart(userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getCartItemByCartIdAndIsbn(cartId: number, isbn: string): Promise<CartItem | null> {
        throw new Error("Method not implemented.");
    }
    createCartItem(cartId: number, isbn: string, quantity: number): Promise<CartItem> {
        throw new Error("Method not implemented.");
    }
    updateCartItemQuantity(cartId: number, isbn: string, quantity: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteCartItem(cartId: number, isbn: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


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