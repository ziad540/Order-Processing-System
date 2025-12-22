import { User } from "../../../../shared/types.js";

export interface UserDao {
  getById(id: number): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;

  createUser(input: User): Promise<User>;


}
