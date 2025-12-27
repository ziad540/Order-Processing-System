
// Removed import fetch from 'node-fetch'; - using native fetch

const API_URL = 'http://localhost:3000';

async function runTest() {
    console.log("Starting Cart API Test...");

    // 1. Create a unique user
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'password123';

    console.log(`\n1. Registering user: ${username}`);
    const signupRes = await fetch(`${API_URL}/customers/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Username: username,
            email: email,
            Password: password,
            FirstName: 'Test',
            LastName: 'User',
            phones: ['1234567890'],
            ShippingAddress: '123 Test St'
        })
    });

    if (!signupRes.ok) {
        console.error('Signup failed:', await signupRes.text());
        return;
    }
    console.log('Signup successful.');

    // 2. Login
    console.log(`\n2. Logging in...`);
    const loginRes = await fetch(`${API_URL}/customers/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, Password: password })
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
    const booksRes = await fetch(`${API_URL}/books/list`);

    let isbn = null;
    if (booksRes.ok) {
        const booksData = await booksRes.json();
        const booksList = booksData.data || booksData.books || [];

        if (booksList.length > 0) {
            isbn = booksList[0].ISBN;
            console.log(`Found book: ${booksList[0].title} (ISBN: ${isbn})`);
        } else {
            console.log('No books found via /books/list.');
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
        return;
    } else {
        const addData = await addToCartRes.json();
        console.log('Add to Cart Successful. Response:', addData);
    }

    // 5. Update Quantity
    const newQuantity = 3;
    console.log(`\n5. Updating item (${isbn}) quantity to ${newQuantity}...`);
    const updateRes = await fetch(`${API_URL}/cart/updateItemQuantity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isbn, quantity: newQuantity })
    });

    if (!updateRes.ok) {
        console.error('Update Quantity Failed:', await updateRes.status, await updateRes.text());
        return;
    } else {
        console.log('Update Quantity Successful:', await updateRes.json());
    }

    // 6. Verify Cart
    console.log(`\n6. Verifying Cart Contents...`);
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

        let items = Array.isArray(cartItems) ? cartItems : (cartItems.data || []);

        const found = items.find((item: any) => item.book && item.book.ISBN === isbn);
        if (found) {
            console.log(`SUCCESS: Book found in cart! Full Item:`, JSON.stringify(found, null, 2));
            if (found.quantity === newQuantity) {
                console.log('VERIFICATION: Quantity updated correctly!');
            } else {
                console.error(`VERIFICATION FAILED: Expected quantity ${newQuantity}, got ${found.quantity}`);
            }
        } else {
            console.error('FAILURE: Book NOT found in cart.');
        }
    }
}

runTest().catch(console.error);
