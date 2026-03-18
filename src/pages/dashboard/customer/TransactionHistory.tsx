import React, { useState, useEffect } from 'react';
import transactionService from '../../../services/transactionService';
import { Transaction } from '../../../types';

interface TransactionHistoryProps {
  accNo: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ accNo }) => {
  const [logs, setLogs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getHistory(accNo);
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch transaction logs:", error);
      } finally {
        setLoading(false);
      }
    };
    if (accNo) fetchLogs();
  }, [accNo]);

  if (loading) return <div className="text-center p-4">Fetching history...</div>;

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Recent Transactions</h4>
        <button 
          className="btn btn-sm btn-link text-decoration-none" 
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light small text-uppercase text-secondary">
            <tr>
              <th>Date</th>
              <th>Reference / Type</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((tx) => {
                const isDebit = tx.senderAccountNumber === accNo;
                return (
                  <tr key={tx.id}>
                    <td className="small text-muted">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="fw-bold small">{tx.type}</div>
                      <div className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                        ID: {tx.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className={`text-end fw-bold ${isDebit ? 'text-danger' : 'text-success'}`}>
                      {isDebit ? '-' : '+'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-5 text-muted small">
                  No transactions found for this account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
