import React, { useState } from 'react';
import { User, Shield, Building2, Mail, Lock, Key, Bell, CheckCircle2, Save, Laptop, Sparkles } from 'lucide-react';
import { getRoleBadgeColor, ROLE_PERMISSIONS, TAB_LABELS } from '../utils/roleAccess.js';

export const ProfileView = ({ user, onUpdateUser, onToast }) => {
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || 'Operations');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slaAlerts, setSlaAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  const permissions = ROLE_PERMISSIONS[user?.role] || ROLE_PERMISSIONS['User'];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const updated = {
        ...user,
        name,
        department
      };
      if (onUpdateUser) onUpdateUser(updated);
      if (onToast) onToast('Updated profile details and officer preferences.');
      setSaving(false);
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'User'}
            </span>
            <span className="text-xs text-slate-400">Officer Account & Security Scope</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Profile & Account Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View your assigned RBAC module permissions, edit personal officer details, and configure alert preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg"
              />
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role}
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                    {user?.department || 'Operations'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Officer Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Officer Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">KMRL Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 text-slate-400 font-mono rounded-xl px-3 py-2 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Assigned Department Scope</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
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
                  <label className="block text-slate-400 font-semibold mb-1">Role Hierarchy Tier</label>
                  <input
                    type="text"
                    value={user?.role || 'User'}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 text-slate-400 font-bold rounded-xl px-3 py-2 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Alert & Notification Preferences</h3>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">SLA Breach Escalation Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive instant alerts when workflow stages breach SLA hours.</div>
                </div>
                <input
                  type="checkbox"
                  checked={slaAlerts}
                  onChange={(e) => setSlaAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Email Digest & Revision Submissions</div>
                  <div className="text-[11px] text-slate-400">Receive notifications on new document version submissions in your department.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating Account...' : 'Save Profile Settings'}</span>
              </button>
            </div>
          </form>

          {/* Security & Authentication Node Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Spring Security JWT Session Audit</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-slate-400 font-medium">Gateway Node</div>
                <div className="text-white font-mono font-bold mt-1">172.16.4.18:3000 (Cloud Run)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-slate-400 font-medium">JWT Token Signature</div>
                <div className="text-emerald-400 font-mono font-bold mt-1 truncate">
                  kmrl_jwt_eyJhbGciOiJIUzI1Ni...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permitted Modules Matrix Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs text-blue-400 font-mono font-bold">RBAC Entitlements Matrix</div>
              <h2 className="text-sm font-bold text-white mt-1">Permitted Portal Modules</h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Modules explicitly granted to <strong className="text-white">{user?.role}</strong> role.
              </p>
            </div>

            <div className="space-y-2">
              {permissions.map((tabId) => (
                <div key={tabId} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{TAB_LABELS[tabId] || tabId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
