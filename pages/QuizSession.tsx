
// import React, { useState, useEffect, useRef } from 'react';
// import { Quiz, StudentInfo, QuizResult } from '../types';
// import { excelStorage } from '../services/db';

// interface QuizSessionProps {
//   quiz: Quiz;
//   student: StudentInfo;
//   onComplete: () => void;
// }

// const QuizSession: React.FC<QuizSessionProps> = ({ quiz, student, onComplete }) => {
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
//   const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
//   const [violations, setViolations] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);
//   const [isQuestionVisible, setIsQuestionVisible] = useState(true);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   // Proctoring setup
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setViolations(prev => prev + 1);
//         alert("PROCTOR ALERT: Tab switching detected. This incident has been logged.");
//       }
//     };
//     window.addEventListener('visibilitychange', handleVisibilityChange);
    
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
//         .catch(err => console.log("Camera access denied"));
//     }

//     return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, []);

//   // Timer
//   useEffect(() => {
//     if (timeLeft <= 0) { handleSubmit(); return; }
//     const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleSubmit = () => {
//     let score = 0;
//     quiz.questions.forEach((q, i) => {
//       if (answers[i] === q.correctOptionIndex) score++;
//     });

//     const result: QuizResult = {
//       id: Date.now().toString(),
//       quizId: quiz.id,
//       quizTitle: quiz.title,
//       student,
//       score,
//       totalQuestions: quiz.questions.length,
//       submittedAt: Date.now(),
//       violations
//     };

//     excelStorage.saveResultRow(result);
//     setIsFinished(true);
//   };

//   const handleNext = () => {
//     setIsQuestionVisible(false);
//     setTimeout(() => {
//       setCurrentIdx(prev => Math.min(prev + 1, quiz.questions.length - 1));
//       setIsQuestionVisible(true);
//     }, 200);
//   };

//   const handlePrev = () => {
//     setIsQuestionVisible(false);
//     setTimeout(() => {
//       setCurrentIdx(prev => Math.max(prev - 1, 0));
//       setIsQuestionVisible(true);
//     }, 200);
//   };

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//   };

//   if (isFinished) {
//     const scoreVal = answers.filter((ans, i) => ans === quiz.questions[i].correctOptionIndex).length;
//     return (
//       <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
//         <div id="result-card" className="bg-white rounded-[3rem] p-16 text-center max-w-xl w-full shadow-2xl relative overflow-hidden animate-fade-in-up">
//           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-indigo-600"></div>
          
//           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
//             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
//           </div>
          
//           <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Assessment Complete</h2>
//           <p className="text-slate-500 mb-12 leading-relaxed text-lg">Your responses have been securely archived. Excellent effort, <span className="font-bold text-indigo-600">{student.name}</span>.</p>
          
//           <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-12 grid grid-cols-2 gap-8 border border-slate-100">
//             <div>
//               <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Validated Score</div>
//               <div className="text-5xl font-black text-indigo-600 tracking-tighter">{scoreVal}/{quiz.questions.length}</div>
//             </div>
//              <div>
//               <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Precision</div>
//               <div className="text-5xl font-black text-indigo-600 tracking-tighter">
//                 {quiz.questions.length > 0 ? ((scoreVal / quiz.questions.length) * 100).toFixed(0) : 0}%
//               </div>
//             </div>
//           </div>

//           <button onClick={onComplete} className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all uppercase tracking-[0.4em] text-xs">
//             System Shutdown
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQ = quiz.questions[currentIdx];

//   return (
//     <div className="min-h-screen bg-slate-100 flex flex-col">
//       {/* Quiz Header */}
//       <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-50 shadow-sm flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 text-xl">V</div>
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{quiz.title}</h1>
//             <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em]">{student.name} • {student.regdNo}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-10">
//            <div className={`px-8 py-3 rounded-2xl flex items-center gap-4 border-2 transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
//             <svg className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             <span className={`text-2xl font-black tabular-nums ${timeLeft < 60 ? 'text-red-600' : 'text-slate-800'}`}>{formatTime(timeLeft)}</span>
//           </div>
//           <button onClick={() => window.confirm("Finalize and submit assessment?") && handleSubmit()} className="px-8 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95 text-[10px] uppercase tracking-[0.3em]">
//             Submit Asset
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 flex p-10 gap-10 overflow-hidden">
//         {/* Question Area */}
//         <div className="flex-1 overflow-y-auto pr-4 space-y-10">
//           <div className={`bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl p-16 relative overflow-hidden transition-all duration-300 ${isQuestionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
//             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50"></div>
//             <div className="mb-12 inline-flex items-center gap-3 text-indigo-600 font-black text-[10px] tracking-[0.4em] uppercase">
//               <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
//               Row {currentIdx + 1} of {quiz.questions.length}
//             </div>
            
//             <div className="prose max-w-none mb-16">
//                <div dangerouslySetInnerHTML={{ __html: currentQ?.text || '' }} className="text-3xl font-black text-slate-900 ql-editor !p-0 !min-h-0 leading-tight tracking-tight" />
//             </div>

//             <div className="grid grid-cols-1 gap-6">
//               {currentQ?.options.map((opt, i) => (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     const newAns = [...answers];
//                     newAns[currentIdx] = i;
//                     setAnswers(newAns);
//                   }}
//                   className={`flex items-center gap-8 p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 group ${
//                     answers[currentIdx] === i 
//                     ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.02]' 
//                     : 'bg-white border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30'
//                   }`}
//                 >
//                   <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base border-2 transition-all ${
//                     answers[currentIdx] === i 
//                     ? 'bg-white text-indigo-600 border-white' 
//                     : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-indigo-100'
//                   }`}>
//                     {String.fromCharCode(65 + i)}
//                   </span>
//                   <span className="text-xl font-bold">{opt}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-between items-center px-6">
//             <button 
//               disabled={currentIdx === 0}
//               onClick={handlePrev}
//               className="px-10 py-5 bg-white text-slate-800 font-black rounded-3xl shadow-xl border border-slate-50 disabled:opacity-20 flex items-center gap-3 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
//               Previous
//             </button>
//             <button 
//               onClick={() => currentIdx === quiz.questions.length - 1 ? handleSubmit() : handleNext()}
//               className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 text-[10px] uppercase tracking-[0.4em]"
//             >
//               {currentIdx === quiz.questions.length - 1 ? 'Publish Session' : 'Save & Proceed'}
//               {currentIdx !== quiz.questions.length - 1 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>}
//             </button>
//           </div>
//         </div>

//         {/* Sidebar Status */}
//         <div className="w-96 flex flex-col gap-10">
//           <div className="bg-[#020617] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
//              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-[60px]"></div>
//              <div className="relative z-10">
//                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6 flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
//                   Live Proctoring Feed
//                 </h3>
//                 <div className="aspect-video bg-black rounded-[2rem] mb-6 overflow-hidden border border-white/10 ring-4 ring-white/5">
//                   <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-40 brightness-75" />
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
//                   <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Secure Node Encrypted</span>
//                 </div>
//              </div>
//           </div>

//           <div className="bg-white rounded-[3rem] border border-slate-50 shadow-2xl p-10 flex-1 flex flex-col">
//              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 ml-2">Assessment Matrix</h3>
//              <div className="grid grid-cols-4 gap-4 flex-1 content-start">
//                {answers.map((ans, i) => (
//                  <button
//                    key={i}
//                    onClick={() => {
//                      setIsQuestionVisible(false);
//                      setTimeout(() => {
//                        setCurrentIdx(i);
//                        setIsQuestionVisible(true);
//                      }, 200);
//                    }}
//                    className={`h-14 rounded-2xl text-base font-black transition-all ${
//                     currentIdx === i ? 'ring-4 ring-indigo-100 scale-110 z-10' : ''
//                    } ${
//                     ans !== -1 ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
//                    }`}
//                  >
//                    {i + 1}
//                  </button>
//                ))}
//              </div>
             
//              <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
//                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <div className="w-4 h-4 rounded-lg bg-indigo-600"></div>
//                   Validated
//                 </div>
//                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <div className="w-4 h-4 rounded-lg bg-slate-50 border border-slate-100"></div>
//                   Pending Cell
//                 </div>
//              </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default QuizSession;









import React, { useState, useEffect, useRef } from 'react';
import { Quiz, StudentInfo, QuizResult } from '../types';
import { resultsDB } from '../services/db';

interface QuizSessionProps {
  quiz: Quiz;
  student: StudentInfo;
  onComplete: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ quiz, student, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [violations, setViolations] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => prev + 1);
        alert("PROCTOR ALERT: Tab switching detected. This incident has been logged.");
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(err => console.log("Camera access denied"));
    }

    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctOptionIndex) score++;
    });

    const result: QuizResult = {
      id: Date.now().toString(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      student,
      score,
      totalQuestions: quiz.questions.length,
      submittedAt: Date.now(),
      violations
    };

    try {
      await resultsDB.save(result);
      setIsFinished(true);
    } catch (error) {
      console.error("Failed to save results to Neon:", error);
      alert("Critical Error: Could not sync results with the cloud. Please contact faculty.");
    }
  };

  const handleNext = () => {
    setIsQuestionVisible(false);
    setTimeout(() => {
      setCurrentIdx(prev => Math.min(prev + 1, quiz.questions.length - 1));
      setIsQuestionVisible(true);
    }, 200);
  };

  const handlePrev = () => {
    setIsQuestionVisible(false);
    setTimeout(() => {
      setCurrentIdx(prev => Math.max(prev - 1, 0));
      setIsQuestionVisible(true);
    }, 200);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    const scoreVal = answers.filter((ans, i) => ans === quiz.questions[i].correctOptionIndex).length;
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div id="result-card" className="bg-white rounded-[3rem] p-16 text-center max-w-xl w-full shadow-2xl relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-indigo-600"></div>
          
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Assessment Complete</h2>
          <p className="text-slate-500 mb-12 leading-relaxed text-lg">Your responses have been securely archived. Excellent effort, <span className="font-bold text-indigo-600">{student.name}</span>.</p>
          
          <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-12 grid grid-cols-2 gap-8 border border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Validated Score</div>
              <div className="text-5xl font-black text-indigo-600 tracking-tighter">{scoreVal}/{quiz.questions.length}</div>
            </div>
             <div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Precision</div>
              <div className="text-5xl font-black text-indigo-600 tracking-tighter">
                {quiz.questions.length > 0 ? ((scoreVal / quiz.questions.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          <button onClick={onComplete} className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all uppercase tracking-[0.4em] text-xs">
            System Shutdown
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 text-xl">V</div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{quiz.title}</h1>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em]">{student.name} • {student.regdNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className={`px-8 py-3 rounded-2xl flex items-center gap-4 border-2 transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
            <svg className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className={`text-2xl font-black tabular-nums ${timeLeft < 60 ? 'text-red-600' : 'text-slate-800'}`}>{formatTime(timeLeft)}</span>
          </div>
          <button onClick={() => window.confirm("Finalize and submit assessment?") && handleSubmit()} className="px-8 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95 text-[10px] uppercase tracking-[0.3em]">
            Submit Asset
          </button>
        </div>
      </header>

      <main className="flex-1 flex p-10 gap-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4 space-y-10">
          <div className={`bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl p-16 relative overflow-hidden transition-all duration-300 ${isQuestionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50"></div>
            <div className="mb-12 inline-flex items-center gap-3 text-indigo-600 font-black text-[10px] tracking-[0.4em] uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Row {currentIdx + 1} of {quiz.questions.length}
            </div>
            
            <div className="prose max-w-none mb-16">
               <div dangerouslySetInnerHTML={{ __html: currentQ?.text || '' }} className="text-3xl font-black text-slate-900 ql-editor !p-0 !min-h-0 leading-tight tracking-tight" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newAns = [...answers];
                    newAns[currentIdx] = i;
                    setAnswers(newAns);
                  }}
                  className={`flex items-center gap-8 p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 group ${
                    answers[currentIdx] === i 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.02]' 
                    : 'bg-white border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30'
                  }`}
                >
                  <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base border-2 transition-all ${
                    answers[currentIdx] === i 
                    ? 'bg-white text-indigo-600 border-white' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-indigo-100'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-xl font-bold">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center px-6">
            <button 
              disabled={currentIdx === 0}
              onClick={handlePrev}
              className="px-10 py-5 bg-white text-slate-800 font-black rounded-3xl shadow-xl border border-slate-50 disabled:opacity-20 flex items-center gap-3 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              Previous
            </button>
            <button 
              onClick={() => currentIdx === quiz.questions.length - 1 ? handleSubmit() : handleNext()}
              className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 text-[10px] uppercase tracking-[0.4em]"
            >
              {currentIdx === quiz.questions.length - 1 ? 'Publish Session' : 'Save & Proceed'}
              {currentIdx !== quiz.questions.length - 1 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>}
            </button>
          </div>
        </div>

        <div className="w-96 flex flex-col gap-10">
          <div className="bg-[#020617] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-[60px]"></div>
             <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  Live Proctoring Feed
                </h3>
                <div className="aspect-video bg-black rounded-[2rem] mb-6 overflow-hidden border border-white/10 ring-4 ring-white/5">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-40 brightness-75" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Secure Node Encrypted</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-50 shadow-2xl p-10 flex-1 flex flex-col">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 ml-2">Assessment Matrix</h3>
             <div className="grid grid-cols-4 gap-4 flex-1 content-start">
               {answers.map((ans, i) => (
                 <button
                   key={i}
                   onClick={() => {
                     setIsQuestionVisible(false);
                     setTimeout(() => {
                       setCurrentIdx(i);
                       setIsQuestionVisible(true);
                     }, 200);
                   }}
                   className={`h-14 rounded-2xl text-base font-black transition-all ${
                    currentIdx === i ? 'ring-4 ring-indigo-100 scale-110 z-10' : ''
                   } ${
                    ans !== -1 ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
             </div>
             
             <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-4 h-4 rounded-lg bg-indigo-600"></div>
                  Validated
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-4 h-4 rounded-lg bg-slate-50 border border-slate-100"></div>
                  Pending Cell
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizSession;