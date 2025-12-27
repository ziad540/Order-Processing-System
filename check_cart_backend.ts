const API_URL = 'http://localhost:3000';

async function runTest() {
    console.log("Starting Cart API Test...");

    // 1. Create a unique user
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'password123';

    console.log(`\n1. Registering user: ${username}`);
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            email,
            password,
            firstName: 'Test',
            lastName: 'User',
            phones: ['1234567890'],
            address: '123 Test St'
        })
    });

    if (!signupRes.ok) {
        console.error('Signup failed:', await signupRes.text());
        return;
    }
    console.log('Signup successful.');

    // 2. Login
    console.log(`\n2. Logging in...`);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token obtained.');

    // 3. Get a Book ISBN
    console.log(`\n3. Fetching books to find a valid ISBN...`);
    const booksRes = await fetch(`${API_URL}/books/search`, { // Using search endpoint or list
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }) // Empty search to get all?
    });

    // Note: If /books/search requires auth, we might have issue. 
    // Checking controller... BookController usually public for reading?
    // If search fails, try public list if exists, or assume seeding.

    let isbn = null;
    if (booksRes.ok) {
        const booksData = await booksRes.json();
        // searchBook returns { books: [], total: ... }
        if (booksData.books && booksData.books.length > 0) {
            isbn = booksData.books[0].ISBN;
            console.log(`Found book: ${booksData.books[0].title} (ISBN: ${isbn})`);
        } else {
            console.log('No books found via search. Trying plain GET /books ...');
            const listRes = await fetch(`${API_URL}/books`); // Assuming a GET /books exists
            if (listRes.ok) {
                const listData = await listRes.json();
                // listAllBooks returns { books: [], total }
                if (listData.books && listData.books.length > 0) {
                    isbn = listData.books[0].ISBN;
                    console.log(`Found book via GET /books: ${isbn}`);
                }
            }
        }
    } else {
        console.error('Failed to fetch books:', await booksRes.text());
    }

    if (!isbn) {
        console.error('No ISBN found to test with. Cannot proceed.');
        return;
    }

    // 4. Add to Cart
    console.log(`\n4. Adding book ${isbn} to cart...`);
    const addToCartRes = await fetch(`${API_URL}/cart/createCartItem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isbn, quantity: 1 })
    });

    if (!addToCartRes.ok) {
        console.error('Add to Cart Failed:', await addToCartRes.status, await addToCartRes.text());
    } else {
        const addData = await addToCartRes.json();
        console.log('Add to Cart Successful:', addData);
    }

    // 5. Verify Cart
    console.log(`\n5. Verifying Cart Contents...`);
    const getCartRes = await fetch(`${API_URL}/cart/getallitems`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!getCartRes.ok) {
        console.error('Get Cart Failed:', await getCartRes.status, await getCartRes.text());
    } else {
        const cartItems = await getCartRes.json();
        console.log('Cart Items:', JSON.stringify(cartItems, null, 2));

        const found = cartItems.find((item: any) => item.book.ISBN === isbn);
        if (found) {
            console.log('SUCCESS: Book found in cart!');
        } else {
            console.error('FAILURE: Book NOT found in cart.');
        }
    }
}

runTest().catch(console.error);
