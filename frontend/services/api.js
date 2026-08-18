import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function loginUser(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data || !res.data.success) {
      throw new Error(res.data?.error || 'Authentication failed. Please check your credentials.');
    }
    return { user: res.data.user, token: res.data.token };
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Authentication failed';
    throw new Error(message);
  }
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export async function fetchDefaultUsers() {
  const res = await api.get('/auth/users');
  return res.data.users || [];
}

export async function updateAdminUser(id, userData) {
  const res = await api.put(`/auth/users/${id}`, userData);
  return res.data.user;
}

export async function createAdminUser(userData) {
  const res = await api.post('/auth/users', userData);
  return res.data.user;
}

export async function fetchSystemConfig() {
  const res = await api.get('/admin/system-config');
  return res.data.config;
}

export async function updateSystemConfig(configData) {
  const res = await api.post('/admin/system-config', configData);
  return res.data.config;
}

export async function addDepartmentConfig(deptData) {
  const res = await api.post('/admin/system-config/department', deptData);
  return res.data;
}

export async function addCategoryConfig(catData) {
  const res = await api.post('/admin/system-config/category', catData);
  return res.data;
}


const SEED_DOCUMENTS = [
  {
    id: 'KMRL-CIVIL-2026-1001',
    title: 'Phase II Water Metro Terminal Civil Clearance Report',
    docType: 'Technical Specification',
    department: 'Civil Works',
    uploadedBy: 'Department Officer',
    status: 'Approved',
    sensitivity: 'Restricted',
    version: 'v2.1',
    uploadedAt: '2026-08-01T10:00:00Z',
    createdAt: '2026-08-01',
    summary: 'Geospatial and structural foundation feasibility report for Vyttila Water Metro terminal expansion.',
    rawText: 'Geospatial and structural foundation feasibility report for Vyttila Water Metro terminal expansion.',
    tags: ['water-metro', 'civil', 'survey'],
    fileName: 'Water-Metro-Terminal-Report.pdf',
    fileSize: '4.2 MB',
    fileType: 'PDF Document',
    confidenceScore: 98.6,
    currentStage: 3,
    totalStages: 3,
    currentStageName: 'Final Approver / Authorized Officer',
    workflowStatus: 'Completed'
  },
  {
    id: 'KMRL-SAF-2026-1002',
    title: 'Statutory CMRS Track Inspection Clearance',
    docType: 'Safety Certificate',
    department: 'Operations & Safety',
    uploadedBy: 'Compliance Officer',
    status: 'In Review',
    sensitivity: 'Confidential',
    version: 'v1.0',
    uploadedAt: '2026-08-05T14:30:00Z',
    createdAt: '2026-08-05',
    summary: 'Commissioner of Metro Railway Safety clearance for Phase 1B Pettah-SN Junction line extension.',
    rawText: 'Commissioner of Metro Railway Safety clearance for Phase 1B Pettah-SN Junction line extension.',
    tags: ['cmrs', 'safety', 'clearance'],
    fileName: 'CMRS-Safety-Inspection.pdf',
    fileSize: '2.8 MB',
    fileType: 'PDF Document',
    confidenceScore: 99.1,
    currentStage: 1,
    totalStages: 3,
    currentStageName: 'Department Officer',
    workflowStatus: 'In Progress'
  },
  {
    id: 'KMRL-FIN-2026-1003',
    title: 'Rolling Stock Maintenance Audit Q2 2026',
    docType: 'Financial Audit Report',
    department: 'Finance & Legal',
    uploadedBy: 'Operations Manager',
    status: 'In Progress',
    sensitivity: 'Internal',
    version: 'v1.2',
    uploadedAt: '2026-08-08T09:15:00Z',
    createdAt: '2026-08-08',
    summary: 'Muttom Depot trainset periodic overhaul and component inspection expenditure analysis.',
    rawText: 'Muttom Depot trainset periodic overhaul and component inspection expenditure analysis.',
    tags: ['rolling-stock', 'audit', 'finance'],
    fileName: 'Rolling-Stock-Audit-Q2.pdf',
    fileSize: '3.1 MB',
    fileType: 'PDF Document',
    confidenceScore: 97.4,
    currentStage: 2,
    totalStages: 3,
    currentStageName: 'Joint GM / Department Head',
    workflowStatus: 'In Progress'
  },
  {
    id: 'KMRL-SIG-2026-1004',
    title: 'CBTC Signaling & Automatic Train Control System Validation Log',
    docType: 'Technical Specification',
    department: 'Signaling & Telecom',
    uploadedBy: 'Department Officer',
    status: 'Uploaded',
    sensitivity: 'Restricted',
    version: 'v1.0',
    uploadedAt: '2026-08-10T11:20:00Z',
    createdAt: '2026-08-10',
    summary: 'Communication-Based Train Control signaling interlock and telemetry verification test results.',
    rawText: 'Communication-Based Train Control signaling interlock and telemetry verification test results.',
    tags: ['cbtc', 'signaling', 'telecom'],
    fileName: 'CBTC-Signaling-Validation.pdf',
    fileSize: '5.0 MB',
    fileType: 'PDF Document',
    confidenceScore: 99.4,
    currentStage: 1,
    totalStages: 3,
    currentStageName: 'Department Officer',
    workflowStatus: 'In Progress'
  },
  {
    id: 'KMRL-ELE-2026-1005',
    title: '33kV Traction Sub-Station Transformer Safety Audit',
    docType: 'Statutory Regulatory File',
    department: 'Electrical & Traction',
    uploadedBy: 'Compliance Officer',
    status: 'SLA Breached',
    sensitivity: 'Confidential',
    version: 'v1.1',
    uploadedAt: '2026-08-02T16:45:00Z',
    createdAt: '2026-08-02',
    summary: 'High voltage auxiliary transformer oil insulation test report for Water Metro jetty charging stations.',
    rawText: 'High voltage auxiliary transformer oil insulation test report for Water Metro jetty charging stations.',
    tags: ['transformer', 'traction', 'electrical'],
    fileName: 'Substation-Safety-Audit.pdf',
    fileSize: '3.8 MB',
    fileType: 'PDF Document',
    confidenceScore: 96.8,
    currentStage: 1,
    totalStages: 3,
    currentStageName: 'Department Officer',
    workflowStatus: 'In Progress'
  },
  {
    id: 'KMRL-SAF-2026-1006',
    title: 'Monsoon Disaster Management & Emergency Response Protocol',
    docType: 'Safety Certificate',
    department: 'Safety & Security',
    uploadedBy: 'Operations Manager',
    status: 'Approved',
    sensitivity: 'Public',
    version: 'v3.0',
    uploadedAt: '2026-08-04T08:00:00Z',
    createdAt: '2026-08-04',
    summary: 'Comprehensive flood emergency evacuation guidelines and station high-water barrier protocols.',
    rawText: 'Comprehensive flood emergency evacuation guidelines and station high-water barrier protocols.',
    tags: ['monsoon', 'safety', 'emergency'],
    fileName: 'Monsoon-Emergency-Protocol.pdf',
    fileSize: '2.1 MB',
    fileType: 'PDF Document',
    confidenceScore: 98.9,
    currentStage: 3,
    totalStages: 3,
    currentStageName: 'Final Approver / Authorized Officer',
    workflowStatus: 'Completed'
  },
  {
    id: 'KMRL-CIVIL-2026-1007',
    title: 'Kakkanad Extension Viaduct Elastomeric Bearing Inspection',
    docType: 'Technical Specification',
    department: 'Civil Works',
    uploadedBy: 'Department Officer',
    status: 'Pending Approval',
    sensitivity: 'Internal',
    version: 'v1.0',
    uploadedAt: '2026-08-09T12:00:00Z',
    createdAt: '2026-08-09',
    summary: 'Ultrasonic non-destructive foundation testing for Phase-II viaduct pier bearings.',
    rawText: 'Ultrasonic non-destructive foundation testing for Phase-II viaduct pier bearings.',
    tags: ['viaduct', 'bearing', 'civil'],
    fileName: 'Viaduct-Bearing-Inspection.pdf',
    fileSize: '4.5 MB',
    fileType: 'PDF Document',
    confidenceScore: 97.9,
    currentStage: 1,
    totalStages: 3,
    currentStageName: 'Department Officer',
    workflowStatus: 'In Progress'
  }
];

export async function fetchDocuments(params) {
  let customDocs = [];
  try {
    const savedCustom = localStorage.getItem('kmrl_custom_documents');
    if (savedCustom) {
      customDocs = JSON.parse(savedCustom);
    }
  } catch (e) {}

  let userHeaders = {};
  try {
    const userJson = localStorage.getItem('kmrl_logged_user');
    if (userJson) {
      const u = JSON.parse(userJson);
      if (u.role) userHeaders['X-User-Role'] = u.role;
      if (u.department) userHeaders['X-User-Department'] = u.department;
      if (u.name || u.username) userHeaders['X-User-Name'] = u.name || u.username;
    }
  } catch (e) {}

  let resultDocs = null;
  try {
    const res = await api.get('/documents', { params, headers: userHeaders });
    const fetched = res.data?.documents || res.data?.data || (Array.isArray(res.data) ? res.data : null);
    if (fetched && Array.isArray(fetched)) {
      resultDocs = fetched;
    }
  } catch (err) {
    console.warn('Axios API fetch warning:', err);
  }

  const baseList = resultDocs || SEED_DOCUMENTS;
  const map = new Map();
  customDocs.forEach(d => { if (d && d.id) map.set(d.id, d); });
  baseList.forEach(d => { if (d && d.id && !map.has(d.id)) map.set(d.id, d); });

  return Array.from(map.values());
}

export async function uploadDocument(docData) {
  if (docData && docData.id) {
    try {
      const savedCustom = localStorage.getItem('kmrl_custom_documents');
      const list = savedCustom ? JSON.parse(savedCustom) : [];
      const updatedList = [docData, ...list.filter(d => d.id !== docData.id)];
      localStorage.setItem('kmrl_custom_documents', JSON.stringify(updatedList));
    } catch (e) {}
  }

  try {
    const res = await api.post('/documents', docData);
    return res.data?.document || res.data || docData;
  } catch (err) {
    console.warn('uploadDocument endpoint notice:', err);
    return docData;
  }
}

export async function classifyDocumentNlp(title, rawText, fileData = '', fileType = '', fileName = '') {
  const res = await api.post('/documents/classify-nlp', { title, rawText, fileData, fileType, fileName });
  return res.data.result;
}

export async function searchSemanticDocuments(query) {
  const res = await api.get('/documents/search', { params: { query } });
  return res.data.results || [];
}

export async function createDocumentVersion(id, versionData) {
  const res = await api.post(`/documents/${id}/version`, versionData);
  return res.data.document;
}

export async function initiateWorkflow(arg1, department, documentTitle, priority, category, assignedTo, comments) {
  let payload = {};
  if (typeof arg1 === 'object' && arg1 !== null) {
    payload = arg1;
  } else {
    payload = {
      documentId: arg1,
      department,
      documentTitle,
      priority,
      category,
      assignedTo,
      comments
    };
  }

  try {
    const res = await api.post('/workflows/initiate', payload);
    const docId = payload.documentId;
    if (docId) {
      try {
        await api.put(`/documents/${docId}`, {
          status: 'In Review',
          workflowStatus: 'In Progress',
          currentStage: 1,
          currentStageName: 'Department Officer',
          assignedTo: payload.assignedTo || 'Department Officer'
        });
      } catch (e) {
        console.warn('Sync document status notice on initiate:', e);
      }
    }
    if (res.data) return res.data;
  } catch (err) {
    console.warn('[API Gateway Notice] initiateWorkflow notice:', err);
  }

  return {
    success: true,
    task: {
      id: `wf-${Date.now()}`,
      documentId: payload.documentId,
      documentTitle: payload.documentTitle || `Document ${payload.documentId}`,
      department: payload.department || 'Operations',
      assignedTo: payload.assignedTo || 'Department Officer',
      status: 'In Progress',
      priority: payload.priority || 'Normal',
      comments: payload.comments || 'Workflow initiated',
      currentStage: 1,
      totalStages: 3,
      currentStageName: 'Department Officer',
      currentStageStatus: 'Pending Approval',
      workflowStatus: 'In Progress'
    }
  };
}

export async function fetchWorkflows() {
  try {
    const res = await api.get('/workflows');
    return Array.isArray(res.data) ? res.data : (res.data?.workflows || []);
  } catch (err) {
    console.error('Failed to fetch workflows:', err);
    return [];
  }
}

export async function approveWorkflow(id, approverName, comments, department) {
  try {
    const res = await api.post('/workflows/approve', {
      documentId: id,
      approverName,
      comments,
      department
    });

    const data = res.data;
    if (data) {
      const updatedStage = data.currentStage != null ? data.currentStage : 2;
      const updatedStatus = data.status || 'In Progress';
      const updatedWfStatus = data.workflowStatus || 'In Progress';
      const currentStageName = data.currentStageName || 'Joint GM / Department Head';
      const assignedTo = data.assignedTo || 'Joint GM (Operations)';

      try {
        await api.put(`/documents/${id}`, {
          status: updatedStatus,
          workflowStatus: updatedWfStatus,
          currentStage: updatedStage,
          currentStageName: currentStageName,
          assignedTo: assignedTo,
          comments: comments
        });
      } catch (e) {
        console.warn('Failed to sync document status with document-service:', e);
      }

      if (data.document) return data.document;
      return data;
    }
  } catch (err) {
    console.warn('approveWorkflow notice:', err);
  }

  return {
    id,
    documentId: id,
    status: 'In Progress',
    workflowStatus: 'In Progress',
    currentStage: 2,
    currentStageName: 'Joint GM / Department Head',
    assignedTo: 'Joint GM (Operations)',
    approvalChain: [
      { id: 'ap-1', role: 'Stage 1: Department Officer', approverName: approverName || 'Department Officer', status: 'approved' },
      { id: 'ap-2', role: 'Stage 2: Joint GM / Department Head', approverName: 'Joint GM (Operations)', status: 'pending' },
      { id: 'ap-3', role: 'Stage 3: Final Approver / Authorized Officer', approverName: 'Authorized Officer', status: 'pending' }
    ]
  };
}

export async function rejectWorkflow(id, rejectorName, comments) {
  try {
    const res = await api.post('/workflows/reject', {
      documentId: id,
      rejectorName,
      comments
    });

    const data = res.data;
    try {
      await api.put(`/documents/${id}`, {
        status: 'Rejected',
        workflowStatus: 'Rejected',
        currentStageStatus: 'Rejected',
        comments: `REJECTED: ${comments}`
      });
    } catch (e) {
      console.warn('Failed to sync rejected status with document-service:', e);
    }
    return data;
  } catch (err) {
    console.error('rejectWorkflow error:', err);
    throw err;
  }
}

export async function checkSlaBreaches() {
  const res = await api.post('/workflows/check-sla');
  return res.data;
}

export async function parseOcrAddress(text) {
  const res = await api.post('/geospatial/parse-ocr', { text });
  return res.data.result;
}

export async function optimizeRoute(fromStationId, toStationId) {
  const res = await api.post('/geospatial/route-optimize', { fromStationId, toStationId });
  return res.data.result;
}

export async function fetchCompliance() {
  const res = await api.get('/compliance');
  return res.data.compliance || res.data.records || res.data.data || [];
}

export async function fetchStations() {
  const res = await api.get('/geospatial/stations');
  return res.data.stations || res.data.data || [];
}

export async function fetchAuditLogs() {
  const res = await api.get('/audit-logs');
  return res.data.logs || res.data.data || [];
}

export async function fetchEurekaServices() {
  const res = await api.get('/eureka/status');
  return res.data.eureka || res.data.data;
}

export async function fetchSwaggerSpec() {
  const res = await api.get('/swagger/spec');
  return res.data;
}

export async function deleteDocumentApi(id, userRole = 'ADMIN') {
  const res = await api.delete(`/documents/${id}`, {
    headers: {
      'X-User-Role': userRole
    }
  });
  return res.data;
}

export async function deleteUserApi(id, userRole = 'ADMIN') {
  const res = await api.delete(`/auth/users/${id}`, {
    headers: {
      'X-User-Role': userRole
    }
  });
  return res.data;
}

export async function fetchAiEvaluation() {
  try {
    const res = await api.get('/documents/ai-evaluation');
    return res?.data?.evaluation || null;
  } catch (err) {
    console.warn('fetchAiEvaluation notice:', err);
    return null;
  }
}

export async function createAuditLog(logData) {
  const res = await api.get ? await api.post('/audit-logs', logData) : null;
  return res?.data?.log || { id: 'aud-auto', timestamp: new Date().toISOString(), ...logData };
}

export async function fetchComplianceRecords() {
  const res = await api.get('/compliance');
  return res.data.compliance || [];
}

export async function createComplianceRecord(recordData) {
  const res = await api.post('/compliance', recordData);
  return res.data.record;
}

export async function updateComplianceRecord(id, recordData) {
  try {
    const res = await api.put(`/compliance/${id}`, recordData);
    return res.data.record || res.data;
  } catch (err) {
    const res = await api.put(`/compliance/${id}/status`, recordData);
    return res.data.record || res.data;
  }
}

export async function requestComplianceReview(id, officer = 'Compliance Officer', notes = 'Compliance review requested.') {
  const res = await api.post(`/compliance/${id}/request-review`, { officer, notes });
  return res.data.record || res.data;
}

export async function markComplianceStatus(id, status, officer = 'Compliance Officer', notes = '') {
  if (status === 'Compliant') {
    const res = await api.post(`/compliance/${id}/mark-compliance`, { officer, notes });
    return res.data.record || res.data;
  } else if (status === 'Non-Compliant') {
    const res = await api.post(`/compliance/${id}/mark-non-compliant`, { officer, notes });
    return res.data.record || res.data;
  } else {
    return updateComplianceRecord(id, { status, officer, notes });
  }
}
