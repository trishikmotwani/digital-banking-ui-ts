import React, { useState, ChangeEvent, FormEvent } from 'react';
import customerService, { type Customer } from '../../../services/customerService';

interface UpdateProfileProps {
  customer: Customer | null;
  onUpdateSuccess?: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ customer, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    mobileNumber: customer?.mobileNumber || '',
    age: customer?.age || 0,
    income: customer?.income || 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'mobileNumber' ? value : Number(value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customer?.userId) return;

    setLoading(true);
    try {
      // Calls: PUT /api/customers/{id}
      await customerService.updateCustomer(customer.userId, formData);
      alert("Profile updated successfully!");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err: any) {
      alert("Update failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-person-gear text-primary fs-4 me-2"></i>
        <h4 className="mb-0 fw-bold">Update KYC & Profile</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small text-muted fw-bold text-uppercase">Mobile Number</label>
            <input 
              type="text" 
              name="mobileNumber"
              className="form-control" 
              value={formData.mobileNumber} 
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small text-muted fw-bold text-uppercase">Age</label>
            <input 
              type="number" 
              name="age"
              className="form-control" 
              value={formData.age} 
              onChange={handleChange}
              placeholder="e.g. 25"
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small text-muted fw-bold text-uppercase">Annual Income (USD)</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input 
                type="number" 
                name="income"
                className="form-control" 
                value={formData.income} 
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          <div className="col-12 mt-4">
            <button 
              type="submit" 
              className="btn btn-dark w-100 py-2 fw-bold"
              disabled={loading || !customer}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
              ) : (
                'Save Profile Changes'
              )}
            </button>
          </div>
        </div>
      </form>
      
      {!customer && (
        <div className="alert alert-warning mt-3 small">
          Unable to load customer profile data. Please try again later.
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
