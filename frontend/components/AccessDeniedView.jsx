import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, UserCheck, Shield } from 'lucide-react';
import { TAB_LABELS, REQUIRED_ROLES_MAP, getPathFromTab, getRoleBadgeColor } from '../utils/roleAccess.js';

export const AccessDeniedView = ({ tabId, user, onNavigate }) => {
  const tabTitle = TAB_LABELS[tabId] || tabId || 'Restricted Page';
  const targetPath = getPathFromTab(tabId);
  const requiredRoles = REQUIRED_ROLES_MAP[tabId] || ['Admin'];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-xl w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600"></div>

        {/* Shield Icon Graphic */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-rose-500 p-1 rounded-full text-rose-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            HTTP 403 Forbidden • Access Denied
          </span>

          <h1 className="text-2xl font-extrabold text-white tracking-tight pt-2">
            Unauthorized Route Access Attempt
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            You do not possess the required RBAC role permissions to access <strong className="text-white font-mono">{targetPath}</strong> ({tabTitle}).
          </p>
        </div>

        {/* Role Matrix Comparison Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-medium">Your Active Account Role:</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'User'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Required Role Permissions:</span>
            <div className="flex flex-wrap gap-1">
              {requiredRoles.map((r, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-slate-800 text-sky-300 border border-slate-700 px-2 py-0.5 rounded font-bold">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-[11px] text-slate-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-left">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Security Notice: This unauthorized route access attempt has been recorded in the KMRL Immutable Audit Ledger for compliance logging.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Executive Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>View Account Profile & RBAC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
