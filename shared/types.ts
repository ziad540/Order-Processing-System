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
  id: number;
  username: string;
  email: string;
  phones: string[];
}


export interface Customer extends User 
{
  shippingAddress: string;
  FirstName: string;
  LastName: string;
    
}

export interface Admin extends User
{

}


export interface UserSignupDetails {
  username: string;
  email: string;
  password: string;
  phones: string[];
}

export interface CustomerSignupDetails  {
  firstName: string;
  lastName: string;
  shippingAddress: string;
}

export interface AdminSignupDetails  {
  // add admin-specific fields later if needed
}
