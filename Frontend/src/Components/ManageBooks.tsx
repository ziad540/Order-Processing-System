import { useState } from 'react';
import { Plus, Edit2, Search, AlertCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User, Book } from '../App';
import { mockBooks as initialBooks } from '../data/mockData';

interface ManageBooksProps {
  user: User;
  onLogout: () => void;
}

export default function ManageBooks({ user, onLogout }: ManageBooksProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    authors: [],
    publisher: '',
    publicationYear: new Date().getFullYear(),
    category: 'Science',
    price: 0,
    quantity: 0,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
  });

  const filteredBooks = books.filter(book =>
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'authors') {
      setFormData(prev => ({ ...prev, authors: value.split(',').map(a => a.trim()) }));
    } else if (name === 'price' || name === 'quantity' || name === 'threshold' || name === 'publicationYear') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: Book = {
      isbn: formData.isbn!,
      title: formData.title!,
      authors: formData.authors!,
      publisher: formData.publisher!,
      publicationYear: formData.publicationYear!,
      category: formData.category as any,
      price: formData.price!,
      quantity: formData.quantity!,
      threshold: formData.threshold!,
      coverImage: formData.coverImage!
    };
    setBooks([...books, newBook]);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      price: book.price,
      quantity: book.quantity
    });
  };

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      setBooks(books.map(book =>
        book.isbn === editingBook.isbn
          ? { ...book, price: formData.price!, quantity: formData.quantity! }
          : book
      ));
      setEditingBook(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      isbn: '',
      title: '',
      authors: [],
      publisher: '',
      publicationYear: new Date().getFullYear(),
      category: 'Science',
      price: 0,
      quantity: 0,
      threshold: 10,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Manage Books</h1>
            <p className="text-gray-600">Add, edit, and manage your book inventory</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Add Book Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900">Add New Book</h2>
              </div>
              <form onSubmit={handleAddBook} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Author(s) (comma-separated) *</label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors?.join(', ')}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Author 1, Author 2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Publisher *</label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Publication Year *</label>
                    <input
                      type="number"
                      name="publicationYear"
                      value={formData.publicationYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-gray-700 mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Quantity in Stock *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Threshold Value *</label>
                    <input
                      type="number"
                      name="threshold"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900">Edit Book: {editingBook.title}</h2>
              </div>
              <form onSubmit={handleUpdateBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingBook(null); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books by ISBN, title, author, or publisher..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">ISBN</th>
                  <th className="px-6 py-3 text-left text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-gray-700">Author(s)</th>
                  <th className="px-6 py-3 text-left text-gray-700">Publisher</th>
                  <th className="px-6 py-3 text-left text-gray-700">Category</th>
                  <th className="px-6 py-3 text-right text-gray-700">Price</th>
                  <th className="px-6 py-3 text-right text-gray-700">Stock</th>
                  <th className="px-6 py-3 text-right text-gray-700">Threshold</th>
                  <th className="px-6 py-3 text-center text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.isbn} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                    <td className="px-6 py-4 text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-600">{book.authors.join(', ')}</td>
                    <td className="px-6 py-4 text-gray-600">{book.publisher}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">${book.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={book.quantity <= book.threshold ? 'text-amber-600' : 'text-gray-900'}>
                        {book.quantity}
                        {book.quantity <= book.threshold && (
                          <AlertCircle className="w-4 h-4 inline ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{book.threshold}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
