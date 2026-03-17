import React from 'react';
import { Account } from '../../../types';

/**
 * Prop definitions for AccountTable.
 * onStatusChange expects the account ID and the new status string.
 */
interface AccountTableProps {
  accounts: Account[];
  onStatusChange: (id: number, newStatus: 'ACTIVE' | 'BLOCKED' | 'CLOSED') => void;
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts, onStatusChange }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold text-primary">Account Management</h5>
          <span className="badge bg-light text-dark border">{accounts.length} Total Accounts</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th>Account No</th>
                <th>Balance</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="fw-bold">{acc.accountNumber}</td>
                    <td>
                      <span className="text-muted small">$</span>
                      <span className="ms-1">{acc.balance.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${
                        acc.status === 'ACTIVE' ? 'bg-success-subtle text-success border border-success' : 
                        acc.status === 'BLOCKED' ? 'bg-danger-subtle text-danger border border-danger' : 
                        'bg-secondary-subtle text-secondary border border-secondary'
                      }`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button 
                        className={`btn btn-sm px-3 ${
                          acc.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'
                        }`}
                        onClick={() => 
                          onStatusChange(
                            acc.id, 
                            acc.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
                          )
                        }
                        disabled={acc.status === 'CLOSED'} // Prevent actions on closed accounts
                      >
                        <i className={`bi ${acc.status === 'ACTIVE' ? 'bi-slash-circle' : 'bi-check-circle'} me-1`}></i>
                        {acc.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted small">
                    No banking accounts found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTable;
