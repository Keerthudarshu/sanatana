import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  
  const [step, setStep] = useState(resetToken ? 2 : 1); // Step 1: Request reset, Step 2: Reset password, Step 3: Send credentials
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [method, setMethod] = useState('reset'); // 'reset' or 'credentials'

  const API_URL = 'http://localhost:8080/api/password';

  // Step 1: Request password reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail('');
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Send forgotten credentials
  const handleSendCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/send-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail('');
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Password Recovery</h2>
        
        {/* Method Selection */}
        {!resetToken && step === 1 && (
          <div className="method-selection">
            <label className="method-option">
              <input
                type="radio"
                value="reset"
                checked={method === 'reset'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>Send Reset Link to Email</span>
            </label>
            <label className="method-option">
              <input
                type="radio"
                value="credentials"
                checked={method === 'credentials'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>Send Username & Temporary Password</span>
            </label>
          </div>
        )}

        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Step 1: Request Password Reset or Send Credentials */}
        {!resetToken && step === 1 && (
          <form onSubmit={method === 'reset' ? handleForgotPassword : handleSendCredentials}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : (method === 'reset' ? 'Send Reset Link' : 'Send Credentials')}
            </button>
          </form>
        )}

        {/* Step 2: Reset Password with Token */}
        {resetToken && (
          <form onSubmit={handleResetPassword}>
            <p className="info-text">Enter your new password below:</p>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="form-footer">
          <p>
            Remember your password? <Link to="/user-login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
