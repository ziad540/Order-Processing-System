// import fetch from 'node-fetch';

async function simulateLogin() {
  const API_URL = 'http://localhost:3000';
  
  try {
    // 1. Login
    console.log('--- Attempting Login ---');
    const loginResponse = await fetch(`${API_URL}/customers/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sarah.admin@booksys.com',
        Password: 'password123',
      }),
    });

    const text = await loginResponse.text();
    console.log('Login Response Text:', text);
    
    let loginResult;
    try {
        loginResult = JSON.parse(text);
    } catch (e) {
        console.error('Failed to parse login response as JSON');
        return;
    }

    console.log('Login Status:', loginResponse.status);
    console.log('Login Result User Role:', loginResult.user?.role);
    
    if (!loginResponse.ok) {
        console.error('Login failed:', loginResult);
        return;
    }

    const token = loginResult.token;
    
    // 2. Get Profile
    console.log('\n--- Attempting Get Profile ---');
    const profileResponse = await fetch(`${API_URL}/customers/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    const profileResult = await profileResponse.json();
    console.log('Profile Status:', profileResponse.status);
    console.log('Profile Result:', profileResult);
    console.log('Profile Role:', profileResult.role);

  } catch (error) {
    console.error('Error:', error);
  }
}

simulateLogin();
