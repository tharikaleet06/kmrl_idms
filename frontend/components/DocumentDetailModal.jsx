import React, { useState } from 'react';
import { X, FileText, MapPin, CheckCircle2, ShieldAlert, Cpu, GitCommit, Clock, Plus, Upload, User, Check, AlertCircle, Trash2 } from 'lucide-react';
import { createDocumentVersion, deleteDocumentApi } from '../services/api.js';

export const DocumentDetailModal = ({ doc: initialDoc, onClose, onVersionAdded, onDocumentDeleted }) => {
  const [doc, setDoc] = useState(initialDoc);
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [versionNumber, setVersionNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [changesDescription, setChangesDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  if (!doc) return null;

  const versionHistory = doc.versionHistory || [
    {
      version: doc.version || 'v1.0',
      fileName: doc.fileName,
      fileSize: doc.fileSize || '3.5 MB',
      uploadedBy: doc.uploadedBy || 'Portal Officer',
      uploadedAt: doc.uploadedAt || new Date().toISOString(),
      changesDescription: 'Initial version document submission.',
      status: doc.status || 'In Review',
      approvedBy: doc.status === 'Approved' ? 'Authorized Officer' : null,
      approvalDate: doc.status === 'Approved' ? new Date().toISOString() : null
    }
  ];

  const handleAddVersion = async (e) => {
    e.preventDefault();
    if (!changesDescription.trim()) {
      setFormError('Please enter a description of changes/revisions for this version.');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      const defaultVer = `v${(parseFloat((doc.version || 'v1.0').replace('v', '')) + 0.1).toFixed(1)}`;
      const payload = {
        version: versionNumber.trim() || defaultVer,
        fileName: fileName.trim() || `REV-${doc.fileName}`,
        fileSize: `${(Math.random() * 8 + 2).toFixed(1)} MB`,
        uploadedBy: uploadedBy.trim() || 'Portal Officer',
        changesDescription: changesDescription.trim()
      };

      const updatedDoc = await createDocumentVersion(doc.id, payload);
      setDoc(updatedDoc);
      setShowVersionForm(false);
      setVersionNumber('');
      setFileName('');
      setChangesDescription('');

      if (onVersionAdded) {
        onVersionAdded(updatedDoc);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit new document version');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-6 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pr-8 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-bold">
                {doc.id}
              </span>
              <span className="text-xs text-slate-400 font-medium">{doc.department}</span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                Active: {doc.version || 'v1.0'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{doc.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Insight Summary Box */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs">
          <div className="text-blue-400 font-bold flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>AI Classification & NLP Summary</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{doc.summary}</p>
        </div>

        {/* Key Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 font-medium">Station / Location</div>
            <div className="text-white font-bold mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{doc.stationName || 'KMRL HQ'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 font-medium">Current Status</div>
            <div className={`font-bold mt-1 ${
              doc.status === 'Approved' ? 'text-emerald-400' :
              doc.status === 'SLA Breached' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {doc.status}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 font-medium">NLP Classification</div>
            <div className="text-emerald-400 font-bold mt-1">{doc.confidenceScore || 98.2}% Confidence</div>
          </div>
        </div>

        {/* Version Control & Approval Log Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Document Version Control & Revision Log</h3>
            </div>
            <button
              onClick={() => setShowVersionForm(!showVersionForm)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Revision / Version</span>
            </button>
          </div>

          {/* New Version Upload Form Drawer */}
          {showVersionForm && (
            <form onSubmit={handleAddVersion} className="p-4 rounded-xl bg-slate-800 border border-blue-500/40 space-y-3 text-xs animate-fadeIn">
              <div className="font-bold text-blue-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Upload New Revision / Version</span>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Version Tag</label>
                  <input
                    type="text"
                    value={versionNumber}
                    onChange={(e) => setVersionNumber(e.target.value)}
                    placeholder={`e.g. v${(parseFloat((doc.version || 'v1.0').replace('v', '')) + 0.1).toFixed(1)}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Revision File Name</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder={`e.g. REV-${doc.fileName}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Uploader Name</label>
                  <input
                    type="text"
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    placeholder="e.g. Suresh Kumar (Engg)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Summary of Changes / Revisions *</label>
                <textarea
                  rows="2"
                  value={changesDescription}
                  onChange={(e) => setChangesDescription(e.target.value)}
                  placeholder="Describe the changes, engineering updates, or compliance notes for this revision..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowVersionForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting Revision...' : 'Save & Re-initiate Approval'}
                </button>
              </div>
            </form>
          )}

          {/* Version History Table/Cards */}
          <div className="space-y-2.5">
            {versionHistory.map((ver, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-colors ${
                  ver.version === doc.version
                    ? 'bg-blue-950/30 border-blue-500/40'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                      {ver.version}
                    </span>
                    <span className="font-semibold text-white text-xs">{ver.fileName}</span>
                    <span className="text-[10px] text-slate-400">({ver.fileSize || '3.8 MB'})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ver.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : ver.status === 'SLA Breached'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {ver.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  {ver.changesDescription}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Uploaded by: <strong className="text-slate-300">{ver.uploadedBy}</strong></span>
                  </div>

                  <div>
                    {ver.approvedBy ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Approved by {ver.approvedBy} on {new Date(ver.approvalDate || Date.now()).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Approval Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Stages Matrix */}
        {(() => {
          const currentStage = doc.currentStage != null ? doc.currentStage : 1;
          const isApproved = doc.status === 'Approved' || doc.status === 'Completed';

          const defaultChain = [
            {
              role: 'Stage 1: Department Officer',
              approverName: doc.uploadedBy || 'Department Officer',
              status: currentStage > 1 || isApproved ? 'approved' : 'pending'
            },
            {
              role: 'Stage 2: Joint GM / Department Head',
              approverName: 'Joint GM (Operations)',
              status: currentStage > 2 || isApproved ? 'approved' : (currentStage === 2 ? 'active' : 'pending')
            },
            {
              role: 'Stage 3: Final Approver / Authorized Officer',
              approverName: 'Authorized Officer',
              status: isApproved ? 'approved' : (currentStage === 3 ? 'active' : 'pending')
            }
          ];

          const chainToRender = (doc.approvalChain && doc.approvalChain.length > 0) ? doc.approvalChain : defaultChain;

          return (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Stage Approval Lifecycle</h3>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                  Stage {currentStage} / 3 — {doc.currentStageName || 'Department Officer'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {chainToRender.map((stage, idx) => {
                  const isStageApproved = stage.status === 'approved' || (idx + 1 < currentStage) || isApproved;
                  const isStageActive = !isStageApproved && (idx + 1 === currentStage);

                  return (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${
                      isStageApproved ? 'bg-emerald-950/20 border-emerald-500/40' :
                      isStageActive ? 'bg-blue-950/30 border-blue-500/40 ring-1 ring-blue-500/30' :
                      'bg-slate-800/40 border-slate-800'
                    }`}>
                      <div>
                        <div className="font-bold text-white text-[11px]">{stage.role}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{stage.approverName}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isStageApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isStageActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-pulse' :
                        'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {isStageApproved ? '✓ Approved' : isStageActive ? '● Active' : '○ Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={async () => {
              if (!window.confirm(`Are you sure you want to delete document ${doc.id}? This action requires Administrator or Department Officer privileges.`)) return;
              try {
                await deleteDocumentApi(doc.id, 'ADMIN');
                if (onDocumentDeleted) onDocumentDeleted(doc.id);
                if (onClose) onClose();
              } catch (e) {
                alert(e.message || 'Failed to delete document');
              }
            }}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-4 py-2 rounded-xl border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-2 rounded-xl border border-slate-700 cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

