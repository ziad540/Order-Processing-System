export interface Book {
    ISBN: string;
    title: string;
    authors?: string[];
    publicationYear: number;
    sellingPrice: number;
    category: string;
    stockLevel: number;
    threshold?: number;
}



