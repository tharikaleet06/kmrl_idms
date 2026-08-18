import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle2, FileText, ArrowRight, Filter, ShieldAlert, Check } from 'lucide-react';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'SLA_BREACH',
    title: 'SLA Overdue Escalation: Viaduct Section Alignment Clearance',
    docId: 'KMRL-CIVIL-2026-089',
    department: 'Civil Works',
    time: '25 minutes ago',
    read: false,
    priority: 'CRITICAL',
    message: 'Workflow approval at Stage 2 (Joint General Manager) exceeded the 48-hour SLA threshold. Auto-escalated to Executive Director.',
    targetTab: 'workflows'
  },
  {
    id: 'notif-2',
    type: 'COMPLIANCE',
    title: 'Upcoming Audit Deadline: CMRS Annual Rail Safety Clearance',
    docId: 'KMRL-SAF-2026-012',
    department: 'Safety & CMRS Audit',
    time: '2 hours ago',
    read: false,
    priority: 'HIGH',
    message: 'Regulatory compliance filing due in 4 days. Inspection evidence report pending final sign-off from Legal.',
    targetTab: 'compliance'
  },
  {
    id: 'notif-3',
    type: 'REVISION',
    title: 'New Document Revision Uploaded: Phase-II Station Platform Technical Plan',
    docId: 'KMRL-ENG-2026-044',
    department: 'Operations',
    time: '5 hours ago',
    read: false,
    priority: 'MEDIUM',
    message: 'Officer Suresh Kumar submitted Revision v1.1 with updated platform edge door dimensions.',
    targetTab: 'search'
  },
  {
    id: 'notif-4',
    type: 'SYSTEM',
    title: 'Spring Cloud Eureka Node Status Check',
    docId: 'SYS-MONITOR',
    department: 'Operations',
    time: '1 day ago',
    read: true,
    priority: 'INFO',
    message: 'Microservice Registry sync complete. 6 of 6 microservices healthy on port 3000.',
    targetTab: 'microservices'
  },
  {
    id: 'notif-5',
    type: 'WORKFLOW_APPROVED',
    title: 'Workflow Approved: Kakkanad Extension Land Acquisition Notice',
    docId: 'KMRL-LA-2026-102',
    department: 'Legal & Regulatory',
    time: '1 day ago',
    read: true,
    priority: 'LOW',
    message: 'All 3 approval chain stages completed. Land acquisition gazette notice finalized.',
    targetTab: 'search'
  }
];

export const NotificationsView = ({ onNavigateTab, userRole }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (unreadOnly && n.read) return false;
    if (filterType === 'CRITICAL' && n.priority !== 'CRITICAL') return false;
    if (filterType === 'SLA' && n.type !== 'SLA_BREACH') return false;
    if (filterType === 'COMPLIANCE' && n.type !== 'COMPLIANCE') return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'CRITICAL' && !n.read).length;

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">
              Real-time Alert Dispatcher
            </span>
            <span className="text-xs text-slate-400">Portal Notifications & SLA Warnings</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <span>Notifications & Alert Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated on SLA breach escalations, compliance deadlines, document revisions, and workflow actions.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Alert Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Unread Notifications</div>
            <div className="text-lg font-extrabold text-white">{unreadCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Critical SLA Breaches</div>
            <div className="text-lg font-extrabold text-rose-400">{criticalCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Compliance Audits Due</div>
            <div className="text-lg font-extrabold text-amber-400">1 Urgent</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Alerts', val: 'ALL' },
            { label: 'SLA Breaches', val: 'SLA' },
            { label: 'Compliance', val: 'COMPLIANCE' },
            { label: 'Critical Only', val: 'CRITICAL' }
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterType(f.val)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                filterType === f.val
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span>Show Unread Only</span>
        </label>
      </div>

      {/* Notifications Cards Stack */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div>No notifications match your filter criteria. All caught up!</div>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                !item.read
                  ? item.priority === 'CRITICAL'
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-lg'
                    : 'bg-slate-900/90 border-blue-500/40'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.priority === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : item.type === 'COMPLIANCE'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {item.priority === 'CRITICAL' ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-800 text-blue-400 border border-slate-700 px-2 py-0.5 rounded font-bold">
                        {item.docId}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.department}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.priority === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                    <div className="text-[11px] text-slate-400 font-mono pt-1">{item.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleMarkAsRead(item.id);
                      if (onNavigateTab) onNavigateTab(item.targetTab);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
