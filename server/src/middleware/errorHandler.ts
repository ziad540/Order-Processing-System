import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.errno === 1452) {
    return res.status(400).json({ error: 'Invalid Foreign Key: The referenced resource does not exist.' });
  }

  if (err.errno === 1062) {
    return res.status(409).json({ error: 'Duplicate entry: This resource already exists.' });
  }

  if (err.errno === 1451) {
    return res.status(409).json({ error: 'Conflict: Cannot delete or update because this resource is referenced by others.' });
  }

  if (err.errno === 1054) {
    return res.status(500).json({ error: 'Database Error: Unknown column encountered.' });
  }

  res.status(500).json({ error: 'Something went wrong!' });
};
