import { Customer } from "../../../../shared/types.js";
import {CustomerSignupDetails } from "../../../../shared/types.js";


export interface CustomerDao {
  getById(userId: number): Promise<Customer | null>;
    getByUsername(username: string): Promise<Customer | null>;
    getByEmail(email: string): Promise<Customer | null>;

  createCustomer(
    userId: number,
    input: CustomerSignupDetails
  ): Promise<Customer>;
}
