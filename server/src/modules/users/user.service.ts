
/**
 * this is example of user service 
 */


// import { pool } from '../../dataStore/index.js';
// import bcrypt from 'bcrypt';

// export class UserService {
//   async createUser(user: any) {
//     const { name, email, password } = user;
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert into database
//     const text = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email';
//     const values = [name, email, hashedPassword];

//     try {
//       const res = await pool.query(text, values);
//       return res.rows[0];
//     } catch (err: any) {
//       if (err.code === '23505') { // Unique violation (e.g. duplicate email)
//         throw new Error('User already exists');
//       }
//       throw err;
//     }
//   }
// }
