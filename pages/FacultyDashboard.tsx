// import React, { useState, useEffect, Suspense } from 'react';
// import ReactQuill from 'react-quill';
// import { Quiz, Question, QuizResult } from '../types';
// import { quizDB, resultsDB } from '../services/db';
// import { generateAIQuestions } from '../services/gemini';
// import * as XLSX from 'xlsx';

// const QUILL_MODULES = {
//   toolbar: [
//     [{ 'header': [1, 2, 3, false] }],
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//     ['image', 'code-block'],
//     ['clean']
//   ],
// };

// interface FacultyDashboardProps {
//   onLogout: () => void;
// }

// const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onLogout }) => {
//   const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'reports'>('create');
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [results, setResults] = useState<QuizResult[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [quizTitle, setQuizTitle] = useState('');
//   const [duration, setDuration] = useState(30);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
//     text: '', options: ['', '', '', ''], correctOptionIndex: 0
//   });
//   const [isGenerating, setIsGenerating] = useState(false);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [q, r] = await Promise.all([quizDB.getAll(), resultsDB.getAll()]);
//       setQuizzes(q);
//       setResults(r);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadData(); }, []);

//   const addQuestion = () => {
//     if (!currentQuestion.text || currentQuestion.options?.some(o => !o)) return alert("Fill all question cells.");
//     setQuestions([...questions, { ...currentQuestion, id: Date.now().toString() } as Question]);
//     setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
//   };

//   const handleGenerateAI = async () => {
//     const topic = prompt("Enter specific topic for AI question generation:");
//     if (!topic) return;
//     setIsGenerating(true);
//     try {
//       const aiQs = await generateAIQuestions(topic);
//       setQuestions([...questions, ...aiQs.map((q: any) => ({ ...q, id: Math.random().toString() }))]);
//     } catch {
//       alert("AI Service unreachable. Verify API configuration.");
//     } finally { setIsGenerating(false); }
//   };

//   const saveQuiz = async () => {
//     if (!quizTitle || questions.length === 0) return alert("Quiz title and questions required.");
//     const newQuiz: Quiz = {
//       id: Date.now().toString(),
//       title: quizTitle,
//       durationMinutes: duration,
//       questions,
//       createdAt: Date.now()
//     };
//     try {
//       await quizDB.save(newQuiz);
//       await loadData();
//       setQuizTitle('');
//       setQuestions([]);
//       setActiveTab('manage');
//     } catch {
//       alert("Failed to save quiz to Neon DB.");
//     }
//   };

//   const downloadReport = async (quizId: string) => {
//     const quizResults = await resultsDB.getByQuiz(quizId);
//     if (quizResults.length === 0) return alert("No submissions yet.");

//     const excelData = quizResults.map(r => ({
//       'Candidate ID': r.student.regdNo,
//       'Name': r.student.name,
//       'Academic Node': `${r.student.branch}-${r.student.section}`,
//       'Score': `${r.score}/${r.totalQuestions}`,
//       'Violations': r.violations,
//       'Time-Stamp': new Date(r.submittedAt).toLocaleString()
//     }));

//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Submission_Audit");
//     XLSX.writeFile(wb, `Vignan_Audit_${quizId}.xlsx`);
//   };

//   const deleteQuiz = async (id: string) => {
//     if (!window.confirm("Permanently erase this quiz and all candidate submissions?")) return;
//     try {
//       await resultsDB.deleteByQuiz(id);
//       await quizDB.remove(id);
//       await loadData();
//     } catch {
//       alert("Failed to delete quiz.");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-80 bg-slate-950 text-white p-10 flex flex-col shadow-2xl relative z-30">
//         <div className="mb-20">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-2xl shadow-indigo-600/30">V</div>
//             <h1 className="text-2xl font-black tracking-tighter">Instructor</h1>
//           </div>
//           <p className="text-indigo-400/40 text-[10px] font-black uppercase tracking-[0.4em] ml-1">Asset Control Node</p>
//           <div className="flex items-center gap-2 mt-3 ml-1">
//             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//             <span className="text-[9px] text-green-400/60 font-black uppercase tracking-widest">Neon DB Live</span>
//           </div>
//         </div>

//         <nav className="space-y-4 flex-1">
//           {[
//             { id: 'create', icon: 'M12 4v16m8-8H4', label: 'Compose Asset' },
//             { id: 'manage', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Workbook Vault' },
//             { id: 'reports', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Global Audit' }
//           ].map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id as any)}
//               className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all duration-500 ${
//                 activeTab === item.id ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/20 translate-x-2' : 'hover:bg-white/5 opacity-40 hover:opacity-100'
//               }`}
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
//               <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <button onClick={onLogout} className="mt-auto flex items-center gap-4 text-red-500 hover:text-red-400 transition-colors py-6 px-8 font-black text-[10px] uppercase tracking-widest group">
//           <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//           Exit Dashboard
//         </button>
//       </div>

//       {/* Main Workspace */}
//       <div className="flex-1 overflow-y-auto p-16 bg-white/40 backdrop-blur-3xl">
//         {/* Loading overlay */}
//         {loading && (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
//               <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Syncing with Neon DB...</p>
//             </div>
//           </div>
//         )}

//         {!loading && activeTab === 'create' && (
//           <div className="max-w-4xl mx-auto">
//             <header className="mb-16 flex justify-between items-center">
//               <div>
//                 <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Draft Workbook</h2>
//                 <p className="text-slate-500 mt-3 text-lg font-medium">Compose questions with rich syntax and AI orchestration.</p>
//               </div>
//               <button
//                 onClick={handleGenerateAI}
//                 disabled={isGenerating}
//                 className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-500 hover:shadow-2xl transition-all flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50"
//               >
//                 {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : '✨ AI Compose'}
//               </button>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
//               <div className="space-y-4">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Workbook Designation</label>
//                 <input
//                   className="w-full px-10 py-7 bg-white border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-50 shadow-sm text-2xl font-black outline-none transition-all placeholder:text-slate-200"
//                   placeholder="e.g. DATA_STRUCT_01"
//                   value={quizTitle}
//                   onChange={e => setQuizTitle(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-4">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Duration Limit (Min)</label>
//                 <input
//                   type="number"
//                   className="w-full px-10 py-7 bg-white border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-50 shadow-sm text-2xl font-black outline-none transition-all"
//                   value={duration}
//                   onChange={e => setDuration(parseInt(e.target.value))}
//                 />
//               </div>
//             </div>

//             <div className="bg-white rounded-[4rem] p-14 border border-slate-100 shadow-2xl mb-16 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-3 h-full bg-indigo-600"></div>
//               <h3 className="text-2xl font-black mb-12 flex items-center gap-5 text-slate-900">
//                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">#</div>
//                 Question Composer
//               </h3>

//               <div className="mb-12">
//                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Rich Data Layer</label>
//                 <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50">
//                   <Suspense fallback={<div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>}>
//                     <ReactQuill
//                       theme="snow"
//                       modules={QUILL_MODULES}
//                       value={currentQuestion.text}
//                       onChange={val => setCurrentQuestion({...currentQuestion, text: val})}
//                       className="bg-white"
//                     />
//                   </Suspense>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
//                 {currentQuestion.options?.map((opt, i) => (
//                   <div key={i} className={`flex items-center gap-6 p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${currentQuestion.correctOptionIndex === i ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
//                     <input
//                       type="radio"
//                       name="correct"
//                       checked={currentQuestion.correctOptionIndex === i}
//                       onChange={() => setCurrentQuestion({...currentQuestion, correctOptionIndex: i})}
//                       className={`w-8 h-8 cursor-pointer ${currentQuestion.correctOptionIndex === i ? 'accent-white' : 'accent-indigo-600'}`}
//                     />
//                     <input
//                       className={`flex-1 bg-transparent border-none outline-none font-black text-xl ${currentQuestion.correctOptionIndex === i ? 'placeholder:text-white/30 text-white' : 'placeholder:text-slate-300 text-slate-800'}`}
//                       placeholder={`Data Cell ${i + 1}`}
//                       value={opt}
//                       onChange={e => {
//                         const newOpts = [...(currentQuestion.options || [])];
//                         newOpts[i] = e.target.value;
//                         setCurrentQuestion({...currentQuestion, options: newOpts});
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={addQuestion}
//                 className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.4em] text-[11px]"
//               >
//                 Insert Into Sheet
//               </button>
//             </div>

//             <div className="space-y-10">
//               <h3 className="text-2xl font-black flex items-center gap-5 text-slate-800 ml-6 mb-12">
//                 Bank Preview <span className="bg-slate-100 text-slate-400 px-4 py-1 rounded-[1.2rem] text-sm font-black tracking-tight">{questions.length} Rows</span>
//               </h3>
//               {questions.map((q, idx) => (
//                 <div key={q.id} className="p-14 bg-white border border-slate-50 rounded-[4rem] shadow-2xl flex items-start gap-12 group hover:translate-x-2 transition-all duration-700">
//                   <span className="font-black text-indigo-50 text-7xl tracking-tighter">{(idx+1).toString().padStart(2, '0')}</span>
//                   <div className="flex-1 overflow-hidden">
//                     <div dangerouslySetInnerHTML={{ __html: q.text }} className="text-slate-800 mb-8 font-bold ql-editor !p-0 !min-h-0 text-2xl leading-[1.2] tracking-tight" />
//                     <div className="inline-flex items-center gap-4 px-8 py-4 bg-green-50 text-green-700 text-[10px] font-black rounded-[2rem] border border-green-100 uppercase tracking-widest shadow-sm">
//                       <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
//                       Validated: {q.options[q.correctOptionIndex]}
//                     </div>
//                   </div>
//                   <button onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="text-slate-200 hover:text-red-500 transition-all p-6 rounded-[2rem] hover:bg-red-50">
//                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {questions.length > 0 && (
//               <div className="mt-32 flex justify-center sticky bottom-10 z-20">
//                 <button
//                   onClick={saveQuiz}
//                   className="px-24 py-12 bg-indigo-600 text-white font-black rounded-full shadow-[0_40px_80px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:scale-110 transition-all active:scale-95 uppercase tracking-[0.6em] text-xs"
//                 >
//                   Publish to Neon DB
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {!loading && activeTab === 'manage' && (
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-7xl font-black text-slate-900 mb-20 tracking-tighter">Workbook Vault</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
//               {quizzes.length === 0 ? (
//                 <div className="col-span-full py-64 text-center bg-white rounded-[5rem] border-4 border-dashed border-slate-100">
//                   <p className="text-slate-300 font-black text-4xl uppercase tracking-[0.4em] opacity-30 italic">Repository Null</p>
//                 </div>
//               ) : quizzes.map(quiz => (
//                 <div key={quiz.id} className="group relative bg-white rounded-[4rem] p-16 border border-slate-50 shadow-2xl transition-all duration-700 hover:scale-[1.02] flex flex-col min-h-[450px] overflow-hidden">
//                   <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-10 z-20 pointer-events-none group-hover:pointer-events-auto">
//                     <button
//                       onClick={() => downloadReport(quiz.id)}
//                       className="w-72 py-7 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-indigo-500 hover:scale-105 transition-all shadow-[0_30px_60px_rgba(79,70,229,0.3)]"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//                       Export Excel Report
//                     </button>
//                     <button
//                       onClick={() => deleteQuiz(quiz.id)}
//                       className="w-72 py-7 bg-red-600/10 text-red-500 border border-red-500/20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-red-600 hover:text-white hover:scale-105 transition-all"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                       Wipe Repository Row
//                     </button>
//                   </div>

//                   <div className="mb-auto">
//                     <div className="flex justify-between items-start mb-12">
//                       <span className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.4em]">UUID: {quiz.id.slice(-6)}</span>
//                       <div className="flex gap-2">
//                         <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
//                         <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
//                       </div>
//                     </div>
//                     <h3 className="text-4xl font-black text-slate-800 leading-[1.05] mb-10 group-hover:text-indigo-600 transition-colors tracking-tighter">{quiz.title}</h3>
//                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{new Date(quiz.createdAt).toLocaleDateString()}</p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-8 pt-16 border-t border-slate-50">
//                     <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center border border-slate-100">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Questions</p>
//                       <p className="text-4xl font-black text-slate-900 tracking-tighter">{quiz.questions.length}</p>
//                     </div>
//                     <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center border border-slate-100">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Responses</p>
//                       <p className="text-4xl font-black text-slate-900 tracking-tighter">{results.filter(r => r.quizId === quiz.id).length}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {!loading && activeTab === 'reports' && (
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-7xl font-black text-slate-900 mb-20 tracking-tighter">Global Audit Sheet</h2>
//             <div className="bg-white rounded-[5rem] border border-slate-50 shadow-2xl overflow-hidden">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-100">
//                     <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Candidate Node</th>
//                     <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Academic Branch</th>
//                     <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Session Asset</th>
//                     <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] text-center">Final Score</th>
//                     <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Reliability</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {results.length === 0 ? (
//                     <tr><td colSpan={5} className="p-48 text-center text-slate-300 font-black text-3xl uppercase tracking-[0.4em] italic opacity-20">Awaiting System Input...</td></tr>
//                   ) : results.map(res => (
//                     <tr key={res.id} className="hover:bg-indigo-50/60 transition-all duration-500">
//                       <td className="px-16 py-14">
//                         <div className="font-black text-slate-900 text-3xl tracking-tighter mb-2">{res.student.name}</div>
//                         <div className="text-[11px] text-indigo-600 font-black uppercase tracking-[0.3em]">{res.student.regdNo}</div>
//                       </td>
//                       <td className="px-16 py-14">
//                         <div className="text-xl font-black text-slate-700 tracking-tight">{res.student.branch}</div>
//                         <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Y{res.student.year} • S{res.student.section}</div>
//                       </td>
//                       <td className="px-16 py-14">
//                         <div className="text-lg font-black text-slate-800 line-clamp-1 tracking-tight">{res.quizTitle}</div>
//                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(res.submittedAt).toLocaleDateString()}</div>
//                       </td>
//                       <td className="px-16 py-14 text-center">
//                         <div className="inline-flex flex-col">
//                           <span className="text-5xl font-black text-slate-900 tracking-tighter">{res.score}/{res.totalQuestions}</span>
//                           <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-2">{((res.score/res.totalQuestions)*100).toFixed(0)}%</span>
//                         </div>
//                       </td>
//                       <td className="px-16 py-14">
//                         {res.violations > 0 ? (
//                           <span className="px-8 py-4 bg-red-50 text-red-600 text-[11px] font-black rounded-full border border-red-100 uppercase tracking-[0.3em] shadow-sm">{res.violations} Security Alerts</span>
//                         ) : (
//                           <span className="px-8 py-4 bg-green-50 text-green-600 text-[11px] font-black rounded-full border border-green-100 uppercase tracking-[0.3em] shadow-sm">Verified Session</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FacultyDashboard;





import React, { useState, useEffect, Suspense } from 'react';
import ReactQuill from 'react-quill';
import { Quiz, Question, QuizResult } from '../types';
import { quizDB, resultsDB } from '../services/db';
import { generateAIQuestions } from '../services/gemini';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['image', 'code-block'],
    ['clean']
  ],
};

interface FacultyDashboardProps {
  onLogout: () => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'reports'>('create');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '', options: ['', '', '', ''], correctOptionIndex: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [q, r] = await Promise.all([quizDB.getAll(), resultsDB.getAll()]);
      setQuizzes(q);
      setResults(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options?.some(o => !o)) return alert("Fill all question cells.");
    setQuestions([...questions, { ...currentQuestion, id: Date.now().toString() } as Question]);
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const handleGenerateAI = async () => {
    const topic = prompt("Enter specific topic for AI question generation:");
    if (!topic) return;
    setIsGenerating(true);
    try {
      const aiQs = await generateAIQuestions(topic);
      setQuestions([...questions, ...aiQs.map((q: any) => ({ ...q, id: Math.random().toString() }))]);
    } catch {
      alert("AI Service unreachable. Verify API configuration.");
    } finally { setIsGenerating(false); }
  };

  const saveQuiz = async () => {
    if (!quizTitle || questions.length === 0) return alert("Quiz title and questions required.");
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: quizTitle,
      durationMinutes: duration,
      questions,
      createdAt: Date.now()
    };
    try {
      await quizDB.save(newQuiz);
      await loadData();
      setQuizTitle('');
      setQuestions([]);
      setActiveTab('manage');
    } catch {
      alert("Failed to save quiz to Neon DB.");
    }
  };

  const downloadPdfReport = async (quizId: string) => {
  const quiz = quizzes.find(q => q.id === quizId);
  const quizResults = results.filter(r => r.quizId === quizId);
  if (!quiz || quizResults.length === 0) return alert("No data available to generate report.");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Image Processing with Aspect Ratio Logic
  const getImageData = (path: string): Promise<{ base64: string, w: number, h: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve({
          base64: canvas.toDataURL('image/jpeg'),
          w: img.width,
          h: img.height
        });
      };
      img.onerror = () => reject();
      img.src = path;
    });
  };

  try {
    // 2. Header UI Design
    // Dark Header Bar
    doc.setFillColor(30, 41, 59); // Navy Slate
    doc.rect(0, 0, pageWidth, 45, 'F');

    const logoData = await getImageData('/logo.jpg');
    const targetW = 22;
    const targetH = (logoData.h * targetW) / logoData.w; // Preserve Aspect Ratio
    
    // Position Logo and Text
    doc.addImage(logoData.base64, 'JPEG', 15, 12, targetW, targetH);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("VIGNAN'S FOUNDATION FOR SCIENCE,", 42, 18);
    doc.text("TECHNOLOGY AND RESEARCH", 42, 23);
    
    doc.setFontSize(18);
    doc.text("VFSTR", 42, 33);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("STUDENT ASSESSMENT REPORT | PRO-QUIZ HUB", 42, 38);

    // 3. Body Content
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("OVERALL REPORT", 15, 65);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`CONSOLIDATED ACADEMIC DATA: ${quiz.title.toUpperCase()}`, 15, 73);

    // 4. Main Student Rankings Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'NAME', 'REGD NO.', 'BRANCH', 'SCORE', '%', 'ALERTS']],
      body: quizResults.map((r, i) => [
        i + 1,
        r.student.name.toUpperCase(),
        r.student.regdNo,
        r.student.branch,
        `${r.score}/${r.totalQuestions}`,
        `${((r.score / r.totalQuestions) * 100).toFixed(1)}%`,
        r.violations
      ]),
      theme: 'striped',
      headStyles: { 
        fillColor: [30, 41, 59], 
        textColor: [255, 255, 255], 
        fontSize: 8, 
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      styles: { fontSize: 8, halign: 'center', cellPadding: 3 },
      columnStyles: { 1: { halign: 'left', cellWidth: 55 } },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 15, right: 15 }
    });

    // 5. Summary Statistics Table
    const stats = {
      total: quizResults.length,
      qualified: quizResults.filter(r => (r.score / r.totalQuestions) >= 0.4).length,
      notQualified: quizResults.filter(r => (r.score / r.totalQuestions) < 0.4).length,
      highest: Math.max(...quizResults.map(r => r.score))
    };

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['TOTAL ATTEMPTS', 'COMPLETED', 'QUALIFIED', 'NOT QUALIFIED', 'HIGHEST SCORE']],
      body: [[stats.total, stats.total, stats.qualified, stats.notQualified, `${stats.highest}/${quiz.questions.length}`]],
      theme: 'grid',
      styles: { halign: 'center', fontSize: 11, fontStyle: 'bold', textColor: [30, 41, 59] },
      headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontSize: 7, fontStyle: 'bold' }
    });

    // 6. Footer Design (Applied to all pages)
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer Line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
      
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 12);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 35, pageHeight - 12);
      doc.text("Official Vignan Academic Record", pageWidth / 2, pageHeight - 12, { align: "center" });
    }

    doc.save(`VFSTR_Official_Report_${quiz.title.replace(/\s+/g, '_')}.pdf`);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("System Error: Ensure 'logo.jpg' is present in the public folder.");
  }
};

  const downloadReport = async (quizId: string) => {
    const quizResults = await resultsDB.getByQuiz(quizId);
    if (quizResults.length === 0) return alert("No submissions yet.");

    const excelData = quizResults.map(r => ({
      'Candidate ID': r.student.regdNo,
      'Name': r.student.name,
      'Academic Node': `${r.student.branch}-${r.student.section}`,
      'Score': `${r.score}/${r.totalQuestions}`,
      'Violations': r.violations,
      'Time-Stamp': new Date(r.submittedAt).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submission_Audit");
    XLSX.writeFile(wb, `Vignan_Audit_${quizId}.xlsx`);
  };

  const deleteQuiz = async (id: string) => {
    if (!window.confirm("Permanently erase this quiz and all candidate submissions?")) return;
    try {
      await resultsDB.deleteByQuiz(id);
      await quizDB.remove(id);
      await loadData();
    } catch {
      alert("Failed to delete quiz.");
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      <div className="w-80 bg-slate-950 text-white p-10 flex flex-col shadow-2xl relative z-30">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-2xl shadow-indigo-600/30">V</div>
            <h1 className="text-2xl font-black tracking-tighter">Instructor</h1>
          </div>
          <p className="text-indigo-400/40 text-[10px] font-black uppercase tracking-[0.4em] ml-1">Asset Control Node</p>
          <div className="flex items-center gap-2 mt-3 ml-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-400/60 font-black uppercase tracking-widest">Neon DB Live</span>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { id: 'create', icon: 'M12 4v16m8-8H4', label: 'Compose Asset' },
            { id: 'manage', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Workbook Vault' },
            { id: 'reports', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Global Audit' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all duration-500 ${
                activeTab === item.id ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/20 translate-x-2' : 'hover:bg-white/5 opacity-40 hover:opacity-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 text-red-500 hover:text-red-400 transition-colors py-6 px-8 font-black text-[10px] uppercase tracking-widest group">
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Exit Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-16 bg-white/40 backdrop-blur-3xl">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Syncing with Neon DB...</p>
            </div>
          </div>
        )}

        {!loading && activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <header className="mb-16 flex justify-between items-center">
              <div>
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Draft Workbook</h2>
                <p className="text-slate-500 mt-3 text-lg font-medium">Compose questions with rich syntax and AI orchestration.</p>
              </div>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-500 hover:shadow-2xl transition-all flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50"
              >
                {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : '✨ AI Compose'}
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Workbook Designation</label>
                <input
                  className="w-full px-10 py-7 bg-white border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-50 shadow-sm text-2xl font-black outline-none transition-all placeholder:text-slate-200"
                  placeholder="e.g. DATA_STRUCT_01"
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Duration Limit (Min)</label>
                <input
                  type="number"
                  className="w-full px-10 py-7 bg-white border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-50 shadow-sm text-2xl font-black outline-none transition-all"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="bg-white rounded-[4rem] p-14 border border-slate-100 shadow-2xl mb-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-full bg-indigo-600"></div>
              <h3 className="text-2xl font-black mb-12 flex items-center gap-5 text-slate-900">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">#</div>
                Question Composer
              </h3>

              <div className="mb-12">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Rich Data Layer</label>
                <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50">
                  <Suspense fallback={<div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>}>
                    <ReactQuill
                      theme="snow"
                      modules={QUILL_MODULES}
                      value={currentQuestion.text}
                      onChange={val => setCurrentQuestion({...currentQuestion, text: val})}
                      className="bg-white"
                    />
                  </Suspense>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                {currentQuestion.options?.map((opt, i) => (
                  <div key={i} className={`flex items-center gap-6 p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${currentQuestion.correctOptionIndex === i ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQuestion.correctOptionIndex === i}
                      onChange={() => setCurrentQuestion({...currentQuestion, correctOptionIndex: i})}
                      className={`w-8 h-8 cursor-pointer ${currentQuestion.correctOptionIndex === i ? 'accent-white' : 'accent-indigo-600'}`}
                    />
                    <input
                      className={`flex-1 bg-transparent border-none outline-none font-black text-xl ${currentQuestion.correctOptionIndex === i ? 'placeholder:text-white/30 text-white' : 'placeholder:text-slate-300 text-slate-800'}`}
                      placeholder={`Data Cell ${i + 1}`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(currentQuestion.options || [])];
                        newOpts[i] = e.target.value;
                        setCurrentQuestion({...currentQuestion, options: newOpts});
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addQuestion}
                className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.4em] text-[11px]"
              >
                Insert Into Sheet
              </button>
            </div>

            <div className="space-y-10">
              <h3 className="text-2xl font-black flex items-center gap-5 text-slate-800 ml-6 mb-12">
                Bank Preview <span className="bg-slate-100 text-slate-400 px-4 py-1 rounded-[1.2rem] text-sm font-black tracking-tight">{questions.length} Rows</span>
              </h3>
              {questions.map((q, idx) => (
                <div key={q.id} className="p-14 bg-white border border-slate-50 rounded-[4rem] shadow-2xl flex items-start gap-12 group hover:translate-x-2 transition-all duration-700">
                  <span className="font-black text-indigo-50 text-7xl tracking-tighter">{(idx+1).toString().padStart(2, '0')}</span>
                  <div className="flex-1 overflow-hidden">
                    <div dangerouslySetInnerHTML={{ __html: q.text }} className="text-slate-800 mb-8 font-bold ql-editor !p-0 !min-h-0 text-2xl leading-[1.2] tracking-tight" />
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-green-50 text-green-700 text-[10px] font-black rounded-[2rem] border border-green-100 uppercase tracking-widest shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      Validated: {q.options[q.correctOptionIndex]}
                    </div>
                  </div>
                  <button onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="text-slate-200 hover:text-red-500 transition-all p-6 rounded-[2rem] hover:bg-red-50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>

            {questions.length > 0 && (
              <div className="mt-32 flex justify-center sticky bottom-10 z-20">
                <button
                  onClick={saveQuiz}
                  className="px-24 py-12 bg-indigo-600 text-white font-black rounded-full shadow-[0_40px_80px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:scale-110 transition-all active:scale-95 uppercase tracking-[0.6em] text-xs"
                >
                  Publish to Neon DB
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'manage' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-7xl font-black text-slate-900 mb-20 tracking-tighter">Workbook Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
              {quizzes.length === 0 ? (
                <div className="col-span-full py-64 text-center bg-white rounded-[5rem] border-4 border-dashed border-slate-100">
                  <p className="text-slate-300 font-black text-4xl uppercase tracking-[0.4em] opacity-30 italic">Repository Null</p>
                </div>
              ) : quizzes.map(quiz => (
                <div key={quiz.id} className="group relative bg-white rounded-[4rem] p-16 border border-slate-50 shadow-2xl transition-all duration-700 hover:scale-[1.02] flex flex-col min-h-[450px] overflow-hidden">
                  <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-6 z-20 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => downloadPdfReport(quiz.id)}
                      className="w-72 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      PDF Official Report
                    </button>
                    <button
                      onClick={() => downloadReport(quiz.id)}
                      className="w-72 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-indigo-500 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Excel Sheet
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="w-72 py-5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete Asset
                    </button>
                  </div>

                  <div className="mb-auto">
                    <div className="flex justify-between items-start mb-12">
                      <span className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.4em]">UUID: {quiz.id.slice(-6)}</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 leading-[1.05] mb-10 group-hover:text-indigo-600 transition-colors tracking-tighter">{quiz.title}</h3>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{new Date(quiz.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-16 border-t border-slate-50">
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Questions</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{quiz.questions.length}</p>
                    </div>
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Responses</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{results.filter(r => r.quizId === quiz.id).length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'reports' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-7xl font-black text-slate-900 mb-20 tracking-tighter">Global Audit Sheet</h2>
            <div className="bg-white rounded-[5rem] border border-slate-50 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Candidate Node</th>
                    <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Academic Branch</th>
                    <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Session Asset</th>
                    <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] text-center">Final Score</th>
                    <th className="px-16 py-14 text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Reliability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.length === 0 ? (
                    <tr><td colSpan={5} className="p-48 text-center text-slate-300 font-black text-3xl uppercase tracking-[0.4em] italic opacity-20">Awaiting System Input...</td></tr>
                  ) : results.map(res => (
                    <tr key={res.id} className="hover:bg-indigo-50/60 transition-all duration-500">
                      <td className="px-16 py-14">
                        <div className="font-black text-slate-900 text-3xl tracking-tighter mb-2">{res.student.name}</div>
                        <div className="text-[11px] text-indigo-600 font-black uppercase tracking-[0.3em]">{res.student.regdNo}</div>
                      </td>
                      <td className="px-16 py-14">
                        <div className="text-xl font-black text-slate-700 tracking-tight">{res.student.branch}</div>
                        <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Y{res.student.year} • S{res.student.section}</div>
                      </td>
                      <td className="px-16 py-14">
                        <div className="text-lg font-black text-slate-800 line-clamp-1 tracking-tight">{res.quizTitle}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(res.submittedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-16 py-14 text-center">
                        <div className="inline-flex flex-col">
                          <span className="text-5xl font-black text-slate-900 tracking-tighter">{res.score}/{res.totalQuestions}</span>
                          <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-2">{((res.score/res.totalQuestions)*100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-16 py-14">
                        {res.violations > 0 ? (
                          <span className="px-8 py-4 bg-red-50 text-red-600 text-[11px] font-black rounded-full border border-red-100 uppercase tracking-[0.3em] shadow-sm">{res.violations} Security Alerts</span>
                        ) : (
                          <span className="px-8 py-4 bg-green-50 text-green-600 text-[11px] font-black rounded-full border border-green-100 uppercase tracking-[0.3em] shadow-sm">Verified Session</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;