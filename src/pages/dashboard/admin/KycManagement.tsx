import React, { useState, useEffect } from 'react';
import customerService, { Customer } from '../../../services/customerService';

/**
 * KycManagement handles the administrative workflow for 
 * verifying customer identities (KYC).
 */

export interface KycManagementProps {
  onKycSuccess: any;
}
const KycManagement: React.FC<KycManagementProps> = (props) => {
  const [pendingCustomers, setPendingCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const fetchPendingKyc = async () => {
    try {
      setLoading(true);
      const allCustomers = await customerService.getAllCustomers();
      // Filter for customers who are NOT yet verified
      const pending = allCustomers.filter(c => !c.kycVerified);
      setPendingCustomers(pending);
    } catch (err) {
      console.error("Failed to load KYC data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (mobileNumber: string) => {
    try {
      // Calls: PATCH /api/customers/verify-kyc/{mobileNumber}
      await customerService.verifyKyc(mobileNumber);
      alert("KYC Verified Successfully!");
      // Refresh the local list
      fetchPendingKyc();
      props.onKycSuccess();
    } catch (err) {
      alert("Verification failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center p-4">Loading KYC requests...</div>;

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold text-primary">Pending KYC Approvals</h5>
        <span className="badge bg-warning text-dark">{pendingCustomers.length} Requests</span>
      </div>

      <ul className="list-group list-group-flush">
        {pendingCustomers.length > 0 ? (
          pendingCustomers.map((customer) => (
            <li key={customer.userId} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
              <div>
                <div className="fw-bold">{customer.username}</div>
                <small className="text-muted">
                  <i className="bi bi-phone me-1"></i>
                  {customer.mobileNumber}
                </small>
                <div className="small text-muted mt-1">Income: ${customer.income.toLocaleString()}</div>
              </div>
              <button 
                className="btn btn-sm btn-primary shadow-sm px-3"
                onClick={() => handleApprove(customer.mobileNumber)}
              >
                <i className="bi bi-check-circle me-1"></i> Approve KYC
              </button>
            </li>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-shield-check display-4"></i>
            <p className="mt-2">No pending KYC approvals found.</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default KycManagement;
