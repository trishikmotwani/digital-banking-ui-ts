import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
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

  useEffect(() => {
    if (customer) {
      setFormData({
        mobileNumber: customer.mobileNumber || '',
        age: customer.age || 0,
        income: customer.income || 0,
      });
    }
  }, [customer]);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <i className="bi bi-person-badge text-primary fs-4 me-2"></i>
          <h4 className="mb-0 fw-bold">Account Settings</h4>
        </div>
        {/* Simple Username Badge */}
        <span className="badge bg-light text-primary border px-3 py-2">
          <i className="bi bi-at"></i>{customer?.username || 'user'}
        </span>
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
              placeholder="e.g. 919876543210"
              required
            />
            <div className="form-text small">Used for WhatsApp OTP verification.</div>
          </div>
          
          <div className="col-md-6">
            <label className="form-label small text-muted fw-bold text-uppercase">Age</label>
            <input 
              type="number" 
              name="age"
              className="form-control" 
              value={formData.age} 
              onChange={handleChange}
              min="18"
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
              />
            </div>
          </div>

          <div className="col-12 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-bold"
              disabled={loading || !customer}
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;