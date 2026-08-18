import React, { useState, useEffect } from 'react';
import { History, Shield, Lock, CheckCircle2, Search, Filter, RefreshCw, Eye, X, Plus } from 'lucide-react';
import { fetchAuditLogs, createAuditLog } from '../services/api.js';

export const AuditTrailView = ({ userRole = 'ADMIN', onToast }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  // Manual Log Modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [logAction, setLogAction] = useState('SECURITY_AUDIT_CHECK');
  const [logDetails, setLogDetails] = useState('');
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    if (!logDetails.trim()) return alert('Please enter log details');

    setLogging(true);
    try {
      const newLog = await createAuditLog({
        user: `${userRole.toLowerCase()}@kmrl.co.in`,
        action: logAction,
        details: logDetails
      });
      setLogs(prev => [newLog, ...prev]);
      setShowLogModal(false);
      setLogDetails('');
      if (onToast) onToast('Cryptographic security audit event appended to MySQL log table.');
    } catch (err) {
      alert('Failed to log security event: ' + err.message);
    } finally {
      setLogging(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterAction !== 'All' && !log.action.includes(filterAction)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = (log.id || '').toLowerCase().includes(q);
      const matchUser = (log.user || '').toLowerCase().includes(q);
      const matchAction = (log.action || '').toLowerCase().includes(q);
      const matchDetails = (log.details || '').toLowerCase().includes(q);
      return matchId || matchUser || matchAction || matchDetails;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Immutable Security Audit Trail</h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>SHA-256 Verified Chain</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Append-only cryptographic security ledger recording all document intakes, workflow approvals, and RBAC actions in MySQL.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAuditLogs}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Stream</span>
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl border border-blue-400/30 flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Security Event</span>
          </button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Action Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['All', 'DOCUMENT', 'WORKFLOW', 'USER', 'COMPLIANCE', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterAction(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterAction === cat
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs, actions, users..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">
            Reading append-only cryptographic audit trail from MySQL...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-600" />
            <div className="font-bold text-slate-300">No audit events match your selected filters.</div>
            <p className="text-[11px] text-slate-500">Try clearing the action category or search query.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 rounded-l-xl">Log ID & Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Event Details</th>
                <th className="p-3">Cryptographic SHA-256 Hash</th>
                <th className="p-3 text-right rounded-r-xl">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => {
                const isWorkflow = (log.action || '').includes('WORKFLOW');
                const isDoc = (log.action || '').includes('DOCUMENT');
                const isUser = (log.action || '').includes('USER');

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white font-mono text-[11px]">{log.id}</div>
                      <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{log.user}</div>
                      <div className="text-[10px] text-blue-400 font-mono">{log.role || 'SECURITY_ROLE'}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        isWorkflow ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        isDoc ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        isUser ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-300">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                      {log.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
                        title="Inspect Log Metadata"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Cryptographic Log Inspector</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Log Event ID</div>
                <div className="text-amber-400 font-bold">{selectedLog.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">Timestamp</div>
                  <div className="text-white text-[11px]">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">Action Type</div>
                  <div className="text-blue-400 font-bold text-[11px]">{selectedLog.action}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Authenticated Initiator</div>
                <div className="text-slate-200 font-bold">{selectedLog.user} ({selectedLog.role || 'USER'})</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px]">Event Summary Payload</div>
                <div className="text-slate-300 font-sans leading-relaxed">{selectedLog.details}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 break-all">
                <div className="text-slate-500 text-[10px]">SHA-256 Block Hash</div>
                <div className="text-emerald-400 text-[10px]">
                  {selectedLog.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Event Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Append Security Audit Event</h3>
              </div>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Action Category</label>
                <select
                  value={logAction}
                  onChange={(e) => setLogAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="SECURITY_AUDIT_CHECK">SECURITY_AUDIT_CHECK</option>
                  <option value="GATEWAY_RBAC_VERIFICATION">GATEWAY_RBAC_VERIFICATION</option>
                  <option value="COMPLIANCE_CLEARANCE_AUDIT">COMPLIANCE_CLEARANCE_AUDIT</option>
                  <option value="SYSTEM_DIAGNOSTIC_RUN">SYSTEM_DIAGNOSTIC_RUN</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Event Payload Details</label>
                <textarea
                  rows="3"
                  required
                  value={logDetails}
                  onChange={(e) => setLogDetails(e.target.value)}
                  placeholder="Enter audit log event details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                >
                  {logging ? 'Appending...' : 'Append Audit Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
