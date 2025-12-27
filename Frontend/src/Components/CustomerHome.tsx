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

  const categories = ['All', 'Science', 'Technology', 'Fiction', 'History', 'Geography', 'Art'];

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
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Discover our collection of academic books</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title, Author or Publisher..."
              className="w-full pl-12 pr-4 py-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-card text-foreground border border-border hover:border-primary hover:text-primary'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {books.length} {books.length === 1 ? 'book' : 'books'}
            {isLoading && <span className="ml-2 text-primary">Loading...</span>}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.ISBN} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <Link to={`/customer/book/${book.ISBN}`}>
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={book.coverImage?.startsWith('http') ? book.coverImage : `http://localhost:3000/${book.coverImage}`}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';
                    }}
                  />
                </div>
              </Link>

              {/* Book Info */}
              <div className="p-4">
                <Link to={`/customer/book/${book.ISBN}`}>
                  <h3 className="text-foreground mb-2 hover:text-primary line-clamp-2">
                    {book.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground mb-1 line-clamp-1">
                  {book.authors?.join(', ') || 'Unknown Author'}
                </p>

                <p className="text-muted-foreground mb-2">{book.publisher}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    {book.category}
                  </span>
                  <span className="text-muted-foreground">ISBN: {book.ISBN ? book.ISBN.slice(-6) : 'N/A'}</span>
                </div>

                {/* Availability */}
                < div className="mb-3" >
                  {
                    book.stockLevel > 0 ? (
                      <div className="flex items-center text-success">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>In Stock ({book.stockLevel} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-destructive">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>Out of Stock</span>
                      </div>
                    )
                  }
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-foreground">${Number(book.sellingPrice || 0).toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stockLevel === 0 || (cart.find(item => item.book.ISBN === book.ISBN)?.quantity || 0) >= book.stockLevel}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${book.stockLevel > 0 && (cart.find(item => item.book.ISBN === book.ISBN)?.quantity || 0) < book.stockLevel
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{(cart.find(item => item.book.ISBN === book.ISBN)?.quantity || 0) >= book.stockLevel ? 'Max Added' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
          }
        </div >

        {/* No Results */}
        {
          !isLoading && books.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )
        }
      </div >
    </div >
  );
}
