import React, { useState, useRef, useEffect } from 'react';
import { AIMode } from '../types';
import { generateLiteraryContent } from '../services/geminiService';
import { Sparkles, FileText, CalendarHeart, Loader2, Wand2, X, ChevronUp, Info } from 'lucide-react';

const MOOD_PROMPTS = [
  { label: '🌧️ 雨天独处', text: '今天窗外下着雨，心情很平静，想读一些适合独处时看的文字。' },
  { label: '☀️ 阳光向上', text: '今天天气真好，心情充满活力！请推荐一些积极向上、关于青春和梦想的文章。' },
];

export const AIWritingLab: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode>(AIMode.RECOMMENDATION);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reveal animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleGenerate = async (textOverride?: string, modeOverride?: AIMode) => {
    const textToUse = textOverride || input;
    const modeToUse = modeOverride || activeMode;
    
    if (!textToUse.trim() || isLoading) return;
    
    if (!isExpanded) setIsExpanded(true); // Auto expand if generating
    setIsLoading(true);
    setResult('');
    if (textOverride) setInput(textOverride);
    if (modeOverride) setActiveMode(modeOverride);

    try {
      await generateLiteraryContent(textToUse, modeToUse, (chunk) => {
        setResult(chunk);
      });
    } catch (error) {
      setResult("抱歉，AI 助手遇到了一点小问题，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section ref={containerRef} className="py-4 relative z-40 px-6 reveal-on-scroll mb-0">
      <div className="max-w-4xl mx-auto transition-all duration-700 ease-spring">
        
        {/* CLOSED STATE: Modern Floating Pill */}
        {!isExpanded && (
          <div 
            onClick={toggleExpand}
            className="group cursor-pointer bg-white/90 backdrop-blur-xl rounded-full p-2 pr-6 flex items-center justify-between max-w-xl mx-auto hover:scale-[1.02] transition-all duration-500 shadow-xl shadow-bamboo-900/5 border border-white"
          >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink">唤醒 AI 灵感缪斯</span>
                    <span className="text-xs text-gray-500">探索推荐与摘要...</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <span className="text-xs font-medium text-bamboo-600 group-hover:translate-x-1 transition-transform">点击展开</span>
            </div>
          </div>
        )}

        {/* EXPANDED STATE */}
        <div className={`overflow-hidden transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1) ${isExpanded ? 'opacity-100 max-h-[1000px] mt-0' : 'opacity-0 max-h-0'}`}>
          <div className="glass-card rounded-[32px] p-6 md:p-10 relative shadow-2xl shadow-bamboo-900/5 border-white/60">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-bamboo-50 rounded-xl text-bamboo-600">
                         <Wand2 size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-ink">AI 灵感实验室</h2>
                </div>
                <button 
                    onClick={toggleExpand}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-ink transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-gray-100">
                 {MOOD_PROMPTS.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleGenerate(item.text, AIMode.RECOMMENDATION)}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm hover:border-bamboo-300 hover:text-bamboo-600 transition-all"
                    >
                        {item.label}
                    </button>
                 ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="space-y-4">
                     {/* Mode Toggles */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl mb-4">
                        <button
                        onClick={() => { setActiveMode(AIMode.RECOMMENDATION); setResult(''); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                            ${activeMode === AIMode.RECOMMENDATION ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink'}`}
                        >
                        <CalendarHeart size={14} />
                        今日推荐
                        </button>
                        <button
                        onClick={() => { setActiveMode(AIMode.SUMMARY); setResult(''); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                            ${activeMode === AIMode.SUMMARY ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink'}`}
                        >
                        <FileText size={14} />
                        文章概述
                        </button>
                    </div>

                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={activeMode === AIMode.RECOMMENDATION ? "描述你的心情，获取专属文学推荐..." : "粘贴文章内容，获取AI摘要..."}
                            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-ink focus:ring-2 focus:ring-bamboo-200 focus:border-bamboo-300 transition-all min-h-[160px] resize-none text-sm leading-relaxed shadow-inner"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                             <button
                                onClick={() => handleGenerate()}
                                disabled={isLoading || !input.trim()}
                                className="flex items-center gap-2 px-5 py-2 bg-ink text-white rounded-xl shadow-lg hover:bg-bamboo-600 hover:shadow-bamboo-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 font-medium text-sm"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                生成
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Column */}
                <div className="bg-mist/50 rounded-2xl p-6 border border-gray-100 min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar">
                     {result ? (
                         <div className="prose prose-sm prose-stone font-serif leading-7 text-gray-700 animate-fade-in">
                             {/* Simple markdown rendering for spacing */}
                             {result.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line}</p>
                             ))}
                         </div>
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 space-y-3">
                             <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                 <Wand2 size={20} className="text-gray-300" />
                             </div>
                             <span className="text-xs">AI 正在等待你的指令...</span>
                         </div>
                     )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};