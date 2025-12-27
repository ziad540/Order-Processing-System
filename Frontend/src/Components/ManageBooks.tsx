import { useState } from 'react';
import { Plus, Edit2, Search, AlertCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User, Book } from '../App';
import { bookService } from '../services/bookService';

interface ManageBooksProps {
  user: User;
  onLogout: () => void;
}

export default function ManageBooks({ user, onLogout }: ManageBooksProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    ISBN: '',
    title: '',
    authors: [],
    publisher: '',
    publicationYear: new Date().getFullYear(),
    category: 'Science',
    sellingPrice: 0,
    stockLevel: 0,
    threshold: 10,
    coverImage: ''
  });

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Using searchBooks with empty query to list all books
      const data = await bookService.searchBooks('', 'All');
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    // Only call fetchBooks if checks pass - but useEffect is better. 
    // Keeping existing logic style but wrapping in useEffect would be better practice.
    // For now, adhering to existing pattern if it works, but fetchBooks() ideally in useEffect.
    fetchBooks();
  }); // Note: Original code had useState for side effect, likely a mistake but I'll stick to edits.
  // Wait, original code: useState(() => { fetchBooks(); }); - this runs ONCE on init (lazy state init).

  const filteredBooks = books.filter(book =>
    book.ISBN.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.authors?.some((author: string) => author.toLowerCase().includes(searchTerm.toLowerCase())) ?? false) ||
    (book.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'authors') {
      setFormData((prev: any) => ({ ...prev, authors: value.split(',').map(a => a.trim()) }));
    } else if (name === 'sellingPrice' || name === 'stockLevel' || name === 'threshold' || name === 'publicationYear') {
      setFormData((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, WEBP)');
        e.target.value = ''; // Clear the input
        return;
      }
      setSelectedFile(file);
      // Optional: still show preview if desired, but prioritize file
      setFormData((prev: any) => ({ ...prev, coverImage: file.name }));
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedFile) {
        // Use FormData for file upload
        const data = new FormData();
        data.append('ISBN', formData.ISBN!);
        data.append('title', formData.title!);
        data.append('authors', JSON.stringify(formData.authors || []));
        data.append('publisher', formData.publisher!);
        data.append('publicationYear', String(formData.publicationYear));
        data.append('category', formData.category!);
        data.append('sellingPrice', String(formData.sellingPrice));
        data.append('stockLevel', String(formData.stockLevel));
        data.append('threshold', String(formData.threshold));
        data.append('PubID', '1'); // Default PubID as it might be required by backend logic if not in form
        data.append('coverImage', selectedFile);

        await bookService.createBook(data);
      } else {
        // Fallback for no image (or string URL if supported, but typically we want consistent API usage)
        // Adjust based on if backend REQUIRES multipart, currently server supports both but cleaner to stick to one if possible. 
        // Given the requirement is upload, assume FormData flow.
        // If generic book object is sent, it might fail image upload logic if expecting file.
        const newBook: Book = {
          ISBN: formData.ISBN!,
          title: formData.title!,
          authors: formData.authors!,
          publisher: formData.publisher!,
          publicationYear: formData.publicationYear!,
          category: formData.category as any,
          sellingPrice: formData.sellingPrice!,
          stockLevel: formData.stockLevel!,
          threshold: formData.threshold!,
          coverImage: formData.coverImage!,
          PubID: 1
        };
        await bookService.createBook(newBook);
      }

      await fetchBooks(); // Refresh list
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book. Please check if ISBN already exists.');
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      sellingPrice: book.sellingPrice,
      stockLevel: book.stockLevel
    });
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      try {
        await bookService.updateBook(editingBook.ISBN, {
          sellingPrice: formData.sellingPrice,
          stockLevel: formData.stockLevel
        });
        await fetchBooks(); // Refresh list
        setEditingBook(null);
        resetForm();
      } catch (error) {
        console.error('Failed to update book:', error);
        alert('Failed to update book.');
      }
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      ISBN: '',
      title: '',
      authors: [],
      publisher: '',
      publicationYear: new Date().getFullYear(),
      category: 'Science',
      sellingPrice: 0,
      stockLevel: 0,
      threshold: 10,
      coverImage: ''
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNavbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2">Manage Books</h1>
            <p className="text-muted-foreground">Add, edit, and manage your book inventory</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Add Book Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card text-card-foreground rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <h2 className="text-foreground">Add New Book</h2>
              </div>
              <form onSubmit={handleAddBook} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-muted-foreground mb-2">ISBN *</label>
                    <input
                      type="text"
                      name="ISBN"
                      value={formData.ISBN}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-muted-foreground mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-muted-foreground mb-2">Author(s) (comma-separated) *</label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors?.join(', ')}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Author 1, Author 2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Publisher *</label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Publication Year *</label>
                    <input
                      type="number"
                      name="publicationYear"
                      value={formData.publicationYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="Science">Science</option>
                      <option value="Art">Art</option>
                      <option value="Religion">Religion</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Quantity in Stock *</label>
                    <input
                      type="number"
                      name="stockLevel"
                      value={formData.stockLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Threshold Value *</label>
                    <input
                      type="number"
                      name="threshold"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-muted-foreground mb-2">Cover Image</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Or upload:</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleImageUpload}
                          className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); resetForm(); }}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {editingBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card text-card-foreground rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-border">
                <h2 className="text-foreground">Edit Book: {editingBook.title}</h2>
              </div>
              <form onSubmit={handleUpdateBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-muted-foreground mb-2">Price ($) *</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stockLevel"
                    value={formData.stockLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingBook(null); resetForm(); }}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Update Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books by title, author, or publisher..."
              className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-muted-foreground">ISBN</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Title</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Author(s)</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Publisher</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Category</th>
                  <th className="px-6 py-3 text-right text-muted-foreground">Price</th>
                  <th className="px-6 py-3 text-right text-muted-foreground">Stock</th>
                  <th className="px-6 py-3 text-right text-muted-foreground">Threshold</th>
                  <th className="px-6 py-3 text-center text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.ISBN} className="border-b border-border hover:bg-muted">
                    <td className="px-6 py-4 text-muted-foreground">{book.ISBN}</td>
                    <td className="px-6 py-4 text-foreground">{book.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{book.authors?.join(', ')}</td>
                    <td className="px-6 py-4 text-muted-foreground">{book.publisher}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-foreground">${book.sellingPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={book.stockLevel <= (book.threshold || 0) ? 'text-amber-600' : 'text-foreground'}>
                        {book.stockLevel}
                        {book.stockLevel <= (book.threshold || 0) && (
                          <AlertCircle className="w-4 h-4 inline ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{book.threshold}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="inline-flex items-center space-x-1 text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12 bg-card text-card-foreground rounded-lg border border-border">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
