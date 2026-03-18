import React, { useState, ChangeEvent, FormEvent } from 'react';
import transactionService from '../../../services/transactionService';
import { Customer } from '../../../types';

interface TransferFormProps {
  senderAccNo: string;
  onTransferSuccess: () => void;
  customer: Customer | null; // Added to check for mobile number
}

const TransferForm: React.FC<TransferFormProps> = ({ senderAccNo, onTransferSuccess, customer }) => {
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1: Input, 2: OTP Verification
  const [loading, setLoading] = useState<boolean>(false);

  // Step 1: Request OTP & Open WhatsApp
  const handleInitiate = async (e: FormEvent) => {
    e.preventDefault();

    // Verification: Does the customer have a mobile number?
    if (!customer?.mobileNumber) {
      alert("Security Requirement: Please update your mobile number in the Profile section before performing a transfer.");
      return;
    }

    setLoading(true);
    try {
      // Backend generates OTP and returns the wa.me link
      const waLink = await transactionService.initiateTransfer(senderAccNo);
      
      // Open WhatsApp in a new tab
      window.open(waLink, '_blank');
      
      // Move to OTP entry step
      setStep(2);
      alert("OTP Link Generated! Please send the message on WhatsApp to receive your code.");
    } catch (err: any) {
      alert("Failed to initiate: " + (err.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Transaction with OTP
  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      await transactionService.confirmTransfer({
        fromAccountNumber: senderAccNo,
        toAccountNumber: to,
        amount: numericAmount,
        otp: otp
      });

      alert("Transfer Successful!");
      if (onTransferSuccess) onTransferSuccess();
    } catch (err: any) {
      alert("Transfer Failed: " + (err.message || "Invalid OTP"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-shield-lock text-primary fs-4 me-2"></i>
        <h4 className="mb-0 fw-bold">{step === 1 ? 'Transfer Money' : 'Verify OTP'}</h4>
      </div>

      <div className="p-4 border rounded shadow-sm bg-white">
        {step === 1 ? (
          /* STEP 1 FORM */
          <form onSubmit={handleInitiate}>
            <div className="mb-3">
              <label className="form-label small text-muted fw-bold">FROM ACCOUNT</label>
              <input type="text" className="form-control bg-light" value={senderAccNo} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted fw-bold">RECIPIENT ACCOUNT</label>
              <input 
                type="text" className="form-control" placeholder="ACCXXXXX"
                value={to} onChange={(e) => setTo(e.target.value)} required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label small text-muted fw-bold">AMOUNT</label>
              <input 
                type="number" className="form-control" placeholder="0.00"
                value={amount} onChange={(e) => setAmount(e.target.value)} required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
              {loading ? 'Generating Link...' : 'Request WhatsApp OTP'}
            </button>
          </form>
        ) : (
          /* STEP 2 FORM */
          <form onSubmit={handleConfirm}>
            <div className="alert alert-info small">
              We've opened WhatsApp. Please enter the 6-digit code you received.
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted fw-bold">ENTER 6-DIGIT OTP</label>
              <input 
                type="text" className="form-control form-control-lg text-center letter-spacing-2" 
                placeholder="000000" maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value)} required 
              />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn btn-success w-50 fw-bold" disabled={loading}>
                {loading ? 'Verifying...' : 'Confirm & Pay'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferForm;