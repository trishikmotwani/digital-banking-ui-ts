import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import { UserDto, UserRole } from '../../../types';
import CreateAccountModal from '../../account/CreateAccountModal';

const UserManagementList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Track pending role changes locally for each user row
  const [pendingRoles, setPendingRoles] = useState<{ [key: string]: typeof UserRole[keyof typeof UserRole] }>({});
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<{id: string, username: string} | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const openAccountModal = (userId: string, username: string) => {
    setSelectedUser({ id: userId, username: username });
    setShowModal(true);
  };

  const handleRoleUpdate = async (userId: string) => {
    const newRole = pendingRoles[userId];
    if (!newRole) return;

    try {
      await userService.updateRole(userId, newRole);
      setUsers(users.map(u => u.userId === userId ? { ...u, role: newRole } : u));
      
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
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-primary">User Management</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>
      
      <div className="table-responsive p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light text-secondary small text-uppercase">
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th className="text-center">Account Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td className="fw-bold">{user.username}</td>
                <td className="small text-muted font-monospace">{user.userId}</td>
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
                      style={{ width: '130px' }}
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
                <td className="text-center">
                  {user.role === UserRole.ROLE_USER && (
                    <button 
                      className="btn btn-sm btn-success px-3"
                      onClick={() => openAccountModal(user.username, user.username)}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Open Account
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account Creation Modal Logic */}
      {selectedUser && (
        <CreateAccountModal 
          show={showModal} 
          handleClose={() => setShowModal(false)}
          customerId={selectedUser.id}
          customerUsername={selectedUser.username}
          onSuccess={fetchUsers} 
        />
      )}
    </div>
  );
};

export default UserManagementList;
