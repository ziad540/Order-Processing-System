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
  cartId: number;
  isbn: string;
  quantity: number;
}

export interface ShoppingCart {
  cartId: number;
  userId: number;
  items: CartItem[];
}





