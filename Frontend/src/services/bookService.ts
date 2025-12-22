import { Book } from '../App';
import { mockBooks } from '../data/mockData';

export const bookService = {
  searchBooks: async (query: string, category: string): Promise<Book[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockBooks.filter(book => {
      const matchesSearch = 
        query === '' ||
        book.isbn.toLowerCase().includes(query.toLowerCase()) ||
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.authors.some(author => author.toLowerCase().includes(query.toLowerCase())) ||
        book.publisher.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = category === 'All' || book.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }
};
