import { BlackListedToken, Book, CartItem, ShoppingCart } from "../../../shared/types.js";
import { DataStore, pool } from "./index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

import { User } from "../../../shared/types.js";
import { Customer } from "../../../shared/types.js";
import { Admin } from "../../../shared/types.js";



export class Mysql implements DataStore {
  async findCustomerbyUserId(userId: number): Promise<boolean> 
  { 
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT 1 FROM Customers WHERE UserID = ? LIMIT 1',
      [userId]
    );
    return rows.length > 0;

    

  }
  async findAdminbyUserId(userId: number): Promise<boolean> 
  {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT 1 FROM Admins WHERE UserID = ? LIMIT 1',
      [userId]
    );
    return rows.length > 0;
    
  }
 async isTokenBlackListed(token: string): Promise<boolean> {
     const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT 1 FROM BlackListedTokens WHERE token = ? LIMIT 1',
      [token]
    );
    return rows.length > 0;

  }
  async blackListToken(token: string): Promise<BlackListedToken> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO BlackListedTokens (token, blacklistedAt) VALUES (?, ?)',
      [token, new Date()]
    );
    return {
      token,
      blacklistedAt: new Date()
    };
  }
  async getUserRole(userId: number): Promise<"Admin" | "Customer"> 
  {

     
    const isAdmin = await this.findAdminbyUserId(userId);
    if (isAdmin) return "Admin";
    return "Customer";

  }
  async plusoneItemQuantity(userId: number, isbn: string): Promise<void> {


    const shoppingCartId =await this.getCartIdByUserId(userId);
    if (!shoppingCartId) {
      throw new Error("Shopping cart not found for user");
    }
    const isbnExists = await this.getCartItemByCartIdAndIsbn(shoppingCartId, isbn);
    if (!isbnExists) {
      throw new Error("ISBN not found in cart");
    }
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE CartItems SET Quantity = Quantity + 1 WHERE CartID = ? AND ISBN = ?',
      [shoppingCartId, isbn]
    );

    if (result.affectedRows === 0) {
      throw new Error("Cart item not found");
    }
    return;


   

  }
  async minusoneItemQuantity(userId: number, isbn: string): Promise<void> {
    const shoppingCartId =await this.getCartIdByUserId(userId);
    if (!shoppingCartId) {
      throw new Error("Shopping cart not found for user");
    }
    const isbnExists = await this.getCartItemByCartIdAndIsbn(shoppingCartId, isbn);
    if (!isbnExists) {
      throw new Error("ISBN not found in cart");
    }
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE CartItems SET Quantity = Quantity - 1 WHERE CartID = ? AND ISBN = ? AND Quantity > 0',
      [shoppingCartId, isbn]
    );
    if (result.affectedRows === 0) {
      throw new Error("Cart item not found or quantity is already zero");
    }
    return;

  }
  async getCartItemByUserIdAndIsbn(userId: number, isbn: string): Promise<CartItem | null> {

    const cartIdPromise =await this.getCartIdByUserId(userId);
    
    if (!cartIdPromise) {
      throw new Error("Shopping cart not found for user");
    }
    return this.getCartItemByCartIdAndIsbn(cartIdPromise, isbn);

    

  }
  async getallCartItems(userId: number): Promise<CartItem[]> {

  const cartIdPromise =await this.getCartIdByUserId(userId);
  
  if (!cartIdPromise) {
    throw new Error("Shopping cart not found for user");
  }


    const rows = await pool.execute<RowDataPacket[]>(

      `
      SELECT ci.Quantity, b.ISBN, b.Title, b.Authors, b.SellingPrice, b.Category
      FROM CartItems ci
      JOIN Books b ON ci.ISBN = b.ISBN
      WHERE ci.CartID = ?
      `,
      [cartIdPromise]
    );
    const items: CartItem[] = rows[0].map(row => ({
      quantity: row.Quantity,
      book: {
        ISBN: row.ISBN,
        title: row.Title,
        authors: row.Authors ? JSON.parse(row.Authors) : undefined,
        sellingPrice: row.SellingPrice,
        category: row.Category
      }
    }));

    return items;
  }



 async getCartItemQuantity(cartId: number, isbn: string): Promise<number | null> {

    const rows = await pool.execute<RowDataPacket[]>(
      `
      SELECT Quantity
      FROM CartItems
      WHERE CartID = ? AND ISBN = ?
      `,
      [cartId, isbn]
    );

    if (rows[0].length === 0) return null;

    return rows[0][0].Quantity;
  }
  async getCartIdByUserId(userId: number): Promise<number | null> {

    const rows = await pool.execute<RowDataPacket[]>(
      `
      SELECT CartID
      FROM ShoppingCarts
      WHERE UserID = ?
      `,
      [userId]
    );

    if (rows[0].length === 0) return null;

    return rows[0][0].CartID;


  }
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


   async addItemToCart(userId: number, isbn: string, quantity: number): Promise<void> {

      const shoppingCartId = this.getCartIdByUserId(userId);
      if (!shoppingCartId) {

        throw new Error("Shopping cart not found for user");
      }

        const result =await pool.execute<ResultSetHeader>(
            'INSERT INTO CartItems (CartID, ISBN, Quantity) VALUES (?, ?, ?)',
            [shoppingCartId, isbn, quantity]
        );
       
        return;

    }
   async removeItemFromCart(userId: number, isbn: string): Promise<void> {

        const shoppingCartId = this.getCartIdByUserId(userId);
        if (!shoppingCartId) {
            throw new Error("Shopping cart not found for user");
        }
        const result = await pool.execute<ResultSetHeader>(
            'DELETE FROM CartItems WHERE CartID = ? AND ISBN = ?',
            [shoppingCartId, isbn]
        );
        return;

  }
   async updateItemQuantity(userId: number, isbn: string, quantity: number): Promise<void> {
        const shoppingCartId = this.getCartIdByUserId(userId);
        if (!shoppingCartId) {
            throw new Error("Shopping cart not found for user");
        }
        const result = await pool.execute<ResultSetHeader>(
            'UPDATE CartItems SET Quantity = ? WHERE CartID = ? AND ISBN = ?',
            [quantity, shoppingCartId, isbn]
        );
        return;

  }
   async clearCart(userId: number): Promise<void> {
     
        const shoppingCartId = this.getCartIdByUserId(userId);
        if (!shoppingCartId) {
            throw new Error("Shopping cart not found for user");
        }
        const result = await pool.execute<ResultSetHeader>(
            'DELETE FROM CartItems WHERE CartID = ?',
            [shoppingCartId]
        );
        return;
  }
    async getCartItemByCartIdAndIsbn(cartId: number, isbn: string): Promise<CartItem | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT ci.Quantity, b.ISBN, b.Title, b.Authors, b.SellingPrice, b.Category FROM CartItems ci JOIN Books b ON ci.ISBN = b.ISBN WHERE ci.CartID = ? AND ci.ISBN = ?',
            [cartId, isbn]
        );
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            quantity: row.Quantity,
            book: {
                ISBN: row.ISBN,
                title: row.Title,
                authors: row.Authors ? JSON.parse(row.Authors) : undefined,
                sellingPrice: row.SellingPrice,
                category: row.Category
            }
        };
    }
   async createCartItem(cartId: number, isbn: string, quantity: number): Promise<{
        cartId: number;
        isbn: string;
        quantity: number;
   }> {

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO CartItems (CartID, ISBN, Quantity) VALUES (?, ?, ?)',
            [cartId, isbn, quantity]
        );

        if (result.affectedRows !== 1) {
  throw new Error("Failed to insert cart item");
}


        return {
           
            cartId,
            isbn,
            quantity
        };

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
    // ATOMIC OPERATION: Create cart for user immediately after creating customer
    
    await this.createCartForUser(UserID);

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

import { BookFilter } from "../../../shared/types.js";

  private mapRowToBook(row: any): Book {
    console.log('DEBUG MAP ROW:', row);
    
    let authors: string[] = [];
    const rawAuthors = row.authors || row.Author || row.author || '[]';
    try {
      if (typeof rawAuthors === 'string') {
        // If it looks like JSON array (old logic or backup)
        if (rawAuthors.trim().startsWith('[')) {
           authors = JSON.parse(rawAuthors);
        } else {
           // If it came from GROUP_CONCAT, it is comma separated
           authors = rawAuthors.split(',').map(a => a.trim());
        }
      } else if (Array.isArray(rawAuthors)) {
        authors = rawAuthors;
      }
    } catch (e) {
      authors = [];
    }

    return {
      ISBN: row.ISBN || row.isbn,
      title: row.title || row.Title,
      authors: authors,
      publisher: row.publisher || row.Publisher || 'Unknown Publisher',
      publicationYear: row.publicationYear || row.Pub_Year || row.Year || new Date().getFullYear(),
      category: row.category || row.Category || 'General',
      sellingPrice: Number(row.SellingPrice ?? row.Price ?? 0),
      stockLevel: Number(row.StockLevel ?? row.quantity ?? row.Quantity ?? row.Stock ?? 0),
      threshold: Number(row.threshold ?? row.Threshold ?? 10),
      coverImage: row.coverImage || row.CoverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
    };
  }

  async searchBook(
    filter: BookFilter,
    pagination: { limit: number; offset: number }
  ): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(pagination.limit);
    const finalOffset = Number(pagination.offset);

    let query = "SELECT books.*, GROUP_CONCAT(DISTINCT Authors.AuthorName) as authors, Publishers.Name as publisher FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN LEFT JOIN Publishers ON books.PubID = Publishers.PubID WHERE 1=1";
    let countQuery = "SELECT COUNT(DISTINCT books.ISBN) as total FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN LEFT JOIN Publishers ON books.PubID = Publishers.PubID WHERE 1=1";
    const params: any[] = [];

    if (filter.title) {
      query += " AND (books.title LIKE ? OR Publishers.Name LIKE ? OR EXISTS (SELECT 1 FROM Authors A2 WHERE A2.BookISBN = books.ISBN AND A2.AuthorName LIKE ?))";
      countQuery += " AND (books.title LIKE ? OR Publishers.Name LIKE ? OR EXISTS (SELECT 1 FROM Authors A2 WHERE A2.BookISBN = books.ISBN AND A2.AuthorName LIKE ?))";
      params.push(`%${filter.title}%`, `%${filter.title}%`, `%${filter.title}%`);
    }

    if (filter.category && filter.category.length > 0) {
      const placeholders = filter.category.map(() => "?").join(", ");
      query += ` AND books.category IN (${placeholders})`;
      countQuery += ` AND books.category IN (${placeholders})`;
      params.push(...filter.category);
    }

    if (filter.author) {
      query += " AND Authors.AuthorName LIKE ?"; 
      countQuery += " AND Authors.AuthorName LIKE ?";
      params.push(`%${filter.author}%`);
    }

    query += " GROUP BY books.ISBN";

    console.log(`[Mysql] searchBook query: ${query}`);

    const [rows] = await pool.query<RowDataPacket[]>(
      query + " LIMIT ? OFFSET ?",
      [...params, finalLimit, finalOffset]
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      countQuery,
      params
    );

    const total = countResult[0].total;
    const books = rows.map(row => this.mapRowToBook(row));

    return { books, total };
  }

  async updateBookByISBN(
    ISBN: string,
    updates: { sellingPrice?: number; stockLevel?: number; threshold?: number }
  ): Promise<string | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.sellingPrice !== undefined) {
      fields.push("sellingPrice = ?");
      values.push(updates.sellingPrice);
    }
    if (updates.stockLevel !== undefined) {
      fields.push("stockLevel = ?");
      values.push(updates.stockLevel);
    }
    if (updates.threshold !== undefined) {
      fields.push("threshold = ?");
      values.push(updates.threshold);
    }

    if (fields.length === 0) {
      return "No updates provided";

    }

    values.push(ISBN);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE books SET ${fields.join(", ")} WHERE ISBN = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    return "Book updated successfully";
  }

  async getBookByISBN(ISBN: string): Promise<Book | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT books.*, GROUP_CONCAT(DISTINCT Authors.AuthorName) as authors, Publishers.Name as publisher FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN LEFT JOIN Publishers ON books.PubID = Publishers.PubID WHERE books.ISBN = ? GROUP BY books.ISBN",
      [ISBN]
    );
    if (rows.length === 0) return null;
    return this.mapRowToBook(rows[0]);
  }

  async listAllBooks({
    limit,
    offset,
  }: {
    limit: number | string;
    offset: number | string;
  }): Promise<{ books: Book[]; total: number }> {
    const finalLimit = Number(limit);
    const finalOffset = Number(offset);
    console.log(
      `[Mysql] listAllBooks called with limit: ${finalLimit}, offset: ${finalOffset}`
    );
    return new Promise(async (resolve, reject) => {
      try {
        const [rowsResult, countResult] = await Promise.all([
          pool.query<RowDataPacket[]>(
            "SELECT books.*, GROUP_CONCAT(DISTINCT Authors.AuthorName) as authors, Publishers.Name as publisher FROM books LEFT JOIN Authors ON books.ISBN = Authors.BookISBN LEFT JOIN Publishers ON books.PubID = Publishers.PubID GROUP BY books.ISBN LIMIT ? OFFSET ?",
            [finalLimit, finalOffset]
          ),
          pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM books"),
        ]);

        const rows = rowsResult[0] as any[]; // RowDataPacket[]
        const total = (countResult[0] as RowDataPacket[])[0].total;

        console.log(
          `[Mysql] listAllBooks retrieved ${rows.length} books. Total count: ${total}`
        );
        const books = rows.map(row => this.mapRowToBook(row));
        resolve({ books, total });
      } catch (error) {
        console.error("[Mysql] Error in listAllBooks:", error);
        reject(error);
      }
    });
  }

  private async getOrCreatePublisher(connection: any, publisherName: string): Promise<number> {
    const [rows] = await connection.execute(
      "SELECT PubID FROM Publishers WHERE Name = ?",
      [publisherName]
    );

    if (rows.length > 0) {
      return rows[0].PubID;
    }

    const [result] = await connection.execute(
      "INSERT INTO Publishers (PublisherName, Address, Phone) VALUES (?, 'Unknown Address', '000-000-0000')",
      [publisherName]
    );
    return result.insertId;
  }

  async createNEWBook(book: Book): Promise<Book> {
    const {
      ISBN,
      title,
      authors,
      publisher,
      publicationYear,
      sellingPrice,
      category,
      stockLevel,
      threshold,
      coverImage,
    } = book;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

   
        let pubIdToUse = await this.getOrCreatePublisher(connection, book.publisher as string);
      

      // If still no PubID, maybe default to 1 or throw specific error, 
      // but getOrCreatePublisher should handle it if publisher name exists.
      // If neither PubID nor publisher name, we might have an issue if DB requires it.
      // Assuming DB requires it based on error "Foreign Key Constraint".

      await connection.execute(
        "INSERT INTO books (ISBN, title, Pub_Year, sellingPrice, category, stockLevel, threshold, PubID, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          ISBN,
          title,
          publicationYear,
          sellingPrice,
          category,
          stockLevel,
          threshold ?? 10,
          pubIdToUse,
          coverImage || null
        ]
      );

      if (authors && Array.isArray(authors) && authors.length > 0) {
        for (const author of authors) {
          await connection.execute(
            "INSERT INTO Authors (AuthorName, BookISBN) VALUES (?, ?)",
            [author, ISBN]
          );
        }
      }

      await connection.commit();
      return { ...book, PubID: pubIdToUse };
    } catch (error: any) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  }
}

