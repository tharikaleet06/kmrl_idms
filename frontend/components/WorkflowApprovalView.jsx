import React, { useState, useEffect } from 'react';
import { approveWorkflow, rejectWorkflow, checkSlaBreaches, fetchWorkflows, createAuditLog } from '../services/api.js';
import { CheckSquare, Clock, CheckCircle2, RefreshCw, UserCheck, Shield, XCircle } from 'lucide-react';

export const WorkflowApprovalView = ({ documents, onDocumentUpdated, currentUser }) => {
  const [commentsMap, setCommentsMap] = useState({});
  const [approvingId, setApprovingId] = useState(null);
  const [checkingSla, setCheckingSla] = useState(false);
  const [backendTasks, setBackendTasks] = useState([]);
  const [loadingBackend, setLoadingBackend] = useState(false);

  const loadBackendTasks = async () => {
    setLoadingBackend(true);
    try {
      const tasks = await fetchWorkflows();
      setBackendTasks(tasks);
    } catch (err) {
      console.error('Error loading backend workflows:', err);
    } finally {
      setLoadingBackend(false);
    }
  };

  useEffect(() => {
    loadBackendTasks();
  }, [documents]);

  // Combine documents from props with backend tasks from workflow-service MySQL
  const allTasksMap = new Map();

  // Add backend workflow-service tasks first
  (backendTasks || []).forEach(t => {
    const docId = t.documentId || t.id;
    allTasksMap.set(docId, {
      id: docId,
      taskId: t.id,
      title: t.documentTitle || `Document ${docId}`,
      department: t.department || 'Operations',
      status: t.status || t.workflowStatus || 'In Progress',
      priority: t.priority || 'Normal',
      currentStage: t.currentStage || 1,
      totalStages: t.totalStages || 3,
      currentStageName: t.currentStageName || 'Department Officer',
      currentStageStatus: t.currentStageStatus || 'Pending',
      assignedTo: t.assignedTo || 'Department Officer',
      slaDeadline: t.slaDeadline || '3 Days',
      comments: t.comments || ''
    });
  });

  // Merge with frontend documents list if present
  (documents || []).forEach(d => {
    if (d.status === 'In Review' || d.status === 'Pending Review' || d.status === 'In Progress' || d.status === 'SLA Breached') {
      const existing = allTasksMap.get(d.id);
      allTasksMap.set(d.id, {
        id: d.id,
        taskId: existing?.taskId || d.id,
        title: d.title || existing?.title || `Document ${d.id}`,
        department: d.department || existing?.department || 'Operations',
        status: existing?.status || d.status || 'In Progress',
        priority: d.priority || existing?.priority || 'Normal',
        currentStage: existing?.currentStage || (d.currentStageIndex != null ? d.currentStageIndex : 1),
        totalStages: existing?.totalStages || 3,
        currentStageName: existing?.currentStageName || (d.approvalChain?.[d.currentStageIndex]?.role || 'Department Officer'),
        currentStageStatus: existing?.currentStageStatus || 'Pending',
        assignedTo: existing?.assignedTo || (d.approvalChain?.[d.currentStageIndex]?.approverName || 'Department Officer'),
        slaDeadline: existing?.slaDeadline || '24 Hours',
        comments: existing?.comments || d.comments || ''
      });
    }
  });

  const pendingList = Array.from(allTasksMap.values()).filter(t => t.status !== 'Approved' && t.status !== 'Rejected');

  const handleApprove = async (docId) => {
    const comments = commentsMap[docId] || 'Approved stage sign-off via KMRL Enterprise Portal';
    setApprovingId(docId);
    try {
      const res = await approveWorkflow(docId, currentUser?.name || 'Department Officer', comments, currentUser?.department);
      setCommentsMap((prev) => ({ ...prev, [docId]: '' }));
      await createAuditLog({
        user: currentUser?.name || 'Department Officer',
        action: 'WORKFLOW_STAGE_APPROVED',
        details: `Approved stage for document ${docId}: "${comments}"`
      }).catch(console.error);

      await loadBackendTasks();
      if (onDocumentUpdated) {
        onDocumentUpdated(res?.document || { id: docId, status: res?.status || 'Approved' });
      }
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Approval failed. Please check Spring Boot server.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (docId) => {
    const comments = commentsMap[docId] || 'Returned for revision due to document errors / missing compliance clearance.';
    if (!window.confirm(`Are you sure you want to REJECT workflow for document ${docId}?`)) return;

    setApprovingId(docId);
    try {
      const res = await rejectWorkflow(docId, currentUser?.name || 'Department Officer', comments);
      setCommentsMap((prev) => ({ ...prev, [docId]: '' }));
      await createAuditLog({
        user: currentUser?.name || 'Department Officer',
        action: 'WORKFLOW_REJECTED',
        details: `Rejected workflow for document ${docId}: "${comments}"`
      }).catch(console.error);

      await loadBackendTasks();
      if (onDocumentUpdated) {
        onDocumentUpdated(res?.document || { id: docId, status: 'Rejected', workflowStatus: 'Rejected' });
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Rejection failed. Please check Spring Boot server.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleEvaluateSLA = async () => {
    setCheckingSla(true);
    try {
      const result = await checkSlaBreaches();
      alert(`SLA Engine Evaluation Complete! ${result.breachesCount || 0} breach escalations processed.`);
      await loadBackendTasks();
    } catch (err) {
      alert('SLA check failed.');
    } finally {
      setCheckingSla(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">SLA Workflow & Multi-Stage Approvals</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time MySQL-persisted 3-stage approval routing (Department Officer → Joint GM → Authorized Officer).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBackendTasks}
            disabled={loadingBackend}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBackend ? 'animate-spin' : ''}`} />
            <span>Refresh Tasks</span>
          </button>

          <button
            onClick={handleEvaluateSLA}
            disabled={checkingSla}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-500/30 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checkingSla ? 'animate-spin' : ''}`} />
            <span>Trigger SLA Check</span>
          </button>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="space-y-4">
        {pendingList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">All Approval Chains Up to Date</h3>
            <p className="text-xs text-slate-500 mt-1">No pending workflow tasks currently waiting for approval.</p>
          </div>
        ) : (
          pendingList.map((doc) => {
            return (
              <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono bg-slate-800 text-blue-400 border border-slate-700 px-2 py-0.5 rounded font-bold">
                        {doc.id}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{doc.department}</span>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                        Stage {doc.currentStage} of {doc.totalStages}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{doc.title}</h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    doc.status === 'SLA Breached'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                {/* Stage Details */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-white">Current Stage: {doc.currentStageName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">
                        Stage {doc.currentStage} / {doc.totalStages}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Assigned Approver: <strong className="text-slate-200">{doc.assignedTo}</strong></span>
                      <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> SLA: {doc.slaDeadline}
                      </span>
                    </div>
                  </div>

                  {doc.comments && (
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic">
                      "{doc.comments}"
                    </div>
                  )}

                  {/* Visual Stage Progress Timeline */}
                  <div className="flex items-center gap-2 pt-1 pb-1 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      doc.currentStage > 1 || doc.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : doc.currentStage === 1
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {doc.currentStage > 1 || doc.status === 'Approved' ? '✓ Stage 1: Dept Officer (Approved)' : '● Stage 1: Dept Officer (Active)'}
                    </span>

                    <span className="text-slate-600 font-bold">→</span>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      doc.currentStage > 2 || doc.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : doc.currentStage === 2
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {doc.currentStage > 2 || doc.status === 'Approved' ? '✓ Stage 2: Joint GM (Approved)' : doc.currentStage === 2 ? '● Stage 2: Joint GM (Active)' : '○ Stage 2: Joint GM'}
                    </span>

                    <span className="text-slate-600 font-bold">→</span>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : doc.currentStage === 3
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {doc.status === 'Approved' ? '✓ Stage 3: Authorized Officer (Approved)' : doc.currentStage === 3 ? '● Stage 3: Authorized Officer (Active)' : '○ Stage 3: Authorized Officer'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
                    <input
                      type="text"
                      value={commentsMap[doc.id] || ''}
                      onChange={(e) => setCommentsMap({ ...commentsMap, [doc.id]: e.target.value })}
                      placeholder="Add sign-off remarks or compliance observations..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(doc.id)}
                        disabled={approvingId === doc.id}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-rose-500/30 cursor-pointer disabled:opacity-50 shrink-0 shadow-lg"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Reject & Flag Error</span>
                      </button>

                      <button
                        onClick={() => handleApprove(doc.id)}
                        disabled={approvingId === doc.id}
                        className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all flex items-center justify-center gap-2 border border-blue-400/30 cursor-pointer disabled:opacity-50 shrink-0 shadow-lg"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{approvingId === doc.id ? 'Signing Stage...' : `Sign & Approve Stage ${doc.currentStage}`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

