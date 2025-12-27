export interface Book {
    ISBN: string;
    title: string;
    authors?: string[];
    publicationYear: number;
    sellingPrice: number;
    category: string;
    stockLevel: number;
    threshold?: number;
}


export  interface User {
  UserID: number;
  Username: string;
  email: string;
  phones: string[];
  Password: string;
}


export interface Customer extends User 
{
  ShippingAddress: string;
  FirstName: string;
  LastName: string;
    
}

export interface Admin extends User
{


  
}


export interface CartItem {
  quantity: number;
  book: {
    ISBN: string;
    title: string;
    authors?: string[];
    sellingPrice: number;
    category: string;
  };
}

export interface ShoppingCart {
  cartId: number;
  UserID: number;
  items: CartItem[];
}


export interface jwtObject {
  UserID: number;
  role: "Admin" | "Customer";
}

export interface BlackListedToken {
  token: string;
  blacklistedAt: Date;
}




