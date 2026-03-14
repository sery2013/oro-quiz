import React, { useState, useEffect } from 'react';
import { questions } from './questions';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (step === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 'quiz') {
      handleNext();
    }
  }, [timeLeft, step]);

  const handleNext = (selectedIdx = null) => {
    if (selectedIdx !== null && selectedIdx === questions[current].c) {
      setScore(s => s + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(30);
    } else {
      setStep('result');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4 font-sans text-slate-800">
      {/* Background Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200 rounded-full blur-[120px] opacity-50" />
      </div>

      {step === 'welcome' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white text-center">
          <div className="bg-orange-400 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-200">
             <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">ORO Intelligence</h1>
          <p className="text-slate-500 mb-8">Test your knowledge about the future of AI data privacy.</p>
          <button onClick={() => setStep('quiz')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
            Start Assessment
          </button>
        </motion.div>
      )}

      {step === 'quiz' && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Question</span>
              <span className="text-2xl font-black text-slate-800">{current + 1} <span className="text-slate-300">/ {questions.length}</span></span>
            </div>
            <div className="relative flex items-center justify-center">
               <svg className="w-16 h-16 transform -rotate-90">
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                   strokeDasharray={175.9} strokeDashoffset={175.9 - (timeLeft / 30) * 175.9}
                   className={`${timeLeft < 10 ? 'text-red-400' : 'text-orange-400'} transition-all duration-1000`} />
               </svg>
               <span className="absolute font-mono font-bold text-sm">{timeLeft}s</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white shadow-blue-100/50">
              <h2 className="text-2xl font-bold mb-10 text-slate-800 leading-snug">{questions[current].q}</h2>
              <div className="grid gap-4">
                {questions[current].a.map((opt, i) => (
                  <button key={i} onClick={() => handleNext(i)} 
                    className="group relative w-full text-left p-5 rounded-2xl bg-white border border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all flex justify-between items-center shadow-sm">
                    <span className="font-medium group-hover:text-orange-700">{opt}</span>
                    <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-orange-400" />
                  </button>
                ))}
              </div>
              <button onClick={() => handleNext(null)} className="mt-8 w-full text-slate-400 text-sm font-semibold hover:text-slate-600 transition-colors uppercase tracking-widest">
                Skip Question →
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {step === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
           <div id="result-card" className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white w-[340px] mx-auto overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 to-orange-400" />
              <p className="text-xs font-black tracking-[0.3em] text-slate-300 mb-8 uppercase">Intelligence Report</p>
              <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-6 border-4 border-white shadow-inner flex items-center justify-center text-4xl">
                🏆
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-2">{Math.round((score/questions.length)*100)}%</h3>
              <p className="text-slate-500 font-medium mb-8">Result: {score} of {questions.length}</p>
              <div className="py-3 px-6 bg-slate-900 text-white rounded-xl inline-block text-sm font-bold">
                ORO VALIDATED
              </div>
           </div>
           <button onClick={() => window.location.reload()} className="mt-8 text-slate-800 font-bold underline">Try Again</button>
        </motion.div>
      )}
    </div>
  );
}
