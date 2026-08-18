import React, { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument, fetchCompliance, fetchAuditLogs } from '../services/api.js';
import { isTabAllowedForRole, getTabFromPath, getPathFromTab, getDefaultTabForRole } from '../utils/roleAccess.js';
import { Header } from '../components/Header.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { LandingPage } from '../components/LandingPage.jsx';
import { LoginPage } from '../components/LoginPage.jsx';
import { DashboardView } from '../components/DashboardView.jsx';
import { DocumentUploadView } from '../components/DocumentUploadView.jsx';
import { MyDocumentsView } from '../components/MyDocumentsView.jsx';
import { SemanticSearchView } from '../components/SemanticSearchView.jsx';
import { WorkflowApprovalView } from '../components/WorkflowApprovalView.jsx';
import { GeospatialOcrView } from '../components/GeospatialOcrView.jsx';
import { ComplianceView } from '../components/ComplianceView.jsx';
import { AuditTrailView } from '../components/AuditTrailView.jsx';
import { MicroservicesConsoleView } from '../components/MicroservicesConsoleView.jsx';
import { UserManagementView } from '../components/UserManagementView.jsx';
import { NotificationsView } from '../components/NotificationsView.jsx';
import { ProfileView } from '../components/ProfileView.jsx';
import { AccessDeniedView } from '../components/AccessDeniedView.jsx';
import { DocumentDetailModal } from '../components/DocumentDetailModal.jsx';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12 text-slate-200 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Document Intake Component Exception</h2>
          <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto">
            {this.state.error?.toString() || 'Unknown UI Error'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg"
          >
            Reload Component State
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kmrl_logged_user');
    return saved ? JSON.parse(saved) : { name: 'Admin Officer', username: 'admin', role: 'Admin' };
  });

  const [viewState, setViewState] = useState(() => {
    return localStorage.getItem('kmrl_logged_user') ? 'portal' : 'landing';
  });

  const [activeTab, setActiveTab] = useState(() => {
    const initialPath = window.location.hash ? window.location.hash.replace('#', '') : window.location.pathname;
    return getTabFromPath(initialPath);
  });

  const [documents, setDocuments] = useState([]);
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Sync hash changes with URL routes
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash ? window.location.hash.replace('#', '') : window.location.pathname;
      const tab = getTabFromPath(path);
      setActiveTab(tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const targetRoute = getPathFromTab(tabId);
    window.location.hash = targetRoute;
  };

  const loadData = async () => {
    try {
      const [docs, comp, logs] = await Promise.all([
        fetchDocuments(),
        fetchCompliance(),
        fetchAuditLogs()
      ]);
      setDocuments(docs || []);
      setComplianceRecords(comp || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const refreshDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      if (docs && Array.isArray(docs)) {
        setDocuments(docs);
      }
    } catch (err) {
      console.error('Failed to refresh documents:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, activeTab]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('kmrl_logged_user', JSON.stringify(user));
    const defaultTab = getDefaultTabForRole(user.role);
    setActiveTab(defaultTab);
    window.location.hash = getPathFromTab(defaultTab);
    setViewState('portal');
    triggerToast(`Authenticated as ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kmrl_logged_user');
    setViewState('landing');
    window.location.hash = '/';
  };

  const handleDocumentAdded = async (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    triggerToast(`Document intake registered: ${newDoc.id}`);
    await refreshDocuments();
  };

  const handleDocumentDeleted = async (docId) => {
    if (!docId) return;
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    triggerToast(`Deleted document from repository: ${docId}`);
    await refreshDocuments();
  };

  const handleDocumentUpdated = async (updatedDoc) => {
    if (!updatedDoc || !updatedDoc.id) return;
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d)));
    try {
      await uploadDocument(updatedDoc);
    } catch (err) {
      console.warn('Document status update sync notice:', err);
    }
    await refreshDocuments();
  };

  const handleUserUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('kmrl_logged_user', JSON.stringify(updatedUser));
  };

  if (viewState === 'landing') {
    return <LandingPage onGetStarted={() => setViewState('login')} />;
  }

  if (viewState === 'login' || !currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewState('landing')}
      />
    );
  }

  const isAllowed = isTabAllowedForRole(currentUser.role, activeTab);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans select-none antialiased relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 border border-blue-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        user={currentUser}
        activeTab={activeTab}
        onNavigateTab={handleTabChange}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Dynamic Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={currentUser.role}
        />

        {/* Main Workspace / View Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950/40">
          <ErrorBoundary key={activeTab}>
            {!isAllowed ? (
              <AccessDeniedView
                tabId={activeTab}
                user={currentUser}
                onNavigate={handleTabChange}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardView
                    documents={documents}
                    complianceRecords={complianceRecords}
                    onNavigateTab={handleTabChange}
                    userRole={currentUser.role}
                  />
                )}

                {activeTab === 'documents' && (
                  <DocumentUploadView
                    onDocumentAdded={handleDocumentAdded}
                    onDocumentUpdated={handleDocumentUpdated}
                    uploaderName={currentUser?.name || currentUser?.username || 'Operations Officer'}
                    onNavigateTab={handleTabChange}
                  />
                )}

                {activeTab === 'my-documents' && (
                  <MyDocumentsView
                    documents={documents}
                    currentUser={currentUser}
                    onSelectDocument={setSelectedDoc}
                    onDeleteDocument={handleDocumentDeleted}
                    onNavigateTab={handleTabChange}
                  />
                )}

                {activeTab === 'search' && (
                  <SemanticSearchView
                    documents={documents}
                    onSelectDocument={setSelectedDoc}
                  />
                )}

                {activeTab === 'workflows' && (
                  <WorkflowApprovalView
                    documents={documents}
                    onDocumentUpdated={handleDocumentUpdated}
                    currentUser={currentUser}
                  />
                )}

                {activeTab === 'geospatial' && <GeospatialOcrView />}

                {activeTab === 'compliance' && <ComplianceView documents={documents} complianceRecords={complianceRecords} userRole={currentUser.role} onToast={triggerToast} />}

                {activeTab === 'audit' && <AuditTrailView auditLogs={auditLogs} userRole={currentUser.role} onToast={triggerToast} />}

                {activeTab === 'microservices' && <MicroservicesConsoleView />}

                {activeTab === 'admin-users' && (
                  <UserManagementView onToast={triggerToast} />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsView
                    onNavigateTab={handleTabChange}
                    userRole={currentUser.role}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileView
                    user={currentUser}
                    onUpdateUser={handleUserUpdated}
                    onToast={triggerToast}
                  />
                )}
              </>
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Document Detail & Revision Modal */}
      {selectedDoc && (
        <DocumentDetailModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDocumentDeleted={handleDocumentDeleted}
          onVersionAdded={(updatedDoc) => {
            if (updatedDoc && updatedDoc.id) {
              handleDocumentUpdated(updatedDoc);
              setSelectedDoc(updatedDoc);
              triggerToast(`Submitted new document revision: ${updatedDoc.version}`);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
