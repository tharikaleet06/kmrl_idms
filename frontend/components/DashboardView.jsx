import React from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Users,
  Sliders,
  ShieldCheck,
  Search,
  PieChart as PieIcon,
  BarChart3,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export const DashboardView = ({ documents, complianceRecords, onNavigateTab, userRole }) => {
  const totalDocs = documents.length;
  const pendingDocs = documents.filter((d) => d.status === 'In Review' || d.status === 'Under Review' || d.status === 'Uploaded' || d.status === 'In Progress' || d.status === 'Pending Review' || d.status === 'Pending Approval').length;
  const breachedDocs = documents.filter((d) => d.status === 'SLA Breached').length;
  const approvedDocs = documents.filter((d) => d.status === 'Approved' || d.status === 'Auto-Filed' || d.status === 'Completed').length;

  // Department-wise distribution data calculated dynamically
  const deptData = [
    { name: 'Civil Works', count: documents.filter((d) => d.department === 'Civil Works' || d.department === 'Operations' || d.department === 'Civil Engineering').length },
    { name: 'Safety & Security', count: documents.filter((d) => d.department === 'Safety & Security' || d.department === 'Operations & Safety').length },
    { name: 'Electrical & Traction', count: documents.filter((d) => d.department === 'Electrical & Traction').length },
    { name: 'Finance & Legal', count: documents.filter((d) => d.department === 'Finance & Legal' || d.department === 'Finance & Procurement').length },
    { name: 'Signaling & Telecom', count: documents.filter((d) => d.department === 'Signaling & Telecom' || d.department === 'Human Resources' || d.department === 'Legal').length }
  ];

  // Status Distribution Pie Data calculated dynamically
  const statusPieData = [
    { name: 'Approved', value: approvedDocs, color: '#10B981' },
    { name: 'In Review / Pending', value: pendingDocs, color: '#F59E0B' },
    { name: 'SLA Breached', value: breachedDocs, color: '#F43F5E' }
  ];

  // Compliance Trend Data
  const complianceTrendData = [
    { month: 'Jan', rate: 91, score: 88 },
    { month: 'Feb', rate: 93, score: 90 },
    { month: 'Mar', rate: 92, score: 89 },
    { month: 'Apr', rate: 96, score: 94 },
    { month: 'May', rate: 98, score: 97 }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100 select-none">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                KMRL Enterprise Analytics Engine
              </span>
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                Role: {userRole}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {userRole === 'Compliance Officer' ? 'Regulatory Compliance & Audit Dashboard' : 'Executive Operations & SLA Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring for KMRL document classification, SLA breaches, compliance evidence, and workflow statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('search')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Search Repository</span>
            </button>

            {userRole === 'Admin' && (
              <>
                <button
                  onClick={() => onNavigateTab('admin-users')}
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>User Roles</span>
                </button>
              </>
            )}


            {(userRole === 'Department Officer' || userRole === 'Admin' || userRole === 'User') && (
              <button
                onClick={() => onNavigateTab('documents')}
                className="bg-[#00529B] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-blue-400/30 transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>Upload Document</span>
              </button>
            )}

            {userRole === 'Compliance Officer' && (
              <button
                onClick={() => onNavigateTab('compliance')}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Compliance Ledger</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Total Indexed Documents</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalDocs}</div>
          <p className="text-[11px] text-slate-500 mt-1">KMRL Central Repository</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Pending Workflow Reviews</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingDocs}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting Approvals</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">SLA Escalated Breaches</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{breachedDocs}</div>
          <p className="text-[11px] text-slate-500 mt-1">Escalated to Dept Head</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Compliance Pass Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">98.4%</div>
          <p className="text-[11px] text-slate-500 mt-1">Statutory Target Exceeded</p>
        </div>
      </div>

      {/* Analytics Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Department-wise Document Distribution</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Live API Feed</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" fill="#00529B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workflow Status Pie Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Workflow Approval Breakdown</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SLA Status</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Documents Table & Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Documents Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Classified Documents</h2>
              <p className="text-xs text-slate-400">Real-time status updates from Spring Boot REST Service</p>
            </div>
            <button
              onClick={() => onNavigateTab('search')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Document ID & Title</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Station</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{doc.title}</span>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                          {doc.version || 'v1.0'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <span>{doc.id}</span>
                        <span>•</span>
                        <span>{doc.fileName}</span>
                        <span>•</span>
                        <span className="text-amber-400/90 font-sans font-semibold">By: {doc.uploadedBy || doc.uploader || 'Department Officer'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-700">
                        {doc.department}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{doc.stationName || 'KMRL HQ'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : doc.status === 'SLA Breached'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Compliance Deadlines Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Compliance Deadlines</h2>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                Statutory
              </span>
            </div>

            <div className="space-y-3">
              {(!complianceRecords || complianceRecords.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-300">All Statutory Audits Current</p>
                  <p className="text-[11px] text-slate-500">No active compliance deadlines pending action.</p>
                </div>
              ) : (
                (complianceRecords || []).slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                        {item.title || item.requirement || item.regulatoryBody}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.status === 'Non-Compliant' || item.status === 'SLA Breached'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : item.status === 'Compliant'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{item.notes || item.requirement || item.department}</p>
                    <div className="pt-1 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Audit Date: {item.auditDate || item.deadline || '2026-09-30'}</span>
                      <span className="text-amber-400 font-semibold">{item.officer || item.assignedOfficer || 'Compliance Officer'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('compliance')}
            className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Regulatory Compliance Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
