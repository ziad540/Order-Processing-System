import { Book, Order } from '../App';

export const mockBooks: Book[] = [
  {
    ISBN: '978-0-134-68599-1',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest'],
    publisher: 'MIT Press',
    publicationYear: 2022,
    category: 'Science',
    sellingPrice: 89.99,
    stockLevel: 25,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-262-03384-8',
    title: 'Artificial Intelligence: A Modern Approach',
    authors: ['Stuart Russell', 'Peter Norvig'],
    publisher: 'Pearson',
    publicationYear: 2021,
    category: 'Science',
    sellingPrice: 94.99,
    stockLevel: 18,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-13-468599-0',
    title: 'Database System Concepts',
    authors: ['Abraham Silberschatz', 'Henry F. Korth', 'S. Sudarshan'],
    publisher: 'McGraw-Hill',
    publicationYear: 2020,
    category: 'Science',
    sellingPrice: 79.99,
    stockLevel: 30,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-321-57351-3',
    title: 'The Art of Computer Programming',
    authors: ['Donald E. Knuth'],
    publisher: 'Addison-Wesley',
    publicationYear: 2019,
    category: 'Science',
    sellingPrice: 199.99,
    stockLevel: 8,
    threshold: 5,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-465-02414-8',
    title: 'The Renaissance: A Short History',
    authors: ['Paul Johnson'],
    publisher: 'Modern Library',
    publicationYear: 2020,
    category: 'History',
    sellingPrice: 24.99,
    stockLevel: 42,
    threshold: 20,
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-393-04002-9',
    title: 'A History of Western Philosophy',
    authors: ['Bertrand Russell'],
    publisher: 'W. W. Norton & Company',
    publicationYear: 2018,
    category: 'History',
    sellingPrice: 34.99,
    stockLevel: 35,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-142-00047-6',
    title: 'The Art Spirit',
    authors: ['Robert Henri'],
    publisher: 'Basic Books',
    publicationYear: 2021,
    category: 'Art',
    sellingPrice: 18.99,
    stockLevel: 50,
    threshold: 25,
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-500-28638-0',
    title: 'Art: The Definitive Visual Guide',
    authors: ['Andrew Graham-Dixon'],
    publisher: 'DK Publishing',
    publicationYear: 2022,
    category: 'Art',
    sellingPrice: 45.99,
    stockLevel: 28,
    threshold: 12,
    coverImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-19-280617-2',
    title: 'World Religions: A Historical Approach',
    authors: ['S. A. Nigosian'],
    publisher: 'Oxford University Press',
    publicationYear: 2020,
    category: 'Religion',
    sellingPrice: 59.99,
    stockLevel: 20,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-06-050602-2',
    title: 'The Sacred and the Profane',
    authors: ['Mircea Eliade'],
    publisher: 'Harcourt Brace',
    publicationYear: 2019,
    category: 'Religion',
    sellingPrice: 16.99,
    stockLevel: 38,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-691-14267-2',
    title: 'Guns, Germs, and Steel',
    authors: ['Jared Diamond'],
    publisher: 'W. W. Norton & Company',
    publicationYear: 2017,
    category: 'Geography',
    sellingPrice: 27.99,
    stockLevel: 45,
    threshold: 20,
    coverImage: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-19-968533-0',
    title: 'The Oxford Companion to World Exploration',
    authors: ['David Buisseret'],
    publisher: 'Oxford University Press',
    publicationYear: 2021,
    category: 'Geography',
    sellingPrice: 65.99,
    stockLevel: 15,
    threshold: 8,
    coverImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-13-235088-4',
    title: 'Operating System Concepts',
    authors: ['Abraham Silberschatz', 'Peter B. Galvin', 'Greg Gagne'],
    publisher: 'Wiley',
    publicationYear: 2021,
    category: 'Science',
    sellingPrice: 84.99,
    stockLevel: 22,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-1-118-06333-0',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: ['Robert C. Martin'],
    publisher: 'Prentice Hall',
    publicationYear: 2020,
    category: 'Science',
    sellingPrice: 49.99,
    stockLevel: 33,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=600&fit=crop'
  },
  {
    ISBN: '978-0-451-52493-5',
    title: 'Sapiens: A Brief History of Humankind',
    authors: ['Yuval Noah Harari'],
    publisher: 'Harper',
    publicationYear: 2018,
    category: 'History',
    sellingPrice: 22.99,
    stockLevel: 60,
    threshold: 30,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop'
  }
];

export const mockOrders: Order[] = [
  {
    orderNumber: 'ORD-2024-001',
    orderDate: '2024-12-15',
    items: [
      { isbn: '978-0-134-68599-1', title: 'Introduction to Algorithms', quantity: 1, price: 89.99 },
      { isbn: '978-0-13-468599-0', title: 'Database System Concepts', quantity: 2, price: 79.99 }
    ],
    totalPrice: 249.97,
    status: 'Completed'
  },
  {
    orderNumber: 'ORD-2024-002',
    orderDate: '2024-12-10',
    items: [
      { isbn: '978-0-262-03384-8', title: 'Artificial Intelligence: A Modern Approach', quantity: 1, price: 94.99 }
    ],
    totalPrice: 94.99,
    status: 'Completed'
  },
  {
    orderNumber: 'ORD-2024-003',
    orderDate: '2024-12-05',
    items: [
      { isbn: '978-0-142-00047-6', title: 'The Art Spirit', quantity: 1, price: 18.99 },
      { isbn: '978-0-500-28638-0', title: 'Art: The Definitive Visual Guide', quantity: 1, price: 45.99 }
    ],
    totalPrice: 64.98,
    status: 'Completed'
  },
  {
    orderNumber: 'ORD-2024-004',
    orderDate: '2024-11-28',
    items: [
      { isbn: '978-0-451-52493-5', title: 'Sapiens: A Brief History of Humankind', quantity: 3, price: 22.99 }
    ],
    totalPrice: 68.97,
    status: 'Completed'
  }
];

export const mockPublisherOrders = [
  {
    id: 'PO-001',
    publisherName: 'MIT Press',
    isbn: '978-0-134-68599-1',
    bookTitle: 'Introduction to Algorithms',
    quantity: 50,
    orderDate: '2024-12-18',
    status: 'Pending' as const
  },
  {
    id: 'PO-002',
    publisherName: 'McGraw-Hill',
    isbn: '978-0-13-468599-0',
    bookTitle: 'Database System Concepts',
    quantity: 30,
    orderDate: '2024-12-17',
    status: 'Pending' as const
  },
  {
    id: 'PO-003',
    publisherName: 'Addison-Wesley',
    isbn: '978-0-321-57351-3',
    bookTitle: 'The Art of Computer Programming',
    quantity: 20,
    orderDate: '2024-12-16',
    status: 'Confirmed' as const
  },
  {
    id: 'PO-004',
    publisherName: 'Oxford University Press',
    isbn: '978-0-19-280617-2',
    bookTitle: 'World Religions: A Historical Approach',
    quantity: 25,
    orderDate: '2024-12-15',
    status: 'Confirmed' as const
  },
  {
    id: 'PO-005',
    publisherName: 'Pearson',
    isbn: '978-0-262-03384-8',
    bookTitle: 'Artificial Intelligence: A Modern Approach',
    quantity: 40,
    orderDate: '2024-12-14',
    status: 'Pending' as const
  }
];
