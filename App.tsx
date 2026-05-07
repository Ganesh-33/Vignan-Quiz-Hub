
// import React, { useState, useEffect, Suspense } from 'react';
// import { Quiz, StudentInfo } from './types';
// import FacultyLogin from './pages/FacultyLogin';
// import FacultyDashboard from './pages/FacultyDashboard';
// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/AdminDashboard';
// import Home from './pages/Home';
// import StudentForm from './pages/StudentForm';
// import QuizSession from './pages/QuizSession';

// type ViewState = 'home' | 'faculty-login' | 'faculty-dashboard' | 'admin-login' | 'admin-dashboard' | 'student-form' | 'quiz-session';

// const LoadingFallback = () => (
//   <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
//     <div className="flex flex-col items-center gap-6">
//       <div className="relative w-20 h-20">
//         <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
//         <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//       <p className="font-black tracking-[0.3em] text-[10px] uppercase opacity-40">System Synchronizing</p>
//     </div>
//   </div>
// );

// const App: React.FC = () => {
//   const [view, setView] = useState<ViewState>('home');
//   const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
//   const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

//   useEffect(() => {
//     const handleHashChange = () => {
//       const hash = window.location.hash.replace('#', '');
//       if (hash === 'faculty') setView('faculty-login');
//       else if (hash === 'admin') setView('admin-login');
//       else if (hash === 'student') setView('student-form');
//       else setView('home');
//     };
//     window.addEventListener('hashchange', handleHashChange);
//     handleHashChange();
//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, []);

//   const startQuiz = (quiz: Quiz, info: StudentInfo) => {
//     setActiveQuiz(quiz);
//     setStudentInfo(info);
//     setView('quiz-session');
//   };

//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
//         {view === 'home' && <Home onStartFaculty={() => setView('faculty-login')} onStartStudent={() => setView('student-form')} />}
        
//         {view === 'admin-login' && (
//           <AdminLogin onSuccess={() => setView('admin-dashboard')} onBack={() => setView('home')} />
//         )}

//         {view === 'admin-dashboard' && (
//           <AdminDashboard onLogout={() => setView('home')} />
//         )}

//         {view === 'faculty-login' && (
//           <FacultyLogin onSuccess={() => setView('faculty-dashboard')} onBack={() => setView('home')} />
//         )}

//         {view === 'faculty-dashboard' && (
//           <FacultyDashboard onLogout={() => setView('home')} />
//         )}

//         {view === 'student-form' && (
//           <StudentForm onStart={(info, quiz) => startQuiz(quiz, info)} onBack={() => setView('home')} />
//         )}

//         {view === 'quiz-session' && activeQuiz && studentInfo && (
//           <QuizSession quiz={activeQuiz} student={studentInfo} onComplete={() => setView('home')} />
//         )}
//       </div>
//     </Suspense>
//   );
// };

// export default App;


















import React, { useState, useEffect, Suspense } from 'react';
import { Quiz, StudentInfo } from './types';
import { initSchema } from './services/db';
import FacultyLogin from './pages/FacultyLogin';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import StudentForm from './pages/StudentForm';
import QuizSession from './pages/QuizSession';

type ViewState = 'home' | 'faculty-login' | 'faculty-dashboard' | 'admin-login' | 'admin-dashboard' | 'student-form' | 'quiz-session';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="font-black tracking-[0.3em] text-[10px] uppercase opacity-40">System Synchronizing</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // ─── Database Initialization ──────────────────────────────────────────────
  // This effect runs once on boot to ensure Postgres tables are created.
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initSchema();
        console.log("Neon DB Schema Initialized Successfully");
      } catch (error) {
        console.error("Critical: Database Schema Initialization Failed", error);
      }
    };
    setupDatabase();
  }, []);

  // ─── Routing Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'faculty') setView('faculty-login');
      else if (hash === 'admin') setView('admin-login');
      else if (hash === 'student') setView('student-form');
      else setView('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const startQuiz = (quiz: Quiz, info: StudentInfo) => {
    setActiveQuiz(quiz);
    setStudentInfo(info);
    setView('quiz-session');
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {view === 'home' && (
          <Home 
            onStartFaculty={() => setView('faculty-login')} 
            onStartStudent={() => setView('student-form')} 
          />
        )}
        
        {view === 'admin-login' && (
          <AdminLogin 
            onSuccess={() => setView('admin-dashboard')} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'admin-dashboard' && (
          <AdminDashboard onLogout={() => setView('home')} />
        )}

        {view === 'faculty-login' && (
          <FacultyLogin 
            onSuccess={() => setView('faculty-dashboard')} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'faculty-dashboard' && (
          <FacultyDashboard onLogout={() => setView('home')} />
        )}

        {view === 'student-form' && (
          <StudentForm 
            onStart={(info, quiz) => startQuiz(quiz, info)} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'quiz-session' && activeQuiz && studentInfo && (
          <QuizSession 
            quiz={activeQuiz} 
            student={studentInfo} 
            onComplete={() => setView('home')} 
          />
        )}
      </div>
    </Suspense>
  );
};

export default App;