
import React from 'react';

interface HomeProps {
  onStartFaculty: () => void;
  onStartStudent: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartFaculty, onStartStudent }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="animate-glow absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="animate-glow absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl px-4">
        <div className="mb-12 flex justify-center animate-fade-in-up stagger-1 opacity-0">
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-full blur-2xl opacity-50"></div>
             <div className="relative w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter animate-fade-in-up stagger-2 opacity-0">
          Vignan <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-purple-400">Quiz hub</span>
        </h1>
        <p className="text-xl md:text-2xl text-indigo-100/40 mb-20 max-w-3xl mx-auto leading-relaxed font-medium uppercase tracking-[0.2em] animate-fade-in-up stagger-3 opacity-0">
          Automated Academic Assessment Node
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <button
            onClick={onStartStudent}
            className="animate-fade-in-up stagger-4 opacity-0 group relative p-10 bg-indigo-600 text-white rounded-[3rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div className="text-center">
              <div className="font-black text-xs uppercase tracking-[0.4em] mb-1 text-indigo-200">Entrance</div>
              <div className="text-xl font-bold tracking-tight">Student Portal</div>
            </div>
          </button>
          
          <button
            onClick={onStartFaculty}
            className="animate-fade-in-up stagger-5 opacity-0 group relative p-10 bg-white/5 backdrop-blur-3xl text-white border border-white/10 rounded-[3rem] hover:bg-white/10 hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div className="text-center">
              <div className="font-black text-xs uppercase tracking-[0.4em] mb-1 text-slate-400">Instructor</div>
              <div className="text-xl font-bold tracking-tight">Faculty Port</div>
            </div>
          </button>

          <button
            onClick={() => window.location.hash = 'admin'}
            className="animate-fade-in-up stagger-5 opacity-0 group relative p-10 bg-slate-900/40 backdrop-blur-3xl text-indigo-300 border border-indigo-500/20 rounded-[3rem] hover:bg-slate-900 hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center gap-6"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="w-16 h-16 bg-indigo-500/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.66-2.424 9.293-5.904M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 2.04l-.054.09A10.003 10.003 0 0112 4c-4.083 0-7.66 2.424-9.293 5.904" /></svg>
            </div>
            <div className="text-center">
              <div className="font-black text-xs uppercase tracking-[0.4em] mb-1 text-indigo-400/60">Privileged</div>
              <div className="text-xl font-bold tracking-tight">Admin Gate</div>
            </div>
          </button>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 opacity-40 animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s' }}>
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Vignan Institute of Information Technology • High-Precision Examination v3.1</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
