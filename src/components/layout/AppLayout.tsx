import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';

/**
 * AppLayout serves as the main wrapper for the application.
 * It includes the persistent NavigationBar and Footer, 
 * while the <Outlet /> renders the specific page content.
 */
const AppLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Extracted Navigation Component */}
      <NavigationBar />

      {/* Main Content Area - Outlet renders the child routes */}
      <main className="container py-5 flex-grow-1">
        <Outlet /> 
      </main>

      {/* Common Footer */}
      <footer className="bg-white border-top py-4 mt-auto shadow-sm">
        <div className="container text-center text-muted">
          <small>&copy; {new Date().getFullYear()} Digital Banking App. Secure & Encrypted.</small>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
