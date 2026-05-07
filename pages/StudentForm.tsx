
// import React, { useState, useEffect, useMemo } from 'react';
// import { Quiz, StudentInfo, QuizResult } from '../types';
// import { excelStorage } from '../services/db';

// interface StudentFormProps {
//   onStart: (info: StudentInfo, quiz: Quiz) => void;
//   onBack: () => void;
// }

// const StudentForm: React.FC<StudentFormProps> = ({ onStart, onBack }) => {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [selectedQuizId, setSelectedQuizId] = useState('');
//   const [results, setResults] = useState<QuizResult[]>([]);
//   const [info, setInfo] = useState<StudentInfo>({
//     regdNo: '',
//     name: '',
//     section: '',
//     year: '1',
//     branch: 'CSE'
//   });

//   useEffect(() => {
//     setQuizzes(excelStorage.getQuizRows());
//     setResults(excelStorage.getResultRows());
//   }, []);

//   // System intelligently learns unique Academic Nodes from past submissions
//   const dynamicOptions = useMemo(() => {
//     // Default system baseline
//     const branches = new Set(['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'CSM', 'CSD', 'AID', 'AIM']);
//     const sections = new Set(['A', 'B', 'C', 'D', 'E']);
//     const years = new Set(['1', '2', '3', '4']);

//     // Absorb new nodes from existing data
//     results.forEach(res => {
//       if (res.student.branch) branches.add(res.student.branch.toUpperCase());
//       if (res.student.section) sections.add(res.student.section.toUpperCase());
//       if (res.student.year) years.add(res.student.year);
//     });

//     return {
//       branches: Array.from(branches).sort(),
//       sections: Array.from(sections).sort(),
//       years: Array.from(years).sort()
//     };
//   }, [results]);

//   const handleStart = (e: React.FormEvent) => {
//     e.preventDefault();
//     const quiz = quizzes.find(q => q.id === selectedQuizId);
//     if (!quiz) return alert("Select an active quiz workbook first!");
//     onStart(info, quiz);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
//        {/* High-end decorative background */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
//       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>

//       <div className="w-full max-w-3xl bg-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 p-16 overflow-hidden relative animate-fadeIn">
//         <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
//         <button onClick={onBack} className="mb-12 text-white/40 hover:text-white transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] group">
//           <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
//           System Exit
//         </button>

//         <header className="mb-16">
//           <h2 className="text-6xl font-black text-white mb-3 tracking-tighter">Candidate Portal</h2>
//           <p className="text-indigo-200/40 text-[10px] font-black uppercase tracking-[0.4em]">Initialize secure assessment node</p>
//         </header>

//         <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           <div className="md:col-span-2 space-y-3">
//             <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Active Workbook Selection</label>
//             <div className="relative group">
//               <select
//                 required
//                 className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10 text-xl tracking-tight"
//                 value={selectedQuizId}
//                 onChange={e => setSelectedQuizId(e.target.value)}
//               >
//                 <option value="" className="bg-[#020617]">Select your workbook...</option>
//                 {quizzes.map(q => (
//                   <option key={q.id} value={q.id} className="bg-[#020617]">{q.title} — {q.durationMinutes}m</option>
//                 ))}
//               </select>
//               <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Registration ID</label>
//             <input
//               required
//               className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-white placeholder:text-white/10 text-lg uppercase"
//               placeholder="e.g. 21A31A05XX"
//               value={info.regdNo}
//               onChange={e => setInfo({...info, regdNo: e.target.value.toUpperCase()})}
//             />
//           </div>

//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Candidate Full Name</label>
//             <input
//               required
//               className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-white placeholder:text-white/10 text-lg"
//               placeholder="e.g. R. Sharma"
//               value={info.name}
//               onChange={e => setInfo({...info, name: e.target.value})}
//             />
//           </div>

//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Academic Branch</label>
//             <div className="relative group">
//               <select
//                 required
//                 className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
//                 value={info.branch}
//                 onChange={e => setInfo({...info, branch: e.target.value})}
//               >
//                 {dynamicOptions.branches.map(b => <option key={b} value={b} className="bg-[#020617]">{b}</option>)}
//               </select>
//               <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Batch Year</label>
//               <div className="relative group">
//                 <select
//                   required
//                   className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
//                   value={info.year}
//                   onChange={e => setInfo({...info, year: e.target.value})}
//                 >
//                   {dynamicOptions.years.map(y => <option key={y} value={y} className="bg-[#020617]">{y} Year</option>)}
//                 </select>
//                 <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Academic Section</label>
//               <div className="relative group">
//                 <select
//                   required
//                   className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
//                   value={info.section}
//                   onChange={e => setInfo({...info, section: e.target.value})}
//                 >
//                   <option value="" className="bg-[#020617]">Select...</option>
//                   {dynamicOptions.sections.map(s => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
//                 </select>
//                 <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="md:col-span-2 pt-12">
//             <button
//               type="submit"
//               className="w-full py-8 bg-indigo-600 text-white text-lg font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-[0.4em]"
//             >
//               Initialize Assessment
//             </button>
//             <div className="flex items-center justify-center gap-4 mt-8">
//                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">High Precision Proctoring Protocol v2.5</p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentForm;

















import React, { useState, useEffect, useMemo } from 'react';
import { Quiz, StudentInfo, QuizResult } from '../types';
import { quizDB, resultsDB } from '../services/db';

interface StudentFormProps {
  onStart: (info: StudentInfo, quiz: Quiz) => void;
  onBack: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onStart, onBack }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState<StudentInfo>({
    regdNo: '',
    name: '',
    section: '',
    year: '1',
    branch: 'CSE'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetching both quizzes and past results from Neon
        const [allQuizzes, allResults] = await Promise.all([
          quizDB.getAll(),
          resultsDB.getAll()
        ]);
        setQuizzes(allQuizzes);
        setResults(allResults);
      } catch (error) {
        console.error("Cloud synchronization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // System intelligently learns unique Academic Nodes from cloud records
  const dynamicOptions = useMemo(() => {
    // Default system baseline
    const branches = new Set(['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'CSM', 'CSD', 'AID', 'AIM']);
    const sections = new Set(['A', 'B', 'C', 'D', 'E']);
    const years = new Set(['1', '2', '3', '4']);

    // Absorb new nodes from cloud data
    results.forEach(res => {
      if (res.student.branch) branches.add(res.student.branch.toUpperCase());
      if (res.student.section) sections.add(res.student.section.toUpperCase());
      if (res.student.year) years.add(res.student.year);
    });

    return {
      branches: Array.from(branches).sort(),
      sections: Array.from(sections).sort(),
      years: Array.from(years).sort()
    };
  }, [results]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    if (!quiz) return alert("Select an active quiz workbook first!");
    onStart(info, quiz);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-white font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
          Establishing Secure Cloud Link...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 p-16 overflow-hidden relative animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <button onClick={onBack} className="mb-12 text-white/40 hover:text-white transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          System Exit
        </button>

        <header className="mb-16">
          <h2 className="text-6xl font-black text-white mb-3 tracking-tighter">Candidate Portal</h2>
          <p className="text-indigo-200/40 text-[10px] font-black uppercase tracking-[0.4em]">Initialize secure assessment node</p>
        </header>

        <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Active Workbook Selection</label>
            <div className="relative group">
              <select
                required
                className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10 text-xl tracking-tight"
                value={selectedQuizId}
                onChange={e => setSelectedQuizId(e.target.value)}
              >
                <option value="" className="bg-[#020617]">Select your workbook...</option>
                {quizzes.map(q => (
                  <option key={q.id} value={q.id} className="bg-[#020617]">{q.title} — {q.durationMinutes}m</option>
                ))}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Registration ID</label>
            <input
              required
              className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-white placeholder:text-white/10 text-lg uppercase"
              placeholder="e.g. 21A31A05XX"
              value={info.regdNo}
              onChange={e => setInfo({...info, regdNo: e.target.value.toUpperCase()})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Candidate Full Name</label>
            <input
              required
              className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-white placeholder:text-white/10 text-lg"
              placeholder="e.g. R. Sharma"
              value={info.name}
              onChange={e => setInfo({...info, name: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Academic Branch</label>
            <div className="relative group">
              <select
                required
                className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
                value={info.branch}
                onChange={e => setInfo({...info, branch: e.target.value})}
              >
                {dynamicOptions.branches.map(b => <option key={b} value={b} className="bg-[#020617]">{b}</option>)}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Batch Year</label>
              <div className="relative group">
                <select
                  required
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
                  value={info.year}
                  onChange={e => setInfo({...info, year: e.target.value})}
                >
                  {dynamicOptions.years.map(y => <option key={y} value={y} className="bg-[#020617]">{y} Year</option>)}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Academic Section</label>
              <div className="relative group">
                <select
                  required
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none font-black text-white group-hover:bg-white/10"
                  value={info.section}
                  onChange={e => setInfo({...info, section: e.target.value})}
                >
                  <option value="" className="bg-[#020617]">Select...</option>
                  {dynamicOptions.sections.map(s => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-12">
            <button
              type="submit"
              className="w-full py-8 bg-indigo-600 text-white text-lg font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-[0.4em]"
            >
              Initialize Assessment
            </button>
            <div className="flex items-center justify-center gap-4 mt-8">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">High Precision Proctoring Protocol v2.5</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;