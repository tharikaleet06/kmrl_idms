import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Clock, Building2, CheckCircle2, Plus, Search, Filter, RefreshCw, X, ShieldAlert, FileText } from 'lucide-react';
import { fetchComplianceRecords, createComplianceRecord, updateComplianceRecord, requestComplianceReview, markComplianceStatus, createAuditLog } from '../services/api.js';

export const ComplianceView = ({ userRole = 'ADMIN', onToast }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Provision Rule Modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Statutory Safety');
  const [newDept, setNewDept] = useState('Operations & Safety');
  const [newOfficer, setNewOfficer] = useState('Compliance Officer');
  const [newStatus, setNewStatus] = useState('Under Review');
  const [newDate, setNewDate] = useState('2026-09-30');
  const [newNotes, setNewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchComplianceRecords();
      setRecords(data);
    } catch (e) {
      console.error('Failed to load compliance records:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStat) => {
    try {
      let updated;
      if (newStat === 'Under Review') {
        updated = await requestComplianceReview(id, `${userRole} Officer`, 'Review requested via KMRL Compliance Management Portal');
      } else {
        updated = await markComplianceStatus(id, newStat, `${userRole} Officer`, `Status marked as ${newStat}`);
      }
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStat, ...(updated || {}) } : r));
      if (onToast) onToast(`Compliance record ${id} status updated to "${newStat}".`);
      await createAuditLog({
        user: `${userRole.toLowerCase()}@kmrl.co.in`,
        action: newStat === 'Under Review' ? 'COMPLIANCE_REVIEW_REQUESTED' : 'COMPLIANCE_STATUS_UPDATE',
        details: `Compliance clearance ${id} status updated to ${newStat}`
      });
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('Please enter a regulation title');

    setSubmitting(true);
    try {
      const newRec = await createComplianceRecord({
        title: newTitle,
        regulationType: newType,
        department: newDept,
        officer: newOfficer,
        status: newStatus,
        auditDate: newDate,
        notes: newNotes || 'Rule initialized by KMRL Compliance Panel.'
      });
      setRecords(prev => [newRec, ...prev]);
      setShowModal(false);
      setNewTitle('');
      setNewNotes('');
      if (onToast) onToast('New compliance regulation record provisioned in MySQL database.');

      await createAuditLog({
        user: `${userRole.toLowerCase()}@kmrl.co.in`,
        action: 'COMPLIANCE_RULE_PROVISIONED',
        details: `Provisioned new statutory regulation record ${newRec.id || newTitle}`
      });
    } catch (err) {
      alert('Failed to provision compliance record: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(item => {
    if (activeTab !== 'All' && item.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || item.requirement || '').toLowerCase().includes(q);
      const matchDept = (item.department || '').toLowerCase().includes(q);
      const matchType = (item.regulationType || item.regulatoryBody || '').toLowerCase().includes(q);
      const matchOfficer = (item.officer || item.assignedOfficer || '').toLowerCase().includes(q);
      return matchTitle || matchDept || matchType || matchOfficer;
    }
    return true;
  });

  const totalCount = records.length;
  const compliantCount = records.filter(r => r.status === 'Compliant').length;
  const reviewCount = records.filter(r => r.status === 'Under Review').length;
  const nonCompliantCount = records.filter(r => r.status === 'Non-Compliant' || r.status === 'SLA Breached').length;
  const complianceRate = totalCount > 0 ? ((compliantCount / totalCount) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Regulatory & Statutory Compliance Ledger</h1>
            <p className="text-xs text-slate-400">
              Live legal clearance registry, CMRS safety audits, and environmental NOC status synced with MySQL.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadRecords}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Ledger</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl border border-amber-400/30 flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Regulation Rule</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compliance Index</span>
          <div className="text-xl font-black text-emerald-400">{complianceRate}%</div>
          <span className="text-[10px] text-slate-500">{compliantCount} of {totalCount} rules satisfied</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Under Audit Review</span>
          <div className="text-xl font-black text-amber-400">{reviewCount}</div>
          <span className="text-[10px] text-slate-500">Pending CMRS & PCB clearances</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Non-Compliant / SLA Risk</span>
          <div className="text-xl font-black text-rose-400">{nonCompliantCount}</div>
          <span className="text-[10px] text-slate-500">Escalated statutory violations</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Rules & Statutes</span>
          <div className="text-xl font-black text-blue-400">{totalCount}</div>
          <span className="text-[10px] text-slate-500">Persisted in MySQL ledger</span>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['All', 'Compliant', 'Under Review', 'Non-Compliant'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              {tab}
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
            placeholder="Search regulations, officers..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Compliance Cards Grid */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs font-mono">
          Loading statutory compliance ledger from MySQL...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
          <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
          <div className="font-bold text-slate-300">No records found for the selected filters.</div>
          <p className="text-[11px] text-slate-500">Try adjusting your search criteria or provision a new regulation rule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((item) => {
            const isNonComp = item.status === 'Non-Compliant' || item.status === 'SLA Breached';
            const isComp = item.status === 'Compliant';

            return (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                      {item.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isNonComp
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isComp
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title || item.requirement || item.regulatoryBody}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.notes || item.requirement}</p>

                  <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Type: <span className="text-slate-200">{item.regulationType || item.regulatoryBody || 'Statutory'}</span></span>
                      <span>Department: <span className="text-slate-200">{item.department}</span></span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Officer: <span className="text-slate-200">{item.officer || item.assignedOfficer}</span></span>
                      <span>Audit Date: <span className="text-white">{item.auditDate || item.deadline}</span></span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Update Clearance</span>
                  <div className="flex items-center gap-1.5">
                    {item.status !== 'Compliant' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'Compliant')}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        ✓ Mark Compliant
                      </button>
                    )}
                    {item.status !== 'Under Review' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'Under Review')}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all cursor-pointer"
                      >
                        ● Request Review
                      </button>
                    )}
                    {item.status !== 'Non-Compliant' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'Non-Compliant')}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-500/30 transition-all cursor-pointer"
                      >
                        ✕ Flag Non-Compliant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Provision Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Provision Statutory Regulation</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Regulation Title / Requirement</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CMRS Phase II Track Signal Clearance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Regulation Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Statutory Safety">Statutory Safety</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Financial Audit">Financial Audit</option>
                    <option value="Land Acquisition">Land Acquisition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Operations & Safety">Operations & Safety</option>
                    <option value="Civil Works">Civil Works</option>
                    <option value="Finance & Legal">Finance & Legal</option>
                    <option value="Safety & Security">Safety & Security</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Compliant">Compliant</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audit Deadline</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assigned Officer</label>
                <input
                  type="text"
                  value={newOfficer}
                  onChange={(e) => setNewOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Compliance Notes</label>
                <textarea
                  rows="2"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Statutory requirements or NOC clearance conditions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  {submitting ? 'Provisioning...' : 'Provision Regulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
