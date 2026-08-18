import React, { useState, useEffect } from 'react';
import { fetchEurekaServices, fetchSwaggerSpec } from '../services/api.js';
import { Server, ExternalLink, Code2, CheckCircle2 } from 'lucide-react';

export const MicroservicesConsoleView = () => {
  const [eurekaState, setEurekaState] = useState(null);
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    fetchEurekaServices().then(setEurekaState).catch(console.error);
    fetchSwaggerSpec().then(setSwaggerSpec).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Spring Boot Eureka Service Registry</h1>
            <p className="text-xs text-slate-400">
              Access the live Netflix Eureka Dashboard for real-time microservices cluster topology and health metrics.
            </p>
          </div>
        </div>

        <a
          href="http://localhost:8761"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 border border-emerald-400/30 shrink-0"
        >
          <span>Open Live Eureka Dashboard</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {eurekaState && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Eureka Cluster Status: UP (http://localhost:8761)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Gateway Proxy: http://localhost:8080</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(eurekaState.applications || []).map((srv, idx) => (
              <div key={srv.name || idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{srv.name}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    {srv.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Port: {srv.port}</span>
                  <span>Cluster: Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {swaggerSpec && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>OpenAPI 3.0.0 Microservices Cluster API Specification</span>
          </h2>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
            {JSON.stringify(swaggerSpec, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
