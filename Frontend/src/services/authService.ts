const API_URL = 'http://localhost:3000';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  phones: string[];
  firstName: string;
  lastName: string;
  address: string;
}

export interface LoginData {
  email: string; // Changed from username to email matching backend
  password: string;
}

export const signup = async (data: SignupData) => {
  console.log('[AuthService] Signup called with data:', data);
  try {
    const response = await fetch(`${API_URL}/customers/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: data.username,
        email: data.email,
        Password: data.password,
        phones: data.phones,
        FirstName: data.firstName,
        LastName: data.lastName,
        ShippingAddress: data.address,
      }),
    });

    console.log('[AuthService] Signup response status:', response.status);

    const result = await response.json();
    console.log('[AuthService] Signup response body:', result);

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Signup failed');
    }

    return result;
  } catch (error) {
    console.error('[AuthService] Signup error:', error);
    throw error;
  }
};

export const login = async (data: LoginData) => {
  console.log('[AuthService] Login called with data:', data);
  try {
    const response = await fetch(`${API_URL}/customers/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        Password: data.password,
      }),
    });

    console.log('[AuthService] Login response status:', response.status);

    const result = await response.json();
    console.log('[AuthService] Login response body:', result);

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Login failed');
    }

    if (result.token) {
      setToken(result.token);
    }

    // Store user info if available
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('[AuthService] Login error:', error);
    throw error;
  }
};

export const logout = () => {
  removeToken();
  localStorage.removeItem('user');
};

// Token Management
export const setToken = (token: string) => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

export const removeToken = () => {
  localStorage.removeItem('jwt_token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
}

export const getUserProfile = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/customers/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return null;
      }
      throw new Error('Failed to fetch profile');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (data: { firstName?: string; lastName?: string; email?: string; address?: string }) => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/customers/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  return await response.json();
}

export const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/customers/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update password');
  }
  return await response.json();
}

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
