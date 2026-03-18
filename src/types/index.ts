/** 
 * src/types/index.ts
 * Global Type Definitions for Digital Banking App
 */

export const UserRole = {
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_MANAGER: 'ROLE_MANAGER'
} as const;

export interface UserDto {
  userId: string;
  username: string;
  role: typeof UserRole[keyof typeof UserRole];
}

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
  accountType: 'SAVINGS' | 'CURRENT' | 'LOAN'; // Add this field
}

// export interface Transaction {
//   id: string;
//   amount: number;
//   description: string;
//   type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'BILL_PAYMENT';
//   createdAt: string;
//   senderAccount?: Account;
//   receiverAccount?: Account;
// }

// in types.ts or wherever Transaction is defined
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAW';
  senderAccountNumber: string;   // Flat string now
  receiverAccountNumber: string; // Flat string now
  createdAt: string;
}

export interface Customer {
  userId: string;
  username: string;
  age: number;
  income: number;
  mobileNumber: string;
  kycVerified: boolean;
  role: typeof UserRole[keyof typeof UserRole];
  isDeleted: boolean;
}
