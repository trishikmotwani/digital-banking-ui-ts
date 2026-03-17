import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/user/LoginPage';
import RegisterPage from '../pages/user/RegisterPage';
import ResetPassword from '../pages/user/ResetPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import CustomerDashboard from '../pages/dashboard/customer/CustomerDashboard';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import { UserRole } from '../types';

// Typing the routes as an array of RouteObject for extra safety
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { 
        index: true, 
        element: <LoginPage /> 
      },
      { 
        path: "register", 
        element: <RegisterPage /> 
      },
      { 
        path: "reset-password", 
        element: <ResetPassword /> 
      },
      
      // Customer Routes: Guarded by ROLE_USER
      {
        path: "customer/dashboard",
        element: (
          <ProtectedRoute allowedRole={UserRole.ROLE_USER}>
            <CustomerDashboard />
          </ProtectedRoute>
        ),
      },
      
      // Admin Routes: Guarded by ROLE_ADMIN
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRole={UserRole.ROLE_ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
