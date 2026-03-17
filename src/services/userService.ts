import axiosClient from '../api/api';
import { UserDto, UserRole } from '../types';

const userService = {
  // POST: /api/user/register-user
  register: async (userData: any): Promise<UserDto> => {
    try {
      const response = await axiosClient.post<UserDto>('/user/register-user', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // POST: /api/user/login
  login: async (credentials: any): Promise<string> => {
    try {
      const response = await axiosClient.post<string>('/user/login', credentials);
      // response.data is the JWT token string
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // POST: /api/user/reset-password/{username}
  resetPassword: async (username: string): Promise<string> => {
    try {
      const response = await axiosClient.post<string>(`/user/reset-password/${username}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // GET: /api/user/get-all
  getAllUsers: async (): Promise<UserDto[]> => {
    try {
      const response = await axiosClient.get<UserDto[]>('/user/get-all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // GET: /api/user/details/{username}
  getUserDetails: async (username: string): Promise<UserDto> => {
    try {
      const response = await axiosClient.get<UserDto>(`/user/details/${username}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // PATCH: /api/user/{userId}/role
  updateRole: async (userId: string, newRole: UserRole): Promise<string> => {
    try {
      const response = await axiosClient.patch<string>(`/user/${userId}/role`, newRole);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;
