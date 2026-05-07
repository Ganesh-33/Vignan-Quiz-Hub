import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulating system authorization delay for UI/UX consistency
    setTimeout(() => {
      if (id === 'Admin001' && password === 'Vignan_admin_001') {
        onSuccess();
      } else {
        setError('System Administrator credentials rejected.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-12 shadow-2xl animate-fadeIn">
        <button 
          onClick={onBack} 
          className="mb-10 text-white/40 hover:text-white transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Exit System
        </button>

        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Admin Gate</h2>
        <p className="text-indigo-300/40 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Privileged Access Only</p>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Admin Identity</label>
            <input
              type="text"
              required
              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all font-bold placeholder:text-white/10"
              placeholder="Admin001"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Security Key</label>
            <input
              type="password"
              required
              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all font-bold placeholder:text-white/10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-400 hover:text-white transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />}
            Authorize Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;