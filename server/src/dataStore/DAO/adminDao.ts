import { Admin } from "../../../../shared/types.js";
  export interface adminDao {
    getAdminById(id: number): Promise<Admin | null>;
    getAdminByUsername(username: string): Promise<Admin | null>;
    getAdminByEmail(email: string): Promise<Admin | null>;
    createNewAdmin(admin: Admin): Promise<Admin>;
    findAdminbyUserId(userId: number): Promise<boolean>;
    
  }