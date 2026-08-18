import React from 'react';
import { isTabAllowedForRole, getRoleBadgeColor } from '../utils/roleAccess.js';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  Search,
  CheckSquare,
  MapPin,
  ShieldCheck,
  History,
  Server,
  Users,
  Sliders,
  Bell,
  User,
  Shield
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange, userRole }) => {
  const sections = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'documents', label: 'Document Intake & Classifier', icon: FilePlus2 },
        { id: 'my-documents', label: 'My Documents Repository', icon: FileText },
        { id: 'search', label: 'Semantic Repository Search', icon: Search },
        { id: 'workflows', label: 'SLA Workflows & Approvals', icon: CheckSquare },
        { id: 'geospatial', label: 'Geospatial OCR & Route Maps', icon: MapPin }
      ]
    },
    {
      title: 'Compliance & Audit',
      items: [
        { id: 'compliance', label: 'Compliance Ledger', icon: ShieldCheck },
        { id: 'audit', label: 'Immutable Audit Trail', icon: History }
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'microservices', label: 'Spring Boot & Eureka Console', icon: Server },
        { id: 'admin-users', label: 'User & Role Management', icon: Users }
      ]
    },

    {
      title: 'Account & Alerts',
      items: [
        { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        { id: 'profile', label: 'Profile & Account Settings', icon: User }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 font-sans p-4 select-none overflow-y-auto">
      <div className="space-y-5">
        {sections.map((sec, secIdx) => {
          const visibleItems = sec.items.filter(item => isTabAllowedForRole(userRole, item.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {sec.title}
              </div>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00529B] text-white shadow-lg shadow-blue-900/30 font-bold border border-blue-400/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Role Notice */}
      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 mt-6 shrink-0">
        <div className="font-semibold text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Role</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(userRole)}`}>
            {userRole}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Sidebar items dynamically adapt according to your authenticated Spring Security RBAC role.
        </p>
      </div>
    </aside>
  );
};
