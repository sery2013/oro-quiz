import React, { useState, useEffect, useRef } from 'react';
import { questions } from './questions';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [step, setStep] = useState('welcome'); // welcome, quiz, result
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [avatar, setAvatar] = useState(null);
  const cardRef = useRef(null);

  // Таймер
  useEffect(() => {
    if (step === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 'quiz') {
      handleNext();
    }
  }, [timeLeft, step]);

  const handleNext = (selectedIdx = null) => {
    if (selectedIdx === questions[current].c) {
      setScore(s => s + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(30);
    } else {
      setStep('result');
    }
  };

  const uploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const download = () => {
    toPng(cardRef.current).then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'oro-id.png';
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans flex items-center justify-center p-4">
      {step === 'welcome' && (
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-black text-oro tracking-tighter">ORO AI QUIZ</h1>
          <p className="text-gray-400">15 Questions • 30s per question • 1 Attempt</p>
          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer bg-white/10 p-4 rounded-lg border border-dashed border-oro">
              <span>{avatar ? "Avatar Uploaded" : "Upload your Avatar for ID Card"}</span>
              <input type="file" onChange={uploadAvatar} className="hidden" />
            </label>
            <button onClick={() => setStep('quiz')} className="bg-oro text-black font-bold py-3 px-10 rounded-full hover:scale-105 transition">START SYSTEM</button>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="w-full max-w-lg">
          <div className="flex justify-between mb-4 items-end">
            <span className="text-oro font-mono text-xl">0{current + 1} / 15</span>
            <span className={`font-mono text-2xl ${timeLeft < 10 ? 'text-red-500' : 'text-oro'}`}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <div className="h-1 bg-white/10 w-full mb-8"><motion.div className="h-full bg-oro" initial={{width: 0}} animate={{width: `${(timeLeft/30)*100}%`}} transition={{duration: 1}} /></div>
          
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 leading-tight">{questions[current].q}</h2>
              <div className="grid gap-4">
                {questions[current].a.map((opt, i) => (
                  <button key={i} onClick={() => handleNext(i)} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-oro hover:bg-oro/10 transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {step === 'result' && (
        <div className="text-center">
          <div ref={cardRef} className="bg-dark border-2 border-oro p-8 rounded-3xl w-80 shadow-[0_0_50px_rgba(255,210,31,0.2)] mx-auto relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 text-[10px] text-oro opacity-30 font-mono">ORO_NETWORK_AUTH</div>
             <h3 className="text-oro font-black text-xl mb-6 tracking-widest uppercase">Intelligence ID</h3>
             {avatar && <img src={avatar} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-oro shadow-lg" />}
             <div className="space-y-1 mb-6">
                <p className="text-sm text-gray-400">SCORE</p>
                <p className="text-4xl font-black text-white">{score} / 15</p>
             </div>
             <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified contributor of getoro.xyz</div>
          </div>
          <button onClick={download} className="mt-8 bg-oro text-black font-bold py-3 px-8 rounded-full">DOWNLOAD ID CARD</button>
        </div>
      )}
    </div>
  );
}
