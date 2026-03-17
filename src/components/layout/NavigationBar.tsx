import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') as UserRole | null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={token ? (role === UserRole.ROLE_ADMIN ? '/admin/dashboard' : '/customer/dashboard') : '/'}>
          <i className="bi bi-bank me-2"></i>DIGITAL BANK
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            {!token ? (
              <>
                <Link className="nav-link" to="/">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="nav-link text-white-50 small me-3">
                  Logged in as {role?.replace('ROLE_', '')}
                </span>
                <button className="btn btn-link nav-link border-0 text-start" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
