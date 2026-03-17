import axiosClient from '../api/api';
import { UserRole } from '../types';

// Matching your Spring CustomerEntity
export interface Customer {
  userId: string;
  username: string;
  age: number;
  income: number;
  mobileNumber: string;
  kycVerified: boolean;
  role: UserRole;
  isDeleted: boolean;
}

const customerService = {
  // Add a new customer record
  addCustomer: async (customerData: Partial<Customer>): Promise<Customer> => {
    const response = await axiosClient.post<Customer>('/customers/add', customerData);
    return response.data;
  },

  // Update existing customer profile (Age, Income, etc.)
  updateCustomer: async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    const response = await axiosClient.put<Customer>(`/customers/${id}`, customerData);
    return response.data;
  },

  // Soft delete / Archive customer
  deleteCustomer: async (id: string): Promise<string> => {
    const response = await axiosClient.delete<string>(`/customers/${id}`);
    return response.data;
  },

  // Manager/Admin: List all non-deleted customers
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await axiosClient.get<Customer[]>('/customers/all');
    return response.data;
  },

  // KYC Verification logic
  verifyKyc: async (mobileNumber: string): Promise<Customer> => {
    const response = await axiosClient.patch<Customer>(`/customers/verify-kyc/${mobileNumber}`);
    return response.data;
  }
};

export default customerService;
