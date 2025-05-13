import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onBackToLoginClick: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLoginClick }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be replaced with actual password reset logic
      console.log('Reset password for:', email);
      
      setSuccess(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-luxury-black mb-6">Reset Password</h2>
      
      {success ? (
        <div>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 text-sm">
            Password reset instructions have been sent to your email address.
          </div>
          
          <button
            type="button"
            onClick={onBackToLoginClick}
            className="btn btn-primary w-full"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <>
          <p className="text-luxury-gray mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="reset-email" className="block text-sm font-medium text-luxury-gray mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mb-4"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
            
            <button
              type="button"
              onClick={onBackToLoginClick}
              className="text-luxury-gold hover:underline text-sm w-full text-center"
            >
              Back to Sign In
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;