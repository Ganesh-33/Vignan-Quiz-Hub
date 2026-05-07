
// import React, { useState, useEffect } from 'react';
// import { excelStorage, FacultyRegistry } from '../services/db';
// import * as XLSX from 'xlsx';

// interface AdminDashboardProps {
//   onLogout: () => void;
// }

// const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
//   const [rows, setRows] = useState<FacultyRegistry[]>([]);
//   const [form, setForm] = useState({ code: '', password: '', department: 'CSE' });

//   useEffect(() => {
//     setRows(excelStorage.getFacultyRows());
//   }, []);

//   const handleAdd = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.code || !form.password) return;
//     const newRow: FacultyRegistry = { ...form, createdAt: Date.now() };
//     excelStorage.saveFacultyRow(newRow);
//     setRows(excelStorage.getFacultyRows());
//     setForm({ code: '', password: '', department: 'CSE' });
//   };

//   const handleDelete = (code: string) => {
//     if (window.confirm(`Remove Faculty ${code} from registry?`)) {
//       excelStorage.deleteFacultyRow(code);
//       setRows(excelStorage.getFacultyRows());
//     }
//   };

//   const exportFacultyExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(rows.map(r => ({
//       'Faculty Code': r.code,
//       'Password': r.password,
//       'Department': r.department,
//       'Registered At': new Date(r.createdAt).toLocaleString()
//     })));
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Faculty_Registry");
//     XLSX.writeFile(wb, "Vignan_Faculty_Master.xlsx");
//   };

//   return (
//     <div className="min-h-screen bg-[#f1f5f9] flex overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-80 bg-slate-950 text-white p-10 flex flex-col shadow-2xl relative z-20">
//         <div className="mb-16">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">A</div>
//             <h1 className="text-xl font-black tracking-tighter">System Root</h1>
//           </div>
//           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Administrator Control</p>
//         </div>

//         <nav className="space-y-4 flex-1">
//           <div className="px-6 py-5 bg-indigo-600 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-indigo-500/30 cursor-default">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
//             <span className="font-bold text-sm tracking-tight">Faculty Registry</span>
//           </div>
//         </nav>

//         <button onClick={onLogout} className="mt-auto flex items-center gap-4 text-slate-500 hover:text-white transition-all py-4 px-6 font-black text-[10px] uppercase tracking-widest group">
//           <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//           Exit Dashboard
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-16 overflow-y-auto bg-white/40 backdrop-blur-3xl">
//         <header className="mb-16 flex justify-between items-end">
//           <div>
//             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Faculty Registry</h2>
//             <p className="text-slate-500 font-medium mt-3 text-lg">Manage faculty credentials and departmental access codes.</p>
//           </div>
//           <button 
//             onClick={exportFacultyExcel}
//             className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-4 shadow-sm group"
//           >
//             <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//             Download Registry Excel
//           </button>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
//           {/* Add Form */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 sticky top-10 overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
//               <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
//                 <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-sm font-black">+</span>
//                 New Staff Entry
//               </h3>
//               <form onSubmit={handleAdd} className="space-y-8">
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Faculty Code (Identity)</label>
//                   <input
//                     required
//                     className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300"
//                     placeholder="e.g. VIGNAN_FAC_01"
//                     value={form.code}
//                     onChange={e => setForm({...form, code: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Security Password</label>
//                   <input
//                     required
//                     type="password"
//                     className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300"
//                     placeholder="••••••••"
//                     value={form.password}
//                     onChange={e => setForm({...form, password: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Assigned Department</label>
//                   <div className="relative group">
//                     <select
//                       className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg appearance-none cursor-pointer"
//                       value={form.department}
//                       onChange={e => setForm({...form, department: e.target.value})}
//                     >
//                       <option>CSE</option>
//                       <option>ECE</option>
//                       <option>EEE</option>
//                       <option>MECH</option>
//                       <option>CIVIL</option>
//                       <option>IT</option>
//                     </select>
//                     <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-indigo-600 transition-colors">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 uppercase tracking-[0.3em] text-[10px]"
//                 >
//                   Append to Registry
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* List Table */}
//           <div className="lg:col-span-2 animate-fadeIn">
//             <div className="bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl shadow-slate-200/30 overflow-hidden">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-100">
//                     <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Faculty Entry</th>
//                     <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Department</th>
//                     <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Registration Date</th>
//                     <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {rows.length === 0 ? (
//                     <tr><td colSpan={4} className="p-32 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xl italic opacity-20">Registry Data Empty</td></tr>
//                   ) : rows.map(row => (
//                     <tr key={row.code} className="hover:bg-indigo-50/40 transition-all duration-300 group">
//                       <td className="px-12 py-10">
//                         <div className="font-black text-slate-900 text-2xl tracking-tight mb-1">{row.code}</div>
//                         <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em]">PassKey: {row.password.replace(/./g, '•')}</div>
//                       </td>
//                       <td className="px-12 py-10">
//                         <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100">{row.department}</span>
//                       </td>
//                       <td className="px-12 py-10 text-base text-slate-400 font-bold uppercase tracking-tighter">
//                         {new Date(row.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-12 py-10 text-right">
//                         <button 
//                           onClick={() => handleDelete(row.code)}
//                           className="p-5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
//                         >
//                           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;









import React, { useState, useEffect } from 'react';
import { facultyDB, FacultyRegistry } from '../services/db';
import * as XLSX from 'xlsx';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [rows, setRows] = useState<FacultyRegistry[]>([]);
  const [form, setForm] = useState({ code: '', password: '', department: 'CSE' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadRows = async () => {
    try {
      setLoading(true);
      setRows(await facultyDB.getAll());
    } catch {
      setError('Failed to load faculty data from Neon DB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRows(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.password) return;
    setSaving(true);
    try {
      await facultyDB.add({ ...form, createdAt: Date.now() });
      setForm({ code: '', password: '', department: 'CSE' });
      await loadRows();
    } catch {
      setError('Failed to save faculty entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(`Remove Faculty ${code} from registry?`)) return;
    try {
      await facultyDB.remove(code);
      await loadRows();
    } catch {
      setError('Failed to delete faculty entry.');
    }
  };

  const exportFacultyExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows.map(r => ({
      'Faculty Code': r.code,
      'Password': r.password,
      'Department': r.department,
      'Registered At': new Date(r.createdAt).toLocaleString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Faculty_Registry");
    XLSX.writeFile(wb, "Vignan_Faculty_Master.xlsx");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-slate-950 text-white p-10 flex flex-col shadow-2xl relative z-20">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">A</div>
            <h1 className="text-xl font-black tracking-tighter">System Root</h1>
          </div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Administrator Control</p>
          <div className="flex items-center gap-2 mt-3 ml-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-400/60 font-black uppercase tracking-widest">Neon DB Connected</span>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <div className="px-6 py-5 bg-indigo-600 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-indigo-500/30 cursor-default">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-bold text-sm tracking-tight">Faculty Registry</span>
          </div>
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 text-slate-500 hover:text-white transition-all py-4 px-6 font-black text-[10px] uppercase tracking-widest group">
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Exit Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 overflow-y-auto bg-white/40 backdrop-blur-3xl">
        <header className="mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Faculty Registry</h2>
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage faculty credentials and departmental access codes.</p>
            {error && <p className="text-red-500 text-sm font-bold mt-2">{error}</p>}
          </div>
          <button
            onClick={exportFacultyExcel}
            className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-4 shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Registry Excel
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 sticky top-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-sm font-black">+</span>
                New Staff Entry
              </h3>
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Faculty Code (Identity)</label>
                  <input
                    required
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300"
                    placeholder="e.g. VIGNAN_FAC_01"
                    value={form.code}
                    onChange={e => setForm({...form, code: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Security Password</label>
                  <input
                    required
                    type="password"
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Assigned Department</label>
                  <div className="relative group">
                    <select
                      className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-800 text-lg appearance-none cursor-pointer"
                      value={form.department}
                      onChange={e => setForm({...form, department: e.target.value})}
                    >
                      <option>CSE</option><option>ECE</option><option>EEE</option>
                      <option>MECH</option><option>CIVIL</option><option>IT</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 uppercase tracking-[0.3em] text-[10px] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Append to Registry
                </button>
              </form>
            </div>
          </div>

          {/* List Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl shadow-slate-200/30 overflow-hidden">
              {loading ? (
                <div className="p-32 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Loading from Neon DB...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Faculty Entry</th>
                      <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Department</th>
                      <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Registration Date</th>
                      <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.length === 0 ? (
                      <tr><td colSpan={4} className="p-32 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xl italic opacity-20">Registry Data Empty</td></tr>
                    ) : rows.map(row => (
                      <tr key={row.code} className="hover:bg-indigo-50/40 transition-all duration-300 group">
                        <td className="px-12 py-10">
                          <div className="font-black text-slate-900 text-2xl tracking-tight mb-1">{row.code}</div>
                          <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em]">PassKey: {row.password.replace(/./g, '•')}</div>
                        </td>
                        <td className="px-12 py-10">
                          <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100">{row.department}</span>
                        </td>
                        <td className="px-12 py-10 text-base text-slate-400 font-bold uppercase tracking-tighter">
                          {new Date(row.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-12 py-10 text-right">
                          <button
                            onClick={() => handleDelete(row.code)}
                            className="p-5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                          >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;