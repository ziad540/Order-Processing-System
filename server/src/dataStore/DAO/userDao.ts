import { User } from "../../../../shared/types.js";

export interface UserDao {
  getById(id: number): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  getuserByEmail(email: string): Promise<User | null>;
  getUserPhones(userId: number): Promise<string[]>;
  createUser(input: Omit<User, "UserID">): Promise<User>;
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  getUserRole(userId: number): Promise<"Admin" | "Customer">;
}
