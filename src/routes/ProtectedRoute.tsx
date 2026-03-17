import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole; // Optional: some routes might just need "logged in" status
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') as UserRole | null;
  const location = useLocation();

  // 1. Check if user is authenticated
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Check if user has the specific required role
  if (allowedRole && userRole !== allowedRole) {
    // Dynamic redirect based on their actual role
    const redirectPath = userRole === UserRole.ROLE_ADMIN 
      ? '/admin/dashboard' 
      : '/customer/dashboard';
      
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
