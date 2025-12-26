export interface Book {
    ISBN: string;
    title: string;
    authors?: string[];
    publisher?: string;
    publicationYear: number;
    sellingPrice: number;
    category: string;
    stockLevel: number;
    threshold?: number;
    coverImage?: string;
}

export interface BookFilter {
    title?: string;
    category?: string[];
    author?: string;
}



