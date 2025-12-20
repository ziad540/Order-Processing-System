/**
 * this is example of user controller 
 * dodo bos hena on this structure or use the default structure (service, controller) only 
 */





// import { Request, Response } from 'express';
// import { UserService } from './user.service.js';

// export class UserController {
//   private userService = new UserService();

//   // Use arrow function to bind 'this' automatically
//   register = async (req: Request, res: Response) => {
//     try {
//       const user = await this.userService.createUser(req.body);
//       res.status(201).json(user);
//     } catch (err: any) {
//       if (err.message === 'User already exists') {
//         return res.status(409).json({ error: 'Email already in use' });
//       }
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

//   // Use arrow function to bind 'this' automatically
//   login = async (req: Request, res: Response) => {
//     res.send('Login endpoint');
//   }

//   // Use arrow function to bind 'this' automatically
//   getProfile = async (req: Request, res: Response) => {
//     res.send('Get Profile endpoint');
//   }
// }
