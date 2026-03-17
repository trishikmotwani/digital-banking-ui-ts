import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';

const ResetPassword = () => {
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Calling the Spring Boot endpoint: POST /api/user/reset-password/{username}
      const response = await userService.resetPassword(username);
      setMessage({ type: 'success', text: response });
      setUsername('');
    } catch (err: any) {
      setMessage({ 
        type: 'danger', 
        text: err.message || "Could not find an account with that username." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0" style={{ width: '400px' }}>
        <div className="card-body p-5 text-center">
          <div className="mb-4">
            <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3rem' }}></i>
            <h3 className="fw-bold text-primary mt-2">Reset Password</h3>
            <p className="text-muted small">Enter your username to receive a secure reset link.</p>
          </div>

          {message && (
            <div className={`alert alert-${message.type} py-2 small text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-start">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 mb-3 shadow-sm"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <Link to="/" className="text-decoration-none small text-muted">
            <i className="bi bi-arrow-left"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
