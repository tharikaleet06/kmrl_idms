// Enterprise Role Permissions Matrix for KMRL Portal
// Roles: 'Admin', 'Compliance Officer', 'Department Officer', 'User', 'Manager'

export const TAB_ROUTES = {
  dashboard: '/dashboard',
  documents: '/documents/upload',
  'my-documents': '/my-documents',
  search: '/search',
  workflows: '/workflows',
  geospatial: '/geospatial',
  compliance: '/compliance-ledger',
  audit: '/audit-trail',
  microservices: '/system/eureka',
  'admin-users': '/admin/users',
  notifications: '/notifications',
  profile: '/profile'
};

export const TAB_LABELS = {
  dashboard: 'Executive Dashboard',
  documents: 'Document Intake & Classifier',
  'my-documents': 'My Documents Repository',
  search: 'Semantic Repository / Search',
  workflows: 'SLA Workflows & Approvals',
  geospatial: 'Geospatial OCR & Route Maps',
  compliance: 'Regulatory Compliance Ledger',
  audit: 'Immutable Audit Trail',
  microservices: 'Spring Boot / Eureka Console',
  'admin-users': 'User & Role Management',
  notifications: 'Notifications & Alerts',
  profile: 'Profile / Account Settings'
};

export const ROLE_PERMISSIONS = {
  Admin: [
    'dashboard',
    'documents',
    'my-documents',
    'search',
    'workflows',
    'geospatial',
    'compliance',
    'audit',
    'microservices',
    'admin-users',
    'notifications',
    'profile'
  ],
  Manager: [
    'dashboard',
    'documents',
    'my-documents',
    'search',
    'workflows',
    'geospatial',
    'audit',
    'notifications',
    'profile'
  ],
  'Compliance Officer': [
    'dashboard',
    'my-documents',
    'search',
    'geospatial',
    'compliance',
    'audit',
    'notifications',
    'profile'
  ],
  'Department Officer': [
    'dashboard',
    'documents',
    'my-documents',
    'search',
    'workflows',
    'geospatial',
    'notifications',
    'profile'
  ],
  User: [
    'dashboard',
    'documents',
    'my-documents',
    'search',
    'geospatial',
    'notifications',
    'profile'
  ]
};

export const REQUIRED_ROLES_MAP = {
  dashboard: ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User'],
  documents: ['Admin', 'Manager', 'Department Officer', 'User'],
  'my-documents': ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User'],
  search: ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User'],
  workflows: ['Admin', 'Manager', 'Department Officer'],
  geospatial: ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User'],
  compliance: ['Admin', 'Compliance Officer'],
  audit: ['Admin', 'Manager', 'Compliance Officer'],
  microservices: ['Admin'],
  'admin-users': ['Admin'],
  notifications: ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User'],
  profile: ['Admin', 'Manager', 'Compliance Officer', 'Department Officer', 'User']
};

export function isTabAllowedForRole(role, tabId) {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['User'];
  return allowed.includes(tabId);
}

export function getDefaultTabForRole(role) {
  return 'dashboard';
}

export function getTabFromPath(path) {
  if (!path) return 'dashboard';
  const cleanPath = path.toLowerCase().replace('/#', '').replace('#', '');
  
  if (cleanPath.startsWith('/system-config') || cleanPath.startsWith('/config')) return 'dashboard';
  if (cleanPath.startsWith('/admin/users')) return 'admin-users';
  if (cleanPath.startsWith('/system/eureka') || cleanPath.startsWith('/microservices')) return 'microservices';

  if (cleanPath.startsWith('/compliance-ledger') || cleanPath.startsWith('/compliance')) return 'compliance';
  if (cleanPath.startsWith('/audit-trail') || cleanPath.startsWith('/audit')) return 'audit';
  if (cleanPath.startsWith('/my-documents')) return 'my-documents';
  if (cleanPath.startsWith('/documents')) return 'documents';
  if (cleanPath.startsWith('/workflows')) return 'workflows';
  if (cleanPath.startsWith('/geospatial')) return 'geospatial';
  if (cleanPath.startsWith('/search')) return 'search';
  if (cleanPath.startsWith('/notifications')) return 'notifications';
  if (cleanPath.startsWith('/profile')) return 'profile';
  if (cleanPath.startsWith('/dashboard')) return 'dashboard';

  return 'dashboard';
}

export function getPathFromTab(tabId) {
  return TAB_ROUTES[tabId] || '/dashboard';
}

export function getRoleBadgeColor(role) {
  switch (role) {
    case 'Admin':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'Manager':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Department Officer':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Compliance Officer':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-slate-700/50 text-slate-300 border-slate-600';
  }
}
