import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Account } from '../../types';
import accountService from '../../services/accountService';

interface CreateAccountModalProps {
  show: boolean;
  handleClose: () => void;
  customerId: string; // The ID of the customer receiving the account
  customerUsername: string;
  onSuccess: () => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ 
  show, handleClose, customerId, customerUsername, onSuccess 
}) => {
  const [formData, setFormData] = useState({
    balance: 0,
    accountType: 'SAVINGS'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mapping to match your Spring Boot @RequestBody AccountEntity
      const newAccount: Partial<Account> = {
        balance: formData.balance,
        accountType: formData.accountType as 'SAVINGS' | 'CURRENT',
        status: 'ACTIVE'
      };

      await accountService.createAccountByUsername(customerUsername, newAccount);
      alert(`Successfully created ${formData.accountType} account for ${customerUsername}`);
      onSuccess();
      handleClose();
    } catch (err: any) {
    //   console.log('err', err?.response?.data);
      setError(err?.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Open New Account</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <p className="text-muted small mb-1">PROVISIONING FOR:</p>
            <h6 className="fw-bold">{customerUsername}</h6>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">INITIAL DEPOSIT (USD)</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="e.g. 500.00"
              min="0"
              value={formData.balance}
              onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">ACCOUNT TYPE</Form.Label>
            <Form.Select 
              value={formData.accountType}
              onChange={(e) => setFormData({...formData, accountType: e.target.value})}
            >
              <option value="SAVINGS">SAVINGS ACCOUNT</option>
              <option value="CURRENT">CURRENT ACCOUNT</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Create Account'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateAccountModal;
