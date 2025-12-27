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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-foreground mb-2">Book not found</h2>
            <Link to="/customer/home" className="text-primary hover:text-primary/80">
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
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/customer/home')}
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </button>

        {/* Book Details */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <img
                  src={book.coverImage?.startsWith('http') ? book.coverImage : `http://localhost:3000/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';
                  }}
                />
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-lg mb-3">
                  {book.category}
                </span>
                <h1 className="text-foreground mb-4">{book.title}</h1>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <span className="text-foreground">Author(s):</span> {book.authors?.join(', ')}
                  </p>
                  <p>
                    <span className="text-foreground">Publisher:</span> {book.publisher}
                  </p>
                  <p>
                    <span className="text-foreground">Publication Year:</span> {book.publicationYear}
                  </p>
                  <p>
                    <span className="text-foreground">ISBN:</span> {book.ISBN}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <h2 className="text-foreground mb-4">Pricing & Availability</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-foreground">${book.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    {book.stockLevel > 0 ? (
                      <div className="flex items-center text-success">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>In Stock ({book.stockLevel} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-destructive">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="text-muted-foreground">
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
                    className="w-24 px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleAddToCart}
                    disabled={book.stockLevel === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${book.stockLevel > 0
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>

                  <div className="text-foreground">
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
