import React from 'react';
import { getRoleBadgeColor, TAB_LABELS } from '../utils/roleAccess.js';
import { LogOut, Bell, Shield, Cpu, ChevronRight, User } from 'lucide-react';

export const Header = ({ user, activeTab, onNavigateTab, onLogout }) => {
  const currentTabTitle = TAB_LABELS[activeTab] || 'Dashboard';

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30 font-sans select-none">
      {/* Left: Branding & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onNavigateTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#00529B] flex items-center justify-center text-white font-black text-lg shadow-md border border-blue-400/30 group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white tracking-wide">KMRL Enterprise Portal</h1>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Spring Boot Gateway
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Kochi Metro Rail Limited • Role Security Engine</p>
          </div>
        </div>

        {/* Dynamic Breadcrumb Trail */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-4 border-l border-slate-800">
          <span>Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-blue-400 font-bold">{currentTabTitle}</span>
        </div>
      </div>

      {/* Right: Actions, Alerts & Profile */}
      <div className="flex items-center gap-3">
        {/* Gateway Health Status */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-slate-300 font-mono">Gateway: 3000 (UP)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Notifications Dispatch Icon */}
        <button
          onClick={() => onNavigateTab('notifications')}
          title="Notifications & Alerts"
          className={`relative p-2 rounded-xl transition-colors cursor-pointer border ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900">
            2
          </span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <button
            onClick={() => onNavigateTab('profile')}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Profile & Account Settings"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover border border-slate-700 shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{user.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{user.department || 'Operations'}</p>
            </div>
          </button>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
