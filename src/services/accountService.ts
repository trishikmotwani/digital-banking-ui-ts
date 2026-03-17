import axiosClient from '../api/api';
import { Account, Transaction } from '../types';

const accountService = {
  // Manager: Create Account for a specific customer
  createAccount: async (customerId: string, accountData: Partial<Account>): Promise<Account> => {
    const response = await axiosClient.post<Account>(
      `/accounts/manager/create/${customerId}`, 
      accountData
    );
    return response.data;
  },

  // Manager: Change status (Block/Unblock) using query params
  updateStatus: async (id: number, status: string): Promise<Account> => {
    const response = await axiosClient.patch<Account>(
      `/accounts/manager/status/${id}?status=${status}`
    );
    return response.data;
  },

  // Manager: View All Accounts in the system
  viewAllAccounts: async (): Promise<Account[]> => {
    const response = await axiosClient.get<Account[]>('/accounts/manager/all');
    return response.data;
  },

  // Customer: Get specific account balance
  viewBalance: async (accountNumber: string): Promise<number> => {
    const response = await axiosClient.get<number>(
      `/accounts/customer/balance/${accountNumber}`
    );
    return response.data;
  },

  // Customer: Get Statement (List of transactions for an account)
  viewStatement: async (accountNumber: string): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>(
      `/accounts/customer/statement/${accountNumber}`
    );
    return response.data;
  }
};

export default accountService;
