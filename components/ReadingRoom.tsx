import React, { useEffect } from 'react';
import { LiteraryWork } from '../types';
import { ArrowLeft, Clock, User, Quote, BookOpen } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface ReadingRoomProps {
  work: LiteraryWork;
  onBack: () => void;
}

export const ReadingRoom: React.FC<ReadingRoomProps> = ({ work, onBack }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative animate-fade-in">
      
      {/* Top Navigation Bar - Enhanced styling to fill the red circle area */}
      <div className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-xl border-b border-stone-200/60 h-16 flex items-center shadow-sm">
        <div className="max-w-4xl w-full mx-auto px-6 flex items-center justify-between">
            {/* Left: Back Button */}
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-ink hover:text-bamboo-700 transition-colors group pr-4"
            >
                <div className="p-2 rounded-full group-hover:bg-stone-100 transition-colors">
                   <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="font-medium text-sm tracking-wide hidden md:inline">返回首页</span>
            </button>

            {/* Center: Truncated Title (Visible on scroll could be nice, but keeping static for now) */}
            <div className="absolute left-1/2 -translate-x-1/2 font-serif font-bold text-ink transition-opacity text-sm max-w-[200px] truncate text-center">
                {work.title}
            </div>

            {/* Right: Context Icon */}
            <div className="flex items-center gap-4 text-stone-400">
                <span className="text-[10px] font-bold uppercase tracking-widest border border-stone-200 px-2 py-1 rounded text-stone-500">
                    Reading Mode
                </span>
            </div>
        </div>
      </div>

      {/* Floating AI Assistant - Fixed position */}
      <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-50">
          <AIAssistant 
            content={work.fullText || work.excerpt} 
            contextLabel="文章" 
            direction="up" // Ensure it pops UPWARDS
          />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 relative">
         {/* Article Header */}
         <header className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bamboo-50 text-bamboo-800 text-xs font-bold uppercase tracking-wider border border-bamboo-100">
                {work.category}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink leading-tight">
                {work.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm text-stone-500 font-serif">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-100 shadow-sm">
                    <User size={14} className="text-bamboo-600" />
                    <span>{work.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-100 shadow-sm">
                    <Clock size={14} className="text-bamboo-600" />
                    <span>{work.date}</span>
                </div>
            </div>
         </header>

         {/* Content Body */}
         <article className="prose prose-lg md:prose-xl prose-stone font-serif mx-auto leading-loose text-justify text-ink/90 selection:bg-bamboo-200 selection:text-bamboo-900 pb-32">
            {work.fullText ? (
                 work.fullText.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="indent-8 mb-6 first-of-type:first-letter:text-5xl first-of-type:first-letter:font-bold first-of-type:first-letter:text-ink first-of-type:first-letter:mr-3 first-of-type:first-letter:float-left">
                        {paragraph}
                    </p>
                 ))
            ) : (
                <div className="opacity-60">
                    <div className="flex justify-center mb-8 opacity-40">
                        <Quote size={32} className="text-bamboo-800" />
                    </div>
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-bamboo-800 first-letter:mr-3 first-letter:float-left">
                        {work.excerpt}
                    </p>
                    <p className="text-center italic text-base mt-12 text-stone-400">
                        （文章完整内容正在录入中，请尝试阅读《水上一周》以体验完整功能）
                    </p>
                </div>
            )}
         </article>

         {/* Footer / End Mark */}
         <div className="flex flex-col items-center justify-center gap-4 opacity-40 pb-20">
             <div className="flex items-center gap-2">
                <div className="w-8 h-[1px] bg-stone-300"></div>
                <BookOpen size={14} />
                <div className="w-8 h-[1px] bg-stone-300"></div>
             </div>
             <span className="text-xs font-serif italic tracking-widest">完</span>
         </div>

      </div>
    </div>
  );
};