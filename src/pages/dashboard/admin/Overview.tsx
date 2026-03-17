import React from 'react';

// Define the interface for the stats prop
interface OverviewProps {
  stats: {
    customers: number;
    accounts: number;
  };
}

/**
 * Overview component displays high-level system metrics 
 * for Admin and Manager roles.
 */
const Overview: React.FC<OverviewProps> = ({ stats }) => {
  return (
    <div className="row g-4 mb-4">
      {/* Total Customers Card */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm bg-primary text-white p-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-people fs-1 me-3 opacity-75"></i>
            <div>
              <h6 className="mb-0 opacity-75 text-uppercase small fw-bold">Total Customers</h6>
              <h2 className="fw-bold mb-0">{stats.customers}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Total Accounts Card */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm bg-success text-white p-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-wallet2 fs-1 me-3 opacity-75"></i>
            <div>
              <h6 className="mb-0 opacity-75 text-uppercase small fw-bold">Total Accounts</h6>
              <h2 className="fw-bold mb-0">{stats.accounts}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
