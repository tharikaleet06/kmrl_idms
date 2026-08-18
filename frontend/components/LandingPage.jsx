import React from 'react';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Server,
  FileText,
  Cpu,
  MapPin,
  Clock,
  Layers,
  GitCommit,
  CheckSquare,
  Building2,
  Lock,
  Activity,
  FileCheck2,
  Anchor,
  Compass
} from 'lucide-react';

export const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00529B] flex items-center justify-center text-white font-bold text-xl shadow-lg border border-blue-400/30">
            K
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">KMRL Enterprise Portal</h1>
            <p className="text-[11px] text-slate-400">Kochi Metro Rail Limited • Spring Boot Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gateway Node: Online</span>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-[#00529B] hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-20">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Spring Boot Java Microservices & AI Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise Document Intelligence, Version Control & SLA Governance
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Official document lifecycle management portal for Kochi Metro Rail Limited. Powering Phase 1 (Aluva-Pettah), Phase 2 (Kakkanad Extension), and Kochi Water Metro network with automated SLA workflow approvals, multi-version document control, geospatial station mapping, and CMRS compliance auditing.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-xl transition-all flex items-center gap-3 border border-blue-400/30 cursor-pointer"
              >
                <span>Access Executive Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800 text-left">
              <div>
                <div className="text-2xl font-black text-white">25+</div>
                <div className="text-xs text-slate-400">Metro Stations Mapped</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-400">78 km</div>
                <div className="text-xs text-slate-400">Water Metro Routes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">v2.1+</div>
                <div className="text-xs text-slate-400">Version Control Engine</div>
              </div>
              <div>
                <div className="text-2xl font-black text-sky-400">&lt; 12h</div>
                <div className="text-xs text-slate-400">Automated SLA SLA Breach</div>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic / Feature Highlight */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">Active Version Control Matrix</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2 py-0.5 rounded">
                  v2.1 Approved
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">v2.1 Revision Submission</div>
                    <div className="text-[11px] text-slate-400">Monsoon strain gauge logs Pier 45-88</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                    Approved
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-300">v2.0 Structural Load Spec</div>
                    <div className="text-[11px] text-slate-400">RDSO viaduct bearing pad clearance</div>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shrink-0">
                    Archived
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/20 border border-slate-800/50 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-400">v1.0 Initial Draft</div>
                    <div className="text-[11px] text-slate-500">Original tender drawing set</div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shrink-0">
                    Baseline
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <span>Multi-tier Officer Sign-off</span>
                <span className="text-blue-400 font-mono">CMRS Audit Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Core Pillars & Capabilities */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Platform Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              End-to-End Enterprise Transit Document Governance
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Architected specifically for railway safety standards, structural engineering, and municipal land clearances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <GitCommit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                Document Version Control & Revision History
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain comprehensive revision history for every engineering drawing, safety clearance, and contract invoice. Track major and minor releases (v1.0, v1.1, v2.0), revision change notes, and author sign-offs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Automated Workflow SLA & Auto-Escalation
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure department-specific SLA timers (e.g. 12h, 24h, 48h). Active background daemons continuously evaluate approval queues and auto-escalate overdue files to Executive Directors with audit logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Geospatial Station & Jetty Mapping
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parse address entities and spatial coordinates from OCR scans. Automatically link documents to Metro stations (Aluva, Edapally, Kakkanad) and Water Metro jetties (High Court, Vyttila, Fort Kochi).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                Gemini AI NLP Entity Extraction
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identify monetary values, contractor names, statutory regulations (CMRS, RDSO, CVC), and sensitivity levels directly from uploaded PDF and Word documents with confidence metrics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Compliance Auditing & Ledger Hashes
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immutable audit trail for every user action, approval sign-off, and SLA breach event. Cryptographic SHA-256 event hashes ensure complete regulatory readiness for government inspections.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                Spring Cloud Microservice Gateway
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built on Spring Boot Java backend microservices registered with Spring Cloud Eureka. Full OpenAPI 3.0 Swagger specifications for seamless enterprise system integration.
              </p>
            </div>

          </div>
        </section>

        {/* Workflow Lifecycle Step Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400">Document Lifecycle</h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white">How Document Revisions & Approvals Flow</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center relative">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center mx-auto">1</div>
              <h4 className="text-xs font-bold text-white">Upload & AI Intake</h4>
              <p className="text-[11px] text-slate-400">File is analyzed by Gemini NLP, assigned metadata, and initialized as Version v1.0.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center mx-auto">2</div>
              <h4 className="text-xs font-bold text-white">Multi-Stage SLA Chain</h4>
              <p className="text-[11px] text-slate-400">Routed sequentially to Section Engineers, Chief Safety Officers, and Financial Advisors.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
              <h4 className="text-xs font-bold text-white">Revision & Approval</h4>
              <p className="text-[11px] text-slate-400">Submitting new revisions creates version v1.1/v2.0, preserving all historical change logs.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center mx-auto">4</div>
              <h4 className="text-xs font-bold text-white">CMRS Compliance Sign-off</h4>
              <p className="text-[11px] text-slate-400">Final approval locks the active document version into the permanent immutable audit ledger.</p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/60 via-[#00529B]/80 to-slate-900 border border-blue-500/30 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Access KMRL Enterprise Portal?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Log in with your official KMRL credentials to view active document queues, manage version revisions, and approve pending workflows.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="bg-white text-[#00529B] hover:bg-slate-100 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 Kochi Metro Rail Limited (KMRL) • Built with React JS + Spring Boot Java REST API
      </footer>
    </div>
  );
};

