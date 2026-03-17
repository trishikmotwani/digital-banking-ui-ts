import React, { useState, useEffect } from 'react';
import accountService from '../../../services/accountService';
import { Account, Customer } from '../../../types';

// Sub-components (Ensure these are also .tsx)
import BalanceCard from './BalanceCard';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import UpdateProfile from './UpdateProfile';
import customerService from '../../../services/customerService';

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [account, setAccount] = useState<Account | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null); // Add this
  const [loading, setLoading] = useState<boolean>(true);

  const username = localStorage.getItem('username') || "";
  const storedAccountNo = localStorage.getItem('accountNumber') || "ACC12345";

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Account Balance
        const balance = await accountService.viewBalance(storedAccountNo);
        setAccount({ id: 0, accountNumber: storedAccountNo, balance, status: 'ACTIVE' });

        // 2. Fetch Customer Profile (for UpdateProfile component)
        // We use the username to get the full profile
        const users = await customerService.getAllCustomers();
        const profile = users.find(u => u.username === username);
        if (profile) setCustomer(profile);

      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) loadDashboardData();
  }, [username, storedAccountNo]);

  if (loading) return (
    <div className="text-center p-5 mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Securing your session...</p>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar Navigation */}
        <aside className="col-md-3 col-lg-2 mb-4">
          <div className="list-group shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'overview' ? 'bg-primary text-white' : ''}`}
            >
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </button>
            <button 
              onClick={() => setActiveTab('transfer')} 
              className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'transfer' ? 'bg-primary text-white' : ''}`}
            >
              <i className="bi bi-send me-2"></i> Transfer
            </button>
            <button 
              onClick={() => setActiveTab('transactions')} 
              className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'transactions' ? 'bg-primary text-white' : ''}`}
            >
              <i className="bi bi-list-ul me-2"></i> History
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'profile' ? 'bg-primary text-white' : ''}`}
            >
              <i className="bi bi-person me-2"></i> Profile
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="col-md-9 col-lg-10">
          <div className="card shadow-sm border-0 p-4 min-vh-75 bg-white">
            {activeTab === 'overview' && account && (
              <BalanceCard account={account} />
            )}
            
            {activeTab === 'transfer' && account && (
              <TransferForm senderAccNo={account.accountNumber} />
            )}
            
            {activeTab === 'transactions' && account && (
              <TransactionHistory accNo={account.accountNumber} />
            )}
            
            {activeTab === 'profile' && (
              <UpdateProfile 
                customer={customer} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
