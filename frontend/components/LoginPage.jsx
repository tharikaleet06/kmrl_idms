import React, { useState } from 'react';
import { loginUser } from '../services/api.js';
import { Shield, Lock, Mail, ArrowLeft, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid official email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { user } = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between font-sans select-none p-4 sm:p-6">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-400 font-medium">Enterprise Spring Boot Auth Gateway</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500"></div>

          <div>
            <div className="mb-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#00529B] mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-xl mb-3">
                K
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">KMRL Enterprise Portal</h1>
              <p className="text-xs text-slate-400 mt-1">Sign in with your official email address and password</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@kmrl.co.in"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-blue-400/30 cursor-pointer mt-5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating via Spring Security...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Kochi Metro Rail Limited • Spring Boot Security Gateway
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full text-center py-4 text-[11px] text-slate-500">
        © 2026 Kochi Metro Rail Limited (KMRL). Protected Portal Node.
      </div>
    </div>
  );
};
