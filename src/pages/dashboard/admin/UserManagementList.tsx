import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import { UserDto, UserRole } from '../../../types';

const UserManagementList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Track pending role changes locally for each user row
  const [pendingRoles, setPendingRoles] = useState<{ [key: string]: typeof UserRole[keyof typeof UserRole] }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      alert("Failed to load users: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string) => {
    const newRole = pendingRoles[userId];
    if (!newRole) return; // No change selected

    try {
      // Calls: PATCH /api/user/{userId}/role
      await userService.updateRole(userId, newRole);
      
      // Update local main list
      setUsers(users.map(u => u.userId === userId ? { ...u, role: newRole } : u));
      
      // Clear the pending state for this user
      const updatedPending = { ...pendingRoles };
      delete updatedPending[userId];
      setPendingRoles(updatedPending);
      
      alert("Role updated successfully!");
    } catch (err: any) {
      alert("Error updating role: " + err);
    }
  };

  const handleSelectChange = (userId: string, role: string) => {
    setPendingRoles({
      ...pendingRoles,
      [userId]: role as typeof UserRole[keyof typeof UserRole]
    });
  };

  if (loading) return <div className="text-center p-5 text-muted">Loading users...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">User Management</h5>
      </div>
      <div className="table-responsive p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Current Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td className="fw-bold">{user.username}</td>
                <td className="small text-muted">{user.userId}</td>
                <td>
                  <span className={`badge ${
                    user.role === UserRole.ROLE_ADMIN ? 'bg-danger' : 
                    user.role === UserRole.ROLE_MANAGER ? 'bg-warning text-dark' : 'bg-info'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <select 
                      className="form-select form-select-sm" 
                      value={pendingRoles[user.userId] || user.role}
                      onChange={(e) => handleSelectChange(user.userId, e.target.value)}
                    >
                      <option value={UserRole.ROLE_USER}>USER</option>
                      <option value={UserRole.ROLE_MANAGER}>MANAGER</option>
                      <option value={UserRole.ROLE_ADMIN}>ADMIN</option>
                    </select>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleRoleUpdate(user.userId)}
                      disabled={!pendingRoles[user.userId] || pendingRoles[user.userId] === user.role}
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementList;
