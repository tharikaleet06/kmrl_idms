import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Building,
  ShieldCheck,
  Eye,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  UserCheck,
  Trash2
} from 'lucide-react';
import { deleteDocumentApi } from '../services/api.js';

export const MyDocumentsView = ({ documents, currentUser, onSelectDocument, onDeleteDocument, onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Department Officers and regular Users only see documents from their own department
  const isDeptRestricted = currentUser?.role === 'Department Officer' || currentUser?.role === 'User';
  const userDept = currentUser?.department;

  const accessibleDocuments = documents.filter((doc) => {
    if (!doc) return false;
    const isUploader = (doc.uploadedBy && (doc.uploadedBy === currentUser?.name || doc.uploadedBy === currentUser?.username || doc.uploadedBy === currentUser?.email)) ||
                       (doc.uploader && (doc.uploader === currentUser?.name || doc.uploader === currentUser?.username || doc.uploader === currentUser?.email));
    const isAssigned = doc.assignedTo && (doc.assignedTo === currentUser?.name || doc.assignedTo === currentUser?.username);
    const isDeptMatch = userDept && doc.department === userDept;

    if (isDeptRestricted) {
      return isDeptMatch || isUploader || isAssigned;
    }
    return true;
  });

  const filteredDocs = accessibleDocuments.filter((doc) => {
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.fileType || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || doc.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['ALL', ...new Set(accessibleDocuments.map((d) => d.department).filter(Boolean))];
  const statuses = ['ALL', 'Uploaded', 'Under Review', 'In Progress', 'Pending Review', 'Pending Approval', 'Approved', 'Completed', 'SLA Breached'];

  return (
    <div className="space-y-6 font-sans text-slate-100 select-none">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">
                User Document Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">Accessible Records: {accessibleDocuments.length}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">My Documents & Statutory Submissions</h1>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('documents')}
          className="bg-[#00529B] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors cursor-pointer flex items-center gap-2 border border-blue-400/30 shrink-0"
        >
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by document title, ID, file type..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">
                  Dept: {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-slate-200">
                  Status: {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Document Repository Table</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Showing {filteredDocs.length} items</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <div>No matching documents found in your access scope.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 text-[10px] font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 pl-5">Document Name & Ref ID</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Uploaded By</th>
                  <th className="p-3.5">Type & Classification</th>
                  <th className="p-3.5">Assigned Dept</th>
                  <th className="p-3.5">Approval Flow Chain</th>
                  <th className="p-3.5">Workflow Status</th>
                  <th className="p-3.5">SLA Window</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredDocs.map((doc) => {
                  const isApproved = doc.status === 'Approved' || doc.status === 'Completed';
                  const currentStage = doc.currentStage != null ? doc.currentStage : 1;
                  const uploaderNameStr = doc.uploadedBy || doc.uploader || 'Department Officer';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-xs">
                          {doc.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{doc.id}</span>
                          <span>•</span>
                          <span>{doc.fileName}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                          {doc.version || 'v1.0'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-200 font-medium flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-lg text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{uploaderNameStr}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                          <Tag className="w-3 h-3 text-purple-400" />
                          <span>{doc.fileType || doc.docType || 'Document'}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-300 font-medium flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-blue-400" />
                          <span>{doc.department}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
                            <span className={isApproved || currentStage > 1 ? "text-emerald-400" : "text-blue-400 animate-pulse"}>
                              {isApproved ? "✓ Complete" : `● Stage ${currentStage}/3: ${doc.currentStageName || 'Dept Officer'}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px]">
                            <span className={`px-1.5 py-0.5 rounded ${isApproved || currentStage > 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>S1</span>
                            <span className="text-slate-600">→</span>
                            <span className={`px-1.5 py-0.5 rounded ${isApproved || currentStage > 2 ? 'bg-emerald-500/20 text-emerald-300' : currentStage === 2 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>S2</span>
                            <span className="text-slate-600">→</span>
                            <span className={`px-1.5 py-0.5 rounded ${isApproved ? 'bg-emerald-500/20 text-emerald-300' : currentStage === 3 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>S3</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                          <span>{doc.status}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-300 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {isApproved ? 'Closed' : '24 Hours SLA'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Compliant</span>
                        </span>
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectDocument && onSelectDocument(doc)}
                            className="bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          {(currentUser?.role === 'Admin' || currentUser?.role === 'Department Officer') && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!window.confirm(`Are you sure you want to delete document ${doc.id}?`)) return;
                                try {
                                  await deleteDocumentApi(doc.id, currentUser.role);
                                  if (onDeleteDocument) onDeleteDocument(doc.id);
                                } catch (err) {
                                  alert(err.message || 'Failed to delete document');
                                }
                              }}
                              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-1.5 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
