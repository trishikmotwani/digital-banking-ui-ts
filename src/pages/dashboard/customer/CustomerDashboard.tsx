import React, { useState, useEffect, useCallback } from 'react';
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

  // 1. Memoized data loader to fetch profile and account details
  const loadDashboardData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      
      // Fetch Customer Profile (to check for mobileNumber)
      const allCustomers = await customerService.getAllCustomers();
      const profile = allCustomers.find(u => u.username === username);
      if (profile) setCustomer(profile);

      // Fetch Account & Balance directly from API
      const accounts = await accountService.getAccountsByUsername(username);
      const savings = accounts.find(acc => acc.accountType === 'SAVINGS');

      if (savings) {
        const latestBalance = await accountService.viewBalance(savings.accountNumber);
        setAccount({ 
          ...savings, 
          balance: latestBalance 
        });
        localStorage.setItem('savingsAccount', savings.accountNumber);
      }
    } catch (err) {
      console.error("Error updating dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // 2. Effect: Runs on mount and every time the user switches tabs to ensure fresh data
  useEffect(() => {
    if (username) {
      const shouldSpin = activeTab === 'overview' && !account;
      loadDashboardData(shouldSpin);
    }
  }, [username, activeTab, loadDashboardData]);

  if (loading && !account) return (
    <div className="text-center p-5 mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Synchronizing with bank servers...</p>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* 3. Global Security Alert for missing mobile number */}
      {!loading && customer && !customer.mobileNumber && activeTab !== 'profile' && (
        <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-4 animate__animated animate__fadeIn">
          <i className="bi bi-exclamation-octagon-fill fs-4 me-3"></i>
          <div>
            <strong>Security Profile Incomplete:</strong> Please update your <strong>Mobile Number</strong> in the Profile tab to enable Transfers and OTP verification.
          </div>
          <button 
            className="btn btn-sm btn-warning ms-auto fw-bold" 
            onClick={() => setActiveTab('profile')}
          >
            Go to Profile
          </button>
        </div>
      )}

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
              disabled={!account} 
              onClick={() => setActiveTab('transfer')} 
              className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'transfer' ? 'bg-primary text-white' : ''}`}
            >
              <i className="bi bi-send me-2"></i> Transfer
            </button>

            <button 
              disabled={!account} 
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

        {/* Main Panel */}
        <main className="col-md-9 col-lg-10">
          <div className="card shadow-sm border-0 p-4 min-vh-75 bg-white">
            {!account && activeTab !== 'profile' ? (
              <div className="text-center py-5">
                <i className="bi bi-exclamation-triangle text-warning display-1"></i>
                <h3 className="mt-4 fw-bold">Account Missing</h3>
                <p className="text-muted">No active savings account detected. Please visit a branch to open one.</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && account && (
                  <BalanceCard account={account} />
                )}

                {activeTab === 'transfer' && account && (
                  <TransferForm 
                    senderAccNo={account.accountNumber} 
                    customer={customer} // Passed to check mobileNumber internally
                    onTransferSuccess={() => {
                      loadDashboardData(); 
                      setActiveTab('overview'); 
                    }} 
                  />
                )}

                {activeTab === 'transactions' && account && (
                  <TransactionHistory accNo={account.accountNumber} />
                )}

                {activeTab === 'profile' && (
                  <UpdateProfile 
                    customer={customer} 
                    onUpdateSuccess={() => loadDashboardData()} 
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;