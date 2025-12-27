/*
import { z } from 'zod';

// ----- Auth Schemas -----
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
});

export const signupSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        address: z.string().min(1, 'Address is required'),
        phones: z.array(z.string()).min(1, 'At least one phone number is required')
    })
});

// ----- Book Schemas -----
export const createBookSchema = z.object({
    body: z.object({
        ISBN: z.string().min(10, 'ISBN must be at least 10 characters').max(20),
        title: z.string().min(1, 'Title is required'),
        authors: z.union([z.array(z.string()), z.string().transform(s => JSON.parse(s))]).optional(),
        publisher: z.string().min(1, 'Publisher is required'),
        publicationYear: z.coerce.number().int().min(1000).max(new Date().getFullYear() + 1),
        category: z.enum(['Science', 'Art', 'Religion', 'History', 'Geography', 'Technology', 'Fiction']),
        sellingPrice: z.coerce.number().positive('Price must be positive'),
        stockLevel: z.coerce.number().int().nonnegative('Stock level cannot be negative'),
        threshold: z.coerce.number().int().nonnegative('Threshold cannot be negative'),
        PubID: z.coerce.number().int().optional()
    })
});

export const updateBookSchema = z.object({
    params: z.object({
        isbn: z.string()
    }),
    body: z.object({
        sellingPrice: z.coerce.number().positive('Price must be positive').optional(),
        stockLevel: z.coerce.number().int().nonnegative('Stock level cannot be negative').optional()
    })
});

// ----- Checkout Schemas -----
export const purchaseSchema = z.object({
    body: z.object({
        cardNumber: z.string().regex(/^\d{13,19}$/, 'Invalid card number format')
    })
});

// ----- Replenishment Schemas -----
export const updateReplenishmentStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid order ID')
    }),
    body: z.object({
        status: z.enum(['Pending', 'Confirmed'])
    })
});

// ----- Shopping Cart Schemas -----
export const cartItemSchema = z.object({
    body: z.object({
        ISBN: z.string().min(10).max(20),
        CartID: z.coerce.number().int().optional()
    })
});

export const updateQuantitySchema = z.object({
    body: z.object({
        ISBN: z.string().min(10).max(20),
        newQuantity: z.coerce.number().int().nonnegative('Quantity cannot be negative')
    })
});
*/
