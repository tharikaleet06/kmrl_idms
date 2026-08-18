import axios from 'axios';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('kmrl_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userJson = localStorage.getItem('kmrl_logged_user');
    if (userJson) {
      const u = JSON.parse(userJson);
      if (u.role) config.headers['X-User-Role'] = u.role;
      if (u.department) config.headers['X-User-Department'] = u.department;
      if (u.name || u.username) config.headers['X-User-Name'] = u.name || u.username;
      if (u.email) config.headers['X-User-Email'] = u.email;
    }
  } catch (e) {}
  return config;
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

  let backendDocs = [];
  try {
    const res = await api.get('/documents', { params, headers: userHeaders });
    const fetched = res.data?.documents || res.data?.data || (Array.isArray(res.data) ? res.data : []);
    if (Array.isArray(fetched)) {
      backendDocs = fetched;
    }
  } catch (err) {
    console.warn('Axios fetchDocuments notice:', err);
  }

  const map = new Map();
  customDocs.forEach(d => { if (d && d.id) map.set(d.id, d); });
  backendDocs.forEach(d => { if (d && d.id) map.set(d.id, d); });

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
