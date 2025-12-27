import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ErrorHandler] Error caught:', {
    message: err.message,
    errno: err.errno,
    sqlState: err.sqlState,
    stack: err.stack,
  });

  // MySQL Error Mapping
  const mysqlErrorMapper: Record<number, (error: any) => string> = {
    1062: (error) => {
      // Duplicate entry 'value' for key 'table.field'
      const match = error.message.match(/Duplicate entry '(.+)' for key '(.+)'/);
      if (match) {
        const [_, value, key] = match;
        const fieldName = key.split('.').pop() || key;
        const humanFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return `The ${humanFieldName} '${value}' is already in use. Please try another one.`;
      }
      return 'This information is already registered in our system.';
    },
    1452: () => 'We couldn\'t find a related record for this operation. Please verify your selection.',
    1451: () => 'This item cannot be modified or deleted because it is being used by other parts of the system.',
    1054: () => 'A system error occurred while processing a data field. Our team has been notified.',
    1364: (error) => {
      // Field 'field_name' doesn't have a default value
      const match = error.message.match(/Field '(.+)' doesn't have a default value/);
      const field = match ? match[1] : 'required field';
      return `The field '${field}' is mandatory and cannot be empty.`;
    }
  };

  if (err.errno && mysqlErrorMapper[err.errno]) {
    const userFriendlyMessage = mysqlErrorMapper[err.errno](err);
    return res.status(err.errno === 1062 || err.errno === 1451 || err.errno === 1452 ? 400 : 500).json({
      error: userFriendlyMessage,
      type: 'DatabaseError'
    });
  }

  // Handle other types of errors
  const message = err.message || 'An unexpected error occurred. Please try again later.';
  const status = err.status || 500;

  res.status(status).json({
    error: message,
    type: err.name || 'ServerError'
  });
};
