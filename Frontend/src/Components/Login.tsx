import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, Loader2 } from 'lucide-react'; // Changed User to Mail for email login
import { User as UserType } from '../App';
import * as authService from '../services/authService';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });

      console.log('[Login] Login result:', result);
      let user = result.user;
      try {
        const fullProfile = await authService.getUserProfile();
        console.log('[Login] Full profile fetched:', fullProfile);
        if (fullProfile) {
          user = fullProfile;
        }
      } catch (error) {
        console.error("Failed to fetch full profile after login", error);
      }

      // Map backend user to frontend UserType if structures differ
      // Assuming result.user matches UserType largely, but check role specifically

      // Ensure role is mapped correctly if backend sends differently (e.g. 'Customer' vs 'customer')
      console.log('[Login] User object before mapping:', user);
      const role = user.role ? user.role.toLowerCase() : 'customer';
      console.log('[Login] Detected role:', role);

      const mappedUser: UserType = {
        id: user.UserID?.toString() || user.id,
        username: user.Username || user.username,
        role: role as 'admin' | 'customer',
        firstName: user.FirstName || user.firstName,
        lastName: user.LastName || user.lastName,
        email: user.email || user.Email,
        phone: user.phones?.[0] || user.phone,
        address: user.ShippingAddress || user.shippingAddress || user.address
      };

      onLogin(mappedUser);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/home');
      }

    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-background dark:to-background">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-lg shadow-lg border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 dark:bg-primary rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-foreground mb-2">Bookstore</h1>
            <p className="text-muted-foreground">Order Processing System</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 dark:text-primary dark:hover:text-primary/90">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
