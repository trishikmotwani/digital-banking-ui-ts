import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import accountService from '../../../services/accountService';

// Placeholder sub-components (Ensure these are converted to TSX as well)
import Overview from './Overview';
import UserManagementList from './UserManagementList';
import TransactionList from './TransactionList';
import KycManagement from './KycManagement';

// Define the shape of our dashboard statistics
interface DashboardStats {
  customers: number;
  accounts: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stats, setStats] = useState<DashboardStats>({ customers: 0, accounts: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        // Using our strictly typed services
        const customers = await userService.getAllUsers();
        const accounts = await accountService.viewAllAccounts();
        
        setStats({ 
          customers: customers.length, 
          accounts: accounts.length 
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
        <nav className="col-md-2 d-none d-md-block bg-white sidebar shadow-sm min-vh-100 p-3 border-end">
          <h5 className="text-primary mb-4 fw-bold">Admin Panel</h5>
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start ${activeTab === 'overview' ? 'btn-primary text-white' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-grid me-2"></i> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start ${activeTab === 'users' ? 'btn-primary text-white' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i> User Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start ${activeTab === 'transactions' ? 'btn-primary text-white' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('transactions')}
              >
                <i className="bi bi-list-check me-2"></i> Transactions
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start ${activeTab === 'kyc' ? 'btn-primary text-white' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('kyc')}
              >
                <i className="bi bi-shield-check me-2"></i> KYC Approvals
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="col-md-10 ms-sm-auto px-md-4 py-4 bg-light min-vh-100">
          <div className="bg-white p-4 rounded-3 shadow-sm">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Fetching System Data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <Overview stats={stats} />}
                {activeTab === 'users' && <UserManagementList />}
                {activeTab === 'transactions' && <TransactionList />}
                {activeTab === 'kyc' && <KycManagement />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
