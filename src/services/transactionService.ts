import axiosClient from '../api/api';
import { Transaction } from '../types';

// DTOs matching your Spring Boot @RequestBody classes
interface TransactionRequest {
  accountNumber: string;
  amount: number;
}

// Updated to include the OTP field for the confirmation step
interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  otp?: string; 
}

const transactionService = {
  // 1. DEPOSIT
  deposit: async (accountNumber: string, amount: number): Promise<Transaction> => {
    const payload: TransactionRequest = { accountNumber, amount };
    const response = await axiosClient.post<Transaction>('/transactions/deposit', payload);
    return response.data;
  },

  // 2. WITHDRAW
  withdraw: async (accountNumber: string, amount: number): Promise<Transaction> => {
    const payload: TransactionRequest = { accountNumber, amount };
    const response = await axiosClient.post<Transaction>('/transactions/withdraw', payload);
    return response.data;
  },

  // 3. INITIATE TRANSFER (Step 1)
  // Returns the WhatsApp wa.me link as a string
  initiateTransfer: async (fromAccountNumber: string): Promise<string> => {
    const response = await axiosClient.post<string>('/transactions/transfer/initiate', { 
      fromAccountNumber 
    });
    return response.data;
  },

  // 4. CONFIRM TRANSFER (Step 2)
  // Sends the OTP along with transfer details
  confirmTransfer: async (payload: TransferRequest): Promise<Transaction> => {
    const response = await axiosClient.post<Transaction>('/transactions/transfer/confirm', payload);
    return response.data;
  },

  // 5. GET HISTORY (Customer)
  getHistory: async (accountNumber: string): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>(`/transactions/history/${accountNumber}`);
    return response.data;
  },

  // 6. ADMIN VIEW ALL
  adminViewAll: async (): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>('/transactions/admin/all');
    return response.data;
  },
};

export default transactionService;