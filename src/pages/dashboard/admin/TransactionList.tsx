import React, { useState, useEffect } from 'react';
import transactionService from '../../../services/transactionService';
import { Transaction } from '../../../types';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.adminViewAll();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by Account Number or Description
  const filteredData = transactions.filter(tx => 
    tx.senderAccountNumber?.includes(searchTerm) || 
    tx.receiverAccountNumber?.includes(searchTerm) ||
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-5 text-muted">Loading audit logs...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-primary">System-Wide Transactions</h5>
        <div className="input-group input-group-sm" style={{ width: '250px' }}>
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0" 
            placeholder="Search Acc No..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase">
            <tr>
              <th>Date</th>
              <th>TXID (UUID)</th>
              <th>Type</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((tx) => (
                <tr key={tx.id}>
                  <td className="text-muted small">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="small text-truncate" style={{ maxWidth: '100px' }} title={tx.id}>
                    {tx.id}
                  </td>
                  <td>
                    <span className={`badge ${
                      tx.type === 'TRANSFER' ? 'bg-info-subtle text-info border' : 
                      tx.type === 'DEPOSIT' ? 'bg-success-subtle text-success border' : 
                      'bg-warning-subtle text-warning border'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="small">{tx.senderAccountNumber ?? ''}</td>
                  <td className="small">{tx.receiverAccountNumber ?? ''}</td>
                  <td className={`text-end fw-bold ${tx.type === 'DEPOSIT' ? 'text-success' : 'text-dark'}`}>
                    ${tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-5 text-muted">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
