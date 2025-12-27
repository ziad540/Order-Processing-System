import { initDb, db, pool } from '../dataStore/index.js';
import { hashPassword } from '../../utils/passwordUtils.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function debugUser() {
  try {
    await initDb();
    
    const email = 'sarah.admin@booksys.com';
    console.log(`Fetching user: ${email}`);
    
    const user = await db.getuserByEmail(email);
    
    if (!user) {
      console.log('User not found!');
    } else {
      console.log('User found:', user);
      
      // Check if password is a valid bcrypt hash (simple check)
      const isHash = user.Password.startsWith('$2b$') || user.Password.startsWith('$2a$');
      console.log(`Password in DB: ${user.Password}`);
      console.log(`Is valid bcrypt hash format? ${isHash}`);
      
      if (!isHash) {
          console.log('Password is NOT a valid hash. Updating to hash of "password123"...');
          const newHash = await hashPassword('password123');
          await db.updatePassword(user.UserID, newHash);
          console.log('Password updated.');
      }

      // Check Admin status
      const role = await db.getUserRole(user.UserID);
      console.log(`User Role: ${role}`);
      
      if (role !== 'Admin') {
          console.log('User is NOT an Admin. Fixing...');
          await pool.execute('INSERT INTO Admins (UserID) VALUES (?)', [user.UserID]);
          console.log('Added to Admins table.');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugUser();
