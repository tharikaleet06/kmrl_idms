import React, { useState, useEffect } from 'react';
import { Sliders, Building, Tag, Clock, ShieldCheck, Activity, Plus, Save, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { fetchSystemConfig, updateSystemConfig, addDepartmentConfig, addCategoryConfig, fetchEurekaServices } from '../services/api.js';

export const SystemConfigView = ({ onToast }) => {
  const [config, setConfig] = useState(null);
  const [eurekaData, setEurekaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal / Drawer state for adding department or category
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptLead, setNewDeptLead] = useState('');

  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrefix, setNewCatPrefix] = useState('');
  const [newCatRetention, setNewCatRetention] = useState('10');
  const [newCatSla, setNewCatSla] = useState('24');
  const [newCatConfidentiality, setNewCatConfidentiality] = useState('Internal Only');

  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    setLoading(true);
    try {
      const [cfg, eureka] = await Promise.all([
        fetchSystemConfig(),
        fetchEurekaServices()
      ]);
      setConfig(cfg);
      setEurekaData(eureka);
    } catch (err) {
      console.error('Failed to load system config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlaRules = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSystemConfig({
        slaRules: config.slaRules,
        systemSettings: config.systemSettings
      });
      setConfig(updated);
      if (onToast) onToast('Updated SLA workflow parameters and system governance rules.');
    } catch (err) {
      alert('Failed to save configuration settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      const res = await addDepartmentConfig({
        name: newDeptName.trim(),
        code: newDeptCode.trim(),
        lead: newDeptLead.trim()
      });
      setConfig(res.config);
      setShowDeptModal(false);
      setNewDeptName('');
      setNewDeptCode('');
      setNewDeptLead('');
      if (onToast) onToast(`Added new department: ${newDeptName}`);
    } catch (err) {
      alert('Failed to add department');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await addCategoryConfig({
        name: newCatName.trim(),
        prefix: newCatPrefix.trim(),
        retentionYears: newCatRetention,
        slaHours: newCatSla,
        confidentiality: newCatConfidentiality
      });
      setConfig(res.config);
      setShowCatModal(false);
      setNewCatName('');
      setNewCatPrefix('');
      if (onToast) onToast(`Added document classification category: ${newCatName}`);
    } catch (err) {
      alert('Failed to add category');
    }
  };

  if (loading || !config) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">
        Initializing KMRL Enterprise System Governance & Configuration Engine...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase">
              Admin Exclusive Module
            </span>
            <span className="text-xs text-slate-400">Governance & Parameter Engine</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Enterprise System Configuration & SLA Rules</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage KMRL departments, document retention lifecycles, workflow SLA escalation thresholds, and system health parameters.
          </p>
        </div>

        <button
          onClick={loadConfigData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Reload Config</span>
        </button>
      </div>

      {/* Grid Layout for Config Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SLA & Workflow Escalation Rules Form */}
        <form onSubmit={handleSaveSlaRules} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white">SLA Approval Workflow Rules</h2>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save SLA Rules'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Stage 1 (Section Officer) SLA (Hours)</label>
              <input
                type="number"
                value={config.slaRules.stage1Hours}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, stage1Hours: parseInt(e.target.value) || 24 }
                })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Stage 2 (Joint GM) SLA (Hours)</label>
              <input
                type="number"
                value={config.slaRules.stage2Hours}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, stage2Hours: parseInt(e.target.value) || 48 }
                })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Stage 3 (Executive Dir.) SLA (Hours)</label>
              <input
                type="number"
                value={config.slaRules.stage3Hours}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, stage3Hours: parseInt(e.target.value) || 24 }
                })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Auto-Escalation Warning Trigger (Hours)</label>
              <input
                type="number"
                value={config.slaRules.autoEscalateHours}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, autoEscalateHours: parseInt(e.target.value) || 12 }
                })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 text-xs space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Breach Escalation Notification Email</label>
              <input
                type="email"
                value={config.slaRules.breachNotificationEmail}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, breachNotificationEmail: e.target.value }
                })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Emergency Fast-Track Workflow Bypass</div>
                <div className="text-[11px] text-slate-400">Allows Executive Directors to bypass lower stage sign-offs in emergencies.</div>
              </div>
              <input
                type="checkbox"
                checked={config.slaRules.emergencyBypassEnabled}
                onChange={(e) => setConfig({
                  ...config,
                  slaRules: { ...config.slaRules, emergencyBypassEnabled: e.target.checked }
                })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* System & NLP Health Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">NLP & System Health Parameters</h2>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
              Spring Cloud Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <div className="font-bold text-white">AI Classification Engine Model</div>
                <div className="text-[11px] text-slate-400">Gemini 1.5 Pro Enterprise Classifier</div>
              </div>
              <span className="font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20 font-bold">
                {config.systemSettings.autoClassifyAiModel}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <div className="font-bold text-white">OCR Confidence Threshold</div>
                <div className="text-[11px] text-slate-400">Min confidence to auto-approve geospatial tagging</div>
              </div>
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-bold">
                {config.systemSettings.ocrConfidenceThreshold}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <div className="font-bold text-white">Eureka Service Registry Heartbeat</div>
                <div className="text-[11px] text-slate-400">Microservice status broadcast interval</div>
              </div>
              <span className="font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-bold">
                {config.systemSettings.eurekaHeartbeatSeconds}s
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <div className="font-bold text-white">Immutable Audit Ledger Hashing</div>
                <div className="text-[11px] text-slate-400">SHA-256 Cryptographic Hash Chain</div>
              </div>
              <span className="font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20 font-bold">
                Active
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Departments & Document Categories Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Config Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold text-white">KMRL Department Registry</h2>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="space-y-2">
            {config.departments.map((dept) => (
              <div key={dept.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span>{dept.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Head: {dept.lead}</div>
                </div>

                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded">
                  {dept.activeCount || 5} Active Members
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Categories Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Document Categories & Lifecycle</h2>
            </div>
            <button
              onClick={() => setShowCatModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-2">
            {config.categories.map((cat) => (
              <div key={cat.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                      {cat.prefix}
                    </span>
                    <span>{cat.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Retention: <strong className="text-slate-200">{cat.retentionYears} Years</strong> | Default SLA: <strong className="text-amber-400">{cat.slaHours}h</strong>
                  </div>
                </div>

                <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded">
                  {cat.confidentiality}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddDept} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Register New KMRL Department</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department Name *</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Rolling Stock Maintenance"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Code *</label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  placeholder="e.g. RS-MAINT"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department Head / Officer</label>
                <input
                  type="text"
                  value={newDeptLead}
                  onChange={(e) => setNewDeptLead(e.target.value)}
                  placeholder="e.g. Thomas K. (Chief Engineer)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 cursor-pointer"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCategory} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Register Document Classification Category</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Environmental Impact Assessment"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ID Prefix</label>
                  <input
                    type="text"
                    value={newCatPrefix}
                    onChange={(e) => setNewCatPrefix(e.target.value)}
                    placeholder="e.g. ENV-EIA"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Retention (Years)</label>
                  <input
                    type="number"
                    value={newCatRetention}
                    onChange={(e) => setNewCatRetention(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Default SLA (Hours)</label>
                  <input
                    type="number"
                    value={newCatSla}
                    onChange={(e) => setNewCatSla(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confidentiality Tier</label>
                  <select
                    value={newCatConfidentiality}
                    onChange={(e) => setNewCatConfidentiality(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Public Record">Public Record</option>
                    <option value="Internal Only">Internal Only</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
