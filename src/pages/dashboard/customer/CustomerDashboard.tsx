import React, { useState, useEffect } from 'react';
import accountService from '../../../services/accountService';
import customerService from '../../../services/customerService';
import { Account, Customer } from '../../../types';

import BalanceCard from './BalanceCard';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import UpdateProfile from './UpdateProfile';

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [account, setAccount] = useState<Account | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const username = localStorage.getItem('username') || "";
  // Check specifically for the savingsAccount we saved during login
  const storedSavingsNo = localStorage.getItem('savingsAccount');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Customer Profile (for UpdateProfile component)
        const allCustomers = await customerService.getAllCustomers();
        const profile = allCustomers.find(u => u.username === username);
        if (profile) setCustomer(profile);

        // 2. Resolve Account Logic
        let currentAccNo = storedSavingsNo;

        // Fallback: If not in localStorage, fetch from API to verify
        if (!currentAccNo) {
          const accounts = await accountService.getAccountsByUsername(username);
          const savings = accounts.find(acc => acc.accountType === 'SAVINGS');
          if (savings) {
            currentAccNo = savings.accountNumber;
            localStorage.setItem('savingsAccount', currentAccNo);
          }
        }

        // 3. Fetch Balance if account exists
        if (currentAccNo) {
          const balance = await accountService.viewBalance(currentAccNo);
          setAccount({ 
            id: 0, 
            accountNumber: currentAccNo, 
            balance, 
            status: 'ACTIVE',
            accountType: 'SAVINGS' 
          });
        }

      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) loadDashboardData();
  }, [username, storedSavingsNo]);

  if (loading) return (
    <div className="text-center p-5 mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Securing your session...</p>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <aside className="col-md-3 col-lg-2 mb-4">
          <div className="list-group shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <button onClick={() => setActiveTab('overview')} className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'overview' ? 'bg-primary text-white' : ''}`}>
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </button>
            {/* Disable buttons if no account exists */}
            <button disabled={!account} onClick={() => setActiveTab('transfer')} className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'transfer' ? 'bg-primary text-white' : ''}`}>
              <i className="bi bi-send me-2"></i> Transfer
            </button>
            <button disabled={!account} onClick={() => setActiveTab('transactions')} className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'transactions' ? 'bg-primary text-white' : ''}`}>
              <i className="bi bi-list-ul me-2"></i> History
            </button>
            <button onClick={() => setActiveTab('profile')} className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'profile' ? 'bg-primary text-white' : ''}`}>
              <i className="bi bi-person me-2"></i> Profile
            </button>
          </div>
        </aside>

        <main className="col-md-9 col-lg-10">
          <div className="card shadow-sm border-0 p-4 min-vh-75 bg-white">
            {!account && activeTab !== 'profile' ? (
              <div className="text-center py-5">
                <i className="bi bi-exclamation-triangle text-warning display-1"></i>
                <h3 className="mt-4 fw-bold">No Savings Account Found</h3>
                <p className="text-muted">You don't have an active savings account linked to your profile. Please contact the manager.</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && account && <BalanceCard account={account} />}
                {activeTab === 'transfer' && account && <TransferForm senderAccNo={account.accountNumber} />}
                {activeTab === 'transactions' && account && <TransactionHistory accNo={account.accountNumber} />}
                {activeTab === 'profile' && <UpdateProfile customer={customer} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
