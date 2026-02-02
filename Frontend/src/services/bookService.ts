import axios from 'axios';
import { Book } from '../App';
import { getAuthHeaders } from './authService';

const API_URL = 'http://localhost:3000/books';

export const bookService = {
  searchBooks: async (query: string, category: string): Promise<Book[]> => {
    try {
      const isSearch = query.trim() !== '' || category !== 'All';

      let url = `${API_URL}/list`;
      let params = { limit: 1000 };

      if (isSearch) {
        url = `${API_URL}/search`;
        const payload: any = {};
        if (query.trim() !== '') payload.title = query;
        if (category !== 'All') payload.category = [category];

        const response = await axios.post(url, payload, { params });
        console.log('API Response (Search/List):', response.data);
        return response.data.data || [];
      } else {
        const response = await axios.get(url, { params });
        console.log('API Response (List):', response.data);
        return response.data.data || [];
      }

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching books:', error);
      return [];
    }
  },

  getBookByISBN: async (isbn: string): Promise<Book | null> => {
    try {
      const response = await axios.get(`${API_URL}/${isbn}`);
      return response.data.book;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching book with ISBN ${isbn}:`, error);
      throw error;
    }
  },

  createBook: async (book: Book | FormData): Promise<Book> => {
    try {
      const authHeaders = getAuthHeaders();
      const contentHeaders = book instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await axios.post(`${API_URL}/create`, book, {
        headers: {
          ...contentHeaders,
          ...authHeaders
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (isbn: string, updates: Partial<Book> | FormData): Promise<void> => {
    try {
      const authHeaders = getAuthHeaders();
      const contentHeaders = updates instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
      await axios.put(`${API_URL}/update/${isbn}`, updates, {
        headers: {
          ...contentHeaders,
          ...authHeaders
        }
      });
    } catch (error) {
      console.error(`Error updating book with ISBN ${isbn}:`, error);
      throw error;
    }
  }
};
