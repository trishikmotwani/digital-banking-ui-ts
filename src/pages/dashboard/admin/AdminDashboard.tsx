import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../../services/userService';
import accountService from '../../../services/accountService';

import Overview from './Overview';
import UserManagementList from './UserManagementList';
import TransactionList from './TransactionList';
import KycManagement from './KycManagement';

interface DashboardStats {
  customers: number;
  accounts: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stats, setStats] = useState<DashboardStats>({ customers: 0, accounts: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Memoized loader for system statistics
  const loadAdminStats = useCallback(async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      
      // Fetching fresh data for the Overview cards
      const [customers, accounts] = await Promise.all([
        userService.getAllUsers(),
        accountService.viewAllAccounts()
      ]);

      setStats({ 
        customers: customers.length, 
        accounts: accounts.length 
      });
    } catch (error) {
      console.error("Failed to refresh admin stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Trigger refresh whenever the admin switches tabs
  useEffect(() => {
    // We fetch stats for 'overview', but child components like TransactionList 
    // handle their own internal fetching. Re-mounting them by switching tabs 
    // triggers their internal useEffects anyway.
    if (activeTab === 'overview') {
      loadAdminStats(true);
    } else {
      // Just a quick background refresh of stats even on other tabs
      loadAdminStats(false);
    }
  }, [activeTab, loadAdminStats]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
        <nav className="col-md-2 d-none d-md-block bg-white sidebar shadow-sm min-vh-100 p-3 border-end">
          <h5 className="text-primary mb-4 fw-bold">Admin Panel</h5>
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start border-0 ${activeTab === 'overview' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-grid me-2"></i> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start border-0 ${activeTab === 'users' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i> User Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start border-0 ${activeTab === 'transactions' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('transactions')}
              >
                <i className="bi bi-list-check me-2"></i> Transactions
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`btn w-100 text-start border-0 ${activeTab === 'kyc' ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'}`} 
                onClick={() => setActiveTab('kyc')}
              >
                <i className="bi bi-shield-check me-2"></i> KYC Approvals
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="col-md-10 ms-sm-auto px-md-4 py-4 bg-light min-vh-100">
          <div className="bg-white p-4 rounded-3 shadow-sm border min-vh-75">
            {loading && activeTab === 'overview' ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Refreshing system data...</p>
              </div>
            ) : (
              <>
                {/* When activeTab changes, React unmounts the old component and 
                   mounts the new one. This triggers the 'useEffect' inside 
                   UserManagementList, TransactionList, etc., fetching fresh data.
                */}
                {activeTab === 'overview' && <Overview stats={stats} />}
                {activeTab === 'users' && <UserManagementList />}
                {activeTab === 'transactions' && <TransactionList />}
                {activeTab === 'kyc' && <KycManagement onKycSuccess={() => loadAdminStats(false)} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;