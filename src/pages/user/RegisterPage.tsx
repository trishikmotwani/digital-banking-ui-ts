import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { UserRole } from '../../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Typed State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string>('');

  // 2. Typed handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Typed handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Mapping to match Spring UserEntity/DTO
      const userToRegister = {
        username: formData.username,
        password: formData.password,
        role: UserRole.ROLE_USER // Defaulting as discussed
      };

      await userService.register(userToRegister);
      alert("Account Created Successfully!");
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card shadow-lg border-0" style={{ width: '500px' }}>
        <div className="card-body p-5">
          <h3 className="fw-bold text-primary mb-3">Create Account</h3>
          <p className="text-muted mb-4">Join our secure digital banking platform.</p>
          
          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input 
                name="username" type="text" className="form-control" 
                value={formData.username} onChange={handleChange} required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input 
                name="email" type="email" className="form-control" 
                value={formData.email} onChange={handleChange} required 
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Password</label>
                <input 
                  name="password" type="password" className="form-control" 
                  value={formData.password} onChange={handleChange} required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password</label>
                <input 
                  name="confirmPassword" type="password" className="form-control" 
                  value={formData.confirmPassword} onChange={handleChange} required 
                />
              </div>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="terms" required />
              <label className="form-check-label small" htmlFor="terms">I agree to the Terms & Conditions</label>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">Register</button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="small text-muted">Already have an account? </span>
            <Link to="/" className="text-decoration-none small">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
