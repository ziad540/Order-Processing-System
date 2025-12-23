import { Customer } from "../../../../shared/types.js";


export interface CustomerDao {
  getCustomerById(userId: number): Promise<Customer | null>;
    getCustomerByUsername(username: string): Promise<Customer | null>;
    getCustomerByEmail(email: string): Promise<Customer | null>;

  createCustomer(
    UserID: number,
input: {
        ShippingAddress: string;
        FirstName: string;
        LastName: string;
}
  ): Promise<Customer>;
}
