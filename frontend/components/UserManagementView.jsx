import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Search, CheckCircle2, AlertCircle, Edit3, Lock, Building2, Mail, Check, X, UserX, Trash2 } from 'lucide-react';
import { fetchDefaultUsers, updateAdminUser, createAdminUser, deleteUserApi } from '../services/api.js';
import { getRoleBadgeColor, ROLE_PERMISSIONS } from '../utils/roleAccess.js';

export const UserManagementView = ({ onToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Edit Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Department Officer');
  const [newDept, setNewDept] = useState('Civil Works');
  const [newPassword, setNewPassword] = useState('password123');
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchDefaultUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (usr) => {
    setEditingUser(usr);
    setEditRole(usr.role);
    setEditDept(usr.department || 'Operations');
    setEditStatus(usr.status || 'Active');
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const updated = await updateAdminUser(editingUser.id, {
        role: editRole,
        department: editDept,
        status: editStatus
      });

      setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      setEditingUser(null);
      if (onToast) onToast(`Updated user permissions for ${updated.name} (${updated.role})`);
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setModalError('Please enter a valid full name and email address.');
      return;
    }

    try {
      const created = await createAdminUser({
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
        department: newDept,
        password: newPassword,
        status: 'Active'
      });

      setUsers(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setModalError(null);
      if (onToast) onToast(`Created new enterprise account: ${created.name} (${created.role})`);
    } catch (err) {
      setModalError(err.message || 'Failed to create user account.');
    }
  };

  const handleDeleteUser = async (usr) => {
    if (!window.confirm(`Are you sure you want to delete user account: ${usr.name} (${usr.email})?`)) return;
    try {
      await deleteUserApi(usr.id, 'ADMIN');
      setUsers(prev => prev.filter(u => u.id !== usr.id));
      if (onToast) onToast(`Deleted user account: ${usr.name}`);
    } catch (err) {
      alert(err.message || 'Failed to delete user account');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase">
              Admin Exclusive Module
            </span>
            <span className="text-xs text-slate-400">Spring Security RBAC Registry</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>User & Role Permission Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision officer accounts, assign role permissions (Admin, Compliance Officer, Department Officer, User), and configure department access tiers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Officer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by officer name, email, or department..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Admin', 'Compliance Officer', 'Department Officer', 'Manager', 'User'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === role
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading enterprise user accounts from Auth Gateway...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <UserX className="w-8 h-8 text-slate-500 mx-auto" />
            <div>No user accounts found matching your search criteria.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-4">Officer Name & Account</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Department Scope</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Permitted Modules</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={usr.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                          alt={usr.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{usr.name}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{usr.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getRoleBadgeColor(usr.role)}`}>
                        {usr.role}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-slate-300">
                      {usr.department || 'Operations'}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        usr.status === 'Suspended'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {usr.status || 'Active'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(ROLE_PERMISSIONS[usr.role] || []).slice(0, 4).map((mod, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
                            {mod}
                          </span>
                        ))}
                        {(ROLE_PERMISSIONS[usr.role] || []).length > 4 && (
                          <span className="text-[10px] bg-slate-800 text-blue-400 border border-slate-700 px-1.5 py-0.5 rounded font-bold">
                            +{(ROLE_PERMISSIONS[usr.role] || []).length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(usr)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Edit Role</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usr)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-500/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Delete User Account (Admin Privileges Required)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Edit Account Role & Scope</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1 text-xs">
              <div className="font-bold text-white">{editingUser.name}</div>
              <div className="text-slate-400 font-mono">{editingUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Enterprise Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Admin">Admin (Full System Access)</option>
                  <option value="Compliance Officer">Compliance Officer (Audits & Governance)</option>
                  <option value="Department Officer">Department Officer (Intake & Approvals)</option>
                  <option value="Manager">Manager (Operations Oversight)</option>
                  <option value="User">User (Standard Read-Only Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department Allocation</label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Civil Works">Civil Works & Viaducts</option>
                  <option value="Operations">Operations & Signals</option>
                  <option value="Legal & Regulatory">Legal & Regulatory Compliance</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Safety Audit">Safety & CMRS Audit</option>
                  <option value="Water Metro Operations">Water Metro Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active (Permitted to Log In)</option>
                  <option value="Suspended">Suspended (Access Blocked)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 cursor-pointer"
              >
                Save Role Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Provision New Officer Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Officer Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anand Varma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">KMRL Email Address *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. anand@kmrl.co.in"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Department Officer">Department Officer</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Civil Works">Civil Works</option>
                    <option value="Operations">Operations</option>
                    <option value="Legal & Regulatory">Legal & Regulatory</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Safety Audit">Safety Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Temporary Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 cursor-pointer"
              >
                Provision Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
