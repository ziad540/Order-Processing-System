import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User, Book, CartItem } from '../App';
import { useEffect } from 'react';
import { bookService } from '../services/bookService';

interface BookDetailsProps {
  user: User;
  onLogout: () => void;
  addToCart: (book: Book, quantity: number) => void;
  cart: CartItem[];
}

export default function BookDetails({ user, onLogout, addToCart, cart }: BookDetailsProps) {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!isbn) return;
      setIsLoading(true);
      try {
        const data = await bookService.getBookByISBN(isbn);
        setBook(data);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [isbn]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-gray-900 mb-2">Book not found</h2>
            <Link to="/customer/home" className="text-indigo-600 hover:text-indigo-700">
              Return to browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, quantity);
    navigate('/customer/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/customer/home')}
          className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg mb-3">
                  {book.category}
                </span>
                <h1 className="text-gray-900 mb-4">{book.title}</h1>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="text-gray-900">Author(s):</span> {book.authors?.join(', ')}
                  </p>
                  <p>
                    <span className="text-gray-900">Publisher:</span> {book.publisher}
                  </p>
                  <p>
                    <span className="text-gray-900">Publication Year:</span> {book.publicationYear}
                  </p>
                  <p>
                    <span className="text-gray-900">ISBN:</span> {book.ISBN}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-gray-900 mb-4">Pricing & Availability</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Price:</span>
                    <span className="text-gray-900">${book.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Availability:</span>
                    {book.stockLevel > 0 ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>In Stock ({book.stockLevel} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="text-gray-700">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={book.stockLevel}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(book.stockLevel, parseInt(e.target.value) || 1)))}
                    disabled={book.stockLevel === 0}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={book.stockLevel === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${book.stockLevel > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>

                  <div className="text-gray-900">
                    Subtotal: ${(book.sellingPrice * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
