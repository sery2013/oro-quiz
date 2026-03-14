import React, { useState, useEffect, useRef } from 'react';
import { questions } from './questions';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [avatar, setAvatar] = useState(null);
  const [discord, setDiscord] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    if (step === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 'quiz') {
      handleNext(null);
    }
  }, [timeLeft, step]);

  const handleNext = (selectedIdx) => {
    if (selectedIdx !== null && selectedIdx === questions[current].correct) {
      setScore(s => s + 1);
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setTimeLeft(30);
    } else {
      setStep('result');
    }
  };

  const resetQuiz = () => {
    setStep('welcome');
    setCurrent(0);
    setScore(0);
    setTimeLeft(30);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const downloadCard = () => {
    if (cardRef.current === null) return;
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 }) // Высокое качество для соцсетей
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `oro-ai-identity.png`;
        link.href = dataUrl;
        link.click();
      });
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`I just scored ${score}/${questions.length} on the @getoro_xyz Intelligence Quiz! 🧠✨\n\nVerified as a Data Contributor. Join the future of AI data privacy here:\n\nhttps://getoro.xyz #OROAI #AIData #Privacy`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#fff7ed] flex items-center justify-center p-4 font-sans text-slate-800 overflow-hidden relative">
      {/* Элементы фона */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200/30 rounded-full blur-[120px] -z-10" />

      {step === 'welcome' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white text-center">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-2 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-100 w-fit">
            <span className="text-white font-black text-2xl tracking-tighter uppercase">ORO AI</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Intelligence Quiz</h1>
          <p className="text-slate-500 mb-8 font-medium italic">Empowering AI with Privacy</p>
          
          <div className="space-y-4">
            <label className="block w-full p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 transition-colors cursor-pointer bg-white/40">
              <span className="text-sm font-bold text-slate-500">{avatar ? "✓ Avatar Ready" : "Upload Identity Avatar"}</span>
              <input type="file" onChange={handleAvatar} className="hidden" accept="image/*" />
            </label>
            <button onClick={() => setStep('quiz')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
              Initiate System
            </button>
          </div>
        </motion.div>
      )}

      {step === 'quiz' && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6 px-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Core Scan</span>
              <span className="text-2xl font-black text-slate-800">{current + 1}<span className="text-slate-300">/15</span></span>
            </div>
            <div className="relative flex items-center justify-center w-14 h-14">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                 <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                   strokeDasharray={150.8} strokeDashoffset={150.8 - (timeLeft / 30) * 150.8}
                   className={`${timeLeft < 10 ? 'text-red-500' : 'text-orange-400'} transition-all duration-1000`} />
               </svg>
               <span className="absolute font-mono font-bold text-xs">{timeLeft}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white min-h-[420px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <span className="text-8xl font-black">ORO</span>
              </div>
              <h2 className="text-2xl font-bold mb-10 text-slate-800 leading-snug relative z-10">{questions[current].question}</h2>
              <div className="grid gap-4 relative z-10">
                {questions[current].options.map((opt, i) => (
                  <button key={i} onClick={() => handleNext(i)} 
                    className="group w-full text-left p-5 rounded-2xl bg-white/60 border border-slate-100 hover:border-orange-400 hover:bg-white transition-all flex justify-between items-center shadow-sm">
                    <span className="font-semibold text-slate-700 group-hover:text-orange-600">{opt}</span>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-orange-400 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {step === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full flex flex-col items-center max-w-2xl px-4">
          {/* КАРТОЧКА */}
          <div ref={cardRef} className="bg-gradient-to-br from-white via-slate-50 to-orange-50/30 p-10 rounded-[2.5rem] shadow-2xl border border-white overflow-hidden relative mb-8 w-full max-w-[540px]">
            {/* Стеклянный блик на фоне */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/40 blur-3xl rounded-full" />
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 via-orange-300 to-yellow-400" />
            
            <p className="text-[12px] font-black tracking-[0.5em] text-slate-300 mb-10 uppercase text-center">Protocol Identity Node</p>
            
            <div className="flex items-center justify-between mb-8 px-2 text-left">
              <div className="w-28 h-28 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 transform rotate-2">
                {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-4xl font-black text-orange-400">AI</span>}
              </div>
              <div className="ml-8 flex-1">
                 <h3 className="text-6xl font-black text-slate-800 mb-1 leading-none">{score}<span className="text-xl text-slate-300 ml-1">/15</span></h3>
                 <p className="text-orange-500 font-bold text-[13px] uppercase tracking-[0.2em] mt-2">Master Data Contributor</p>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/50 text-left shadow-inner">
              <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest">Discord Identity</p>
              <p className="text-xl font-mono font-bold text-slate-800 truncate">{discord || 'Anonymous_Node'}</p>
            </div>

            <div className="flex justify-between items-end px-2">
              <div className="py-2.5 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-[0.25em] shadow-lg shadow-slate-200">
                ORO_VALIDATED
              </div>
              
              {/* Логотип в рамке справа внизу */}
              <div className="flex flex-col items-center">
                <div className="border-2 border-orange-200 p-2 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                   <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-3 py-1 rounded-lg">
                      <span className="text-white font-black text-xs tracking-tighter">ORO AI</span>
                   </div>
                </div>
                <span className="text-[8px] text-slate-300 font-bold mt-2 font-mono tracking-tighter uppercase">Est. 2026</span>
              </div>
            </div>
          </div>

          {/* КНОПКИ УПРАВЛЕНИЯ */}
          <div className="space-y-3 w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Your Discord Handle" 
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="w-full p-4 rounded-2xl border border-white bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all text-center font-bold text-slate-700 shadow-sm"
            />
            <button onClick={downloadCard} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all uppercase tracking-widest">
              Download ID
            </button>
            <button onClick={shareTwitter} className="w-full bg-[#1DA1F2] text-white font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all">
              Post to Twitter
            </button>
            <button onClick={resetQuiz} className="w-full text-slate-400 text-xs font-black hover:text-orange-400 transition-colors uppercase tracking-[0.2em] pt-4">
              ← Restart System
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
