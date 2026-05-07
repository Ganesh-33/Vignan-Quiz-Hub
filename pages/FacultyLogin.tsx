
// import React, { useState } from 'react';
// import { excelStorage } from '../services/db';

// interface FacultyLoginProps {
//   onSuccess: () => void;
//   onBack: () => void;
// }

// const FacultyLogin: React.FC<FacultyLoginProps> = ({ onSuccess, onBack }) => {
//   const [code, setCode] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     const rows = excelStorage.getFacultyRows();
//     const found = rows.find(r => r.code === code && r.password === password);

//     if (found) {
//       localStorage.setItem('vignan_current_faculty', code);
//       onSuccess();
//     } else {
//       setError('Invalid Faculty Code or Password. Contact Admin.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
//       <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 animate-fadeIn">
//         <button onClick={onBack} className="mb-10 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//           Back to Portal
//         </button>

//         <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Faculty Port</h2>
//         <p className="text-indigo-600/60 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Authorized Personnel Only</p>

//         <form onSubmit={handleLogin} className="space-y-8">
//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Identity Code</label>
//             <input
//               type="text"
//               required
//               className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all font-bold placeholder:text-slate-200"
//               placeholder="VIGNAN_FAC_XX"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Private Security Key</label>
//             <input
//               type="password"
//               required
//               className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all font-bold placeholder:text-slate-200"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}

//           <button
//             type="submit"
//             className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
//           >
//             Authenticate Identity
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FacultyLogin;














import React, { useState } from 'react';
import { facultyDB } from '../services/db';

interface FacultyLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const FacultyLogin: React.FC<FacultyLoginProps> = ({ onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ok = await facultyDB.verify(code, password);
      if (ok) {
        localStorage.setItem('vignan_current_faculty', code);
        onSuccess();
      } else {
        setError('Invalid Faculty Code or Password. Contact Admin.');
      }
    } catch {
      setError('Database connection failed. Check VITE_NEON_URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 animate-fadeIn">
        <button onClick={onBack} className="mb-10 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Portal
        </button>

        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Faculty Port</h2>
        <p className="text-indigo-600/60 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Authorized Personnel Only</p>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Identity Code</label>
            <input
              type="text"
              required
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all font-bold placeholder:text-slate-200"
              placeholder="VIGNAN_FAC_XX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Private Security Key</label>
            <input
              type="password"
              required
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all font-bold placeholder:text-slate-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-[10px] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-4 h-4 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />}
            Authenticate Identity
          </button>
        </form>
      </div>
    </div>
  );
};

export default FacultyLogin;