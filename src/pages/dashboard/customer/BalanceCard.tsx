import React from 'react';
import { Account } from '../../../types';

/**
 * Prop definition for BalanceCard.
 * It expects a strictly typed Account object.
 */
interface BalanceCardProps {
  account: Account;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ account }) => {
  return (
    <div className="bg-light p-4 rounded-3 border">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0">Available Balance</h6>
        <i className="bi bi-wallet2 text-primary fs-4"></i>
      </div>
      
      <h1 className="display-5 fw-bold text-primary">
        ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </h1>
      
      <hr className="my-3 opacity-25" />
      
      <div className="d-flex justify-content-between align-items-center">
        <div className="small">
          <span className="text-muted">Account Number: </span>
          <strong className="text-dark">{account.accountNumber}</strong>
        </div>
        <span className={`badge rounded-pill ${
          account.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'
        }`}>
          {account.status}
        </span>
      </div>
    </div>
  );
};

export default BalanceCard;
