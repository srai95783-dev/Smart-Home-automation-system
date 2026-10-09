import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Modal } from '../../components/common/Modal';
import { UserPlus, Edit2, Trash2, Shield, User, Check, X } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'HOMEOWNER',
  });

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    role: 'HOMEOWNER',
    active: true,
  });

  const loadUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createUser(createForm);
      if (res.success && res.data) {
        setUsers((prev) => [...prev, res.data]);
        setIsCreateOpen(false);
        setCreateForm({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          role: 'HOMEOWNER',
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      active: user.active,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await adminApi.updateUser(selectedUser.id, editForm);
      if (res.success && res.data) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? res.data : u)));
        setIsEditOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Loading registered user directory...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Create new platform accounts, assign security roles, and manage permissions</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-pill ${u.role === 'ADMIN' ? 'admin' : 'homeowner'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: u.active ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {u.active ? <Check size={14} /> : <X size={14} />}
                      <span>{u.active ? 'Active' : 'Disabled'}</span>
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(u)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Edit User"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.6rem', color: '#f87171' }}
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New User Account">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={createForm.fullName}
              onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Role</label>
            <select
              className="form-select"
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
            >
              <option value="HOMEOWNER">HOMEOWNER (Standard User)</option>
              <option value="ADMIN">ADMIN (System Administrator)</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit User: ${selectedUser?.email}`}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="HOMEOWNER">HOMEOWNER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="activeStatus"
              checked={editForm.active}
              onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="activeStatus" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
              Account Active (Uncheck to suspend login)
            </label>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
