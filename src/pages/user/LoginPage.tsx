import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { UserRole, UserDto } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Typed State for credentials
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Typed input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // 3. Typed Login Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // 1. Authenticate (returns the token string)
      const token: string = await userService.login(credentials);
      localStorage.setItem('token', token);
  
      // 2. Fetch User Details (Strictly typed as UserDto)
      const userResponse: UserDto = await userService.getUserDetails(credentials.username);
      const role = userResponse.role;
      
      localStorage.setItem('role', role);
      localStorage.setItem('username', credentials.username); 
  
      // 3. Role-Based Redirection using Enum values
      if (role === UserRole.ROLE_ADMIN) {
        navigate('/admin/dashboard');
      } else if (role === UserRole.ROLE_USER) {
        navigate('/customer/dashboard');
      } else {
        navigate('/dashboard');
      }
  
    } catch (err: any) {
      setError(err.message || "Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0" style={{ width: '400px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Digital Bank</h2>
            <p className="text-muted">Welcome back! Please login.</p>
          </div>

          {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input 
                name="username"
                type="text" 
                className="form-control form-control-lg" 
                placeholder="Enter username" 
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                name="password"
                type="password" 
                className="form-control form-control-lg" 
                placeholder="Enter password" 
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 mt-3 shadow-sm"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-decoration-none small d-block mb-2">Forgot Password?</Link>
            <span className="small text-muted">New here? </span>
            <Link to="/register" className="text-decoration-none small">Open an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
