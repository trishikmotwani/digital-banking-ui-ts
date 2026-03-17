import React, { useState, ChangeEvent, FormEvent } from 'react';
import transactionService from '../../../services/transactionService';

interface TransferFormProps {
  senderAccNo: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ senderAccNo }) => {
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Converting string amount to number for the API call
      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      await transactionService.transfer(senderAccNo, to, numericAmount);
      
      alert("Money Sent Successfully!");
      setTo('');
      setAmount('');
    } catch (err: any) {
      alert("Transfer Failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-arrow-left-right text-primary fs-4 me-2"></i>
        <h4 className="mb-0 fw-bold">Transfer Money</h4>
      </div>

      <form onSubmit={handleTransfer} className="p-4 border rounded shadow-sm bg-white">
        <div className="mb-3">
          <label className="form-label small text-muted fw-bold">FROM ACCOUNT</label>
          <input 
            type="text" 
            className="form-control bg-light" 
            value={senderAccNo} 
            disabled 
          />
        </div>

        <div className="mb-3">
          <label className="form-label small text-muted fw-bold">RECIPIENT ACCOUNT NUMBER</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. ACC98765"
            value={to} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="form-label small text-muted fw-bold">AMOUNT (USD)</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0.00"
              step="0.01"
              value={amount} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2 fw-bold"
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
          ) : (
            'Confirm Transfer'
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
