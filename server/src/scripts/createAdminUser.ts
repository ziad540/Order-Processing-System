import { initDb, db, pool } from '../dataStore/index.js';
import { hashPassword } from '../../utils/passwordUtils.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  try {
    await initDb();
    
    const username = 'admin';
    const email = 'admin@bookstore.com';
    const password = 'password123';
    
    console.log(`Checking/Creating admin user: ${email} / ${password}`);
    
    const existing = await db.getuserByEmail(email);
    
    if (existing) {
      console.log(`User with email ${email} already exists (ID: ${existing.UserID}).`);
      
      // Update password to ensure it matches 'password123'
      const hashedPassword = await hashPassword(password);
      await db.updatePassword(existing.UserID, hashedPassword);
      console.log('Password updated to "password123".');
      
      // Check if in Admins table
      const role = await db.getUserRole(existing.UserID);
      if (role !== 'Admin') {
         console.log('User is not in Admins table. Promoting...');
         await pool.execute('INSERT INTO Admins (UserID) VALUES (?)', [existing.UserID]);
         console.log('User promoted to Admin.');
      } else {
          console.log('User is already an Admin.');
      }
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await hashPassword(password);
      await db.createNewAdmin({
        Username: username,
        email: email,
        Password: hashedPassword,
        phones: ['0000000000'],
        UserID: 0 // Ignored
      });
      console.log('New Admin user created.');
    }
    
    console.log('Done. You can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
