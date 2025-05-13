import React, { useState } from 'react';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be replaced with actual authentication logic
      console.log('Login with:', { email, password, rememberMe });
      
      // Reset form or redirect
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-luxury-black mb-6">Sign In</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-luxury-gray mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="luxury-input"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-luxury-gray mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="luxury-input"
            required
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 border-luxury-gray rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-luxury-gray">
              Remember me
            </label>
          </div>
          
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-sm text-luxury-gold hover:underline"
          >
            Forgot password?
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full mb-4"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="text-center">
          <p className="text-sm text-luxury-gray">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-luxury-gold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;