import axiosClient from '../api/api';
import { Transaction } from '../types';

// DTOs matching your Spring Boot @RequestBody classes
interface TransactionRequest {
  accountNumber: string;
  amount: number;
}

interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
}

const transactionService = {
  // POST: /api/transactions/deposit
  deposit: async (accountNumber: string, amount: number): Promise<Transaction> => {
    const payload: TransactionRequest = { accountNumber, amount };
    const response = await axiosClient.post<Transaction>('/transactions/deposit', payload);
    return response.data;
  },

  // POST: /api/transactions/withdraw
  withdraw: async (accountNumber: string, amount: number): Promise<Transaction> => {
    const payload: TransactionRequest = { accountNumber, amount };
    const response = await axiosClient.post<Transaction>('/transactions/withdraw', payload);
    return response.data;
  },

  // POST: /api/transactions/transfer
  transfer: async (fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<Transaction> => {
    const payload: TransferRequest = { fromAccountNumber, toAccountNumber, amount };
    const response = await axiosClient.post<Transaction>('/transactions/transfer', payload);
    return response.data;
  },

  // GET: /api/transactions/history/{accountNumber} (Customer view)
  getHistory: async (accountNumber: string): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>(`/transactions/history/${accountNumber}`);
    return response.data;
  },

  // GET: /api/transactions/admin/all (Admin/Manager view)
  adminViewAll: async (): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>('/transactions/admin/all');
    return response.data;
  },
};

export default transactionService;
