import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User, Book, CartItem } from '../App';
import { bookService } from '../services/bookService';

interface CustomerHomeProps {
  user: User;
  onLogout: () => void;
  addToCart: (book: Book) => void;
  cart: CartItem[];
}

export default function CustomerHome({ user, onLogout, addToCart, cart }: CustomerHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Science', 'Art', 'Religion', 'History', 'Geography'];

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const results = await bookService.searchBooks(searchTerm, selectedCategory);
        setBooks(results);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Browse Books</h1>
          <p className="text-gray-600">Discover our collection of academic books</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ISBN, title, author, or publisher..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            Showing {books.length} {books.length === 1 ? 'book' : 'books'}
            {isLoading && <span className="ml-2 text-indigo-600">Loading...</span>}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.isbn} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <Link to={`/customer/book/${book.isbn}`}>
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Book Info */}
              <div className="p-4">
                <Link to={`/customer/book/${book.isbn}`}>
                  <h3 className="text-gray-900 mb-2 hover:text-indigo-600 line-clamp-2">
                    {book.title}
                  </h3>
                </Link>

                <p className="text-gray-600 mb-1 line-clamp-1">
                  {book.authors.join(', ')}
                </p>

                <p className="text-gray-500 mb-2">{book.publisher}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                    {book.category}
                  </span>
                  <span className="text-gray-500">ISBN: {book.isbn.slice(-6)}</span>
                </div>

                {/* Availability */}
                <div className="mb-3">
                  {book.quantity > 0 ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>In Stock ({book.quantity} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">${book.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.quantity === 0}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${book.quantity > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
