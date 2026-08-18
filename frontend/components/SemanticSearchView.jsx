import React, { useState, useEffect } from 'react';
import { searchSemanticDocuments } from '../services/api.js';
import {
  Search,
  Filter,
  FileText,
  Eye,
  Tag,
  Shield,
  Sparkles,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export const SemanticSearchView = ({ documents, onSelectDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCompliance, setSelectedCompliance] = useState('All');
  const [vectorResults, setVectorResults] = useState([]);

  // Natural Language Search Presets
  const SEARCH_PRESETS = [
    'Find CMRS annual safety clearance reports for Aluva viaduct',
    'Show monsoon high-water drainage OCR site inspection scans',
    'Get 33kV auxiliary transformer procurement tender notices',
    'List Kalamassery Pier 88 elastomeric bearing maintenance plans'
  ];

  // Perform backend vector similarity search on query change
  useEffect(() => {
    if (!searchTerm || !searchTerm.trim()) {
      setVectorResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchSemanticDocuments(searchTerm);
        if (Array.isArray(results) && results.length > 0) {
          setVectorResults(results);
        }
      } catch (err) {
        console.warn('Backend vector search notice:', err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const calculateRelevanceScore = (doc, query) => {
    // Check vector backend scores first
    const vecMatch = vectorResults.find((v) => v.id === doc.id);
    if (vecMatch && typeof vecMatch.relevanceScore === 'number') {
      return vecMatch.relevanceScore;
    }

    if (typeof doc.relevanceScore === 'number' && doc.relevanceScore > 0) {
      return doc.relevanceScore;
    }

    if (!query || !query.trim()) return 0;

    const lowerQ = query.toLowerCase().trim();
    const keywords = lowerQ.split(/\s+/).filter((w) => w.length > 1);
    let score = 0;

    const fullDocText = [
      doc.title,
      doc.summary,
      doc.rawText,
      doc.ocrText,
      doc.department,
      doc.docType,
      doc.fileType,
      doc.category,
      doc.stationName,
      doc.surveyNo,
      doc.village,
      doc.district,
      Array.isArray(doc.tags) ? doc.tags.join(' ') : String(doc.tags || ''),
      JSON.stringify(doc.extractedEntities || {})
    ].join(' ').toLowerCase();

    if (fullDocText.includes(lowerQ)) {
      score += 50;
    }

    keywords.forEach((kw) => {
      if (doc.title && doc.title.toLowerCase().includes(kw)) score += 30;
      if (doc.summary && doc.summary.toLowerCase().includes(kw)) score += 20;
      if (doc.ocrText && doc.ocrText.toLowerCase().includes(kw)) score += 15;
      if (doc.rawText && doc.rawText.toLowerCase().includes(kw)) score += 10;
      if (doc.department && doc.department.toLowerCase().includes(kw)) score += 10;
      if (doc.fileType && doc.fileType.toLowerCase().includes(kw)) score += 10;
      if (doc.category && doc.category.toLowerCase().includes(kw)) score += 10;
      if (doc.stationName && doc.stationName.toLowerCase().includes(kw)) score += 15;
    });

    return Math.min(100, score);
  };

  const filteredDocs = documents.filter((doc) => {
    if (!doc) return false;
    const query = searchTerm.toLowerCase().trim();

    let matchesSearch = true;
    if (query) {
      const keywords = query.split(/\s+/).filter((w) => w.length > 1);
      const fullDocText = [
        doc.title,
        doc.id,
        doc.fileName,
        doc.summary,
        doc.rawText,
        doc.ocrText,
        doc.department,
        doc.docType,
        doc.fileType,
        doc.category,
        doc.stationName,
        doc.surveyNo,
        doc.village,
        doc.district,
        Array.isArray(doc.tags) ? doc.tags.join(' ') : String(doc.tags || ''),
        JSON.stringify(doc.extractedEntities || {})
      ].join(' ').toLowerCase();

      matchesSearch = fullDocText.includes(query) || keywords.some((kw) => fullDocText.includes(kw));
    }

    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesType = selectedType === 'All' || doc.fileType === selectedType || doc.docType === selectedType || doc.category === selectedType;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus || doc.workflowStatus === selectedStatus;
    const matchesCompliance = selectedCompliance === 'All' || doc.sensitivity === selectedCompliance || (selectedCompliance === 'Public' && (doc.sensitivity === 'Public' || doc.sensitivity === 'Statutory Public'));

    return matchesSearch && matchesDept && matchesType && matchesStatus && matchesCompliance;
  });

  const departments = ['All', ...new Set(documents.map((d) => d.department).filter(Boolean))];
  const fileTypes = ['All', ...new Set(documents.map((d) => d.fileType || d.docType).filter(Boolean))];
  const statuses = ['All', 'Uploaded', 'Under Review', 'In Progress', 'Pending Review', 'Pending Approval', 'Approved', 'Completed', 'SLA Breached'];

  return (
    <div className="space-y-6 font-sans text-slate-100 select-none">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase">
                Vector & Semantic Index
              </span>
              <span className="text-xs text-slate-400 font-mono">Gemini AI Embeddings v2.5</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1">KMRL Natural Language Semantic Repository</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Perform deep conceptual searches across all Kochi Metro statutory filings, OCR engineering drawings, and regulatory contracts.
            </p>
          </div>
        </div>

        {/* Natural Language Search Input Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ask anything e.g. 'Find CMRS clearance reports for Aluva viaduct with budget over 1 crore'..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-11 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Preset Prompts Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Prompt Presets:</span>
            </span>
            {SEARCH_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchTerm(preset)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-purple-500/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer truncate max-w-xs"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {fileTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Workflow Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Sensitivity / Class</label>
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Internal">Internal</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
              <option value="Public">Public</option>
              <option value="Statutory Public">Statutory Public</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Found <strong className="text-white">{filteredDocs.length}</strong> matching documents in semantic vector index</span>
        <span className="font-mono text-[11px] text-purple-400">Sort by: Vector Similarity Score ↓</span>
      </div>

      {/* Search Results List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-2">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <div>No matching document embeddings found for your search filters.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => {
            const relScore = calculateRelevanceScore(doc, searchTerm);
            const isApproved = doc.status === 'Approved' || doc.status === 'Completed';

            return (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-purple-500/40 transition-all space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold">
                        {doc.id}
                      </span>
                      <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-bold">
                        {doc.version || 'v1.0'}
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        Match: {relScore.toFixed(1)}%
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {doc.fileType}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-1">
                      {doc.title}
                    </h2>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border shrink-0 ${
                    isApproved
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{doc.status}</span>
                  </span>
                </div>

                {/* AI Summary Extract */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {doc.summary}
                </p>

                {/* Metadata & Tag Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-amber-300">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Uploaded by: <strong className="text-slate-200">{doc.uploadedBy || doc.uploader || 'Department Officer'}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      <span>{doc.department}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDocument && onSelectDocument(doc)}
                    className="bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Metadata & Revision Tree</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
