import React, { useState, useRef, useEffect } from 'react';
import { AIMode } from '../types';
import { generateLiteraryContent } from '../services/geminiService';
import { Sparkles, FileText, List, Feather, Loader2, X, Wand2 } from 'lucide-react';

interface AIAssistantProps {
  content: string;
  contextLabel?: string; // e.g., "文章" or "活动"
  direction?: 'up' | 'down';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ content, contextLabel = "内容", direction = 'down' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUp = direction === 'up';

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAnalysis = async (mode: AIMode) => {
    if (isLoading) return;
    
    setActiveMode(mode);
    setIsLoading(true);
    setResult('');

    try {
      await generateLiteraryContent(content, mode, (chunk) => {
        setResult(chunk);
      });
    } catch (error) {
      setResult("AI 连接似乎断开了，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-50 inline-block font-sans">
      {/* Custom Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flash-glow {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 0; }
            100% { opacity: 0; }
        }
        .animate-border-once {
            animation: flash-glow 1.5s ease-out forwards;
        }
      `}} />

      {/* 
        Trigger Button: CAPSULE SHAPE
        Using rounded-[99px] ensures it stays perfectly rounded at any width.
        Width transitions smoothly without snapping.
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 shadow-xl bg-ink text-white rounded-[99px] overflow-hidden border border-white/10
            ${isOpen 
              ? 'w-12 h-12' // Circle when open
              : 'w-32 h-12 hover:scale-105 hover:-translate-y-0.5' // Capsule when closed
            }
        `}
        style={{
            boxShadow: '0 10px 25px -5px rgba(28, 25, 23, 0.3), 0 0 10px rgba(28, 25, 23, 0.1)'
        }}
        title="AI 助手"
      >
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Close Icon (Visible when open) */}
            <div className={`absolute transition-all duration-500 transform ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                <X size={20} strokeWidth={2.5} />
            </div>

            {/* Open Icon + Text (Visible when closed) */}
            <div className={`absolute w-full flex items-center justify-center gap-2 transition-all duration-500 transform ${!isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Sparkles size={16} className="text-bamboo-300 fill-bamboo-300/20" />
                <span className="text-sm font-bold tracking-wide text-stone-50 whitespace-nowrap">AI 助手</span>
            </div>
        </div>
      </button>

      {/* 
        The Popover Panel 
        Smaller Size: Reduced from 380px to 320px max.
      */}
      <div 
        className={`absolute right-0 w-[300px] md:w-[320px] transition-all duration-500 z-10
        ${isUp 
            ? 'bottom-16 origin-bottom-right' 
            : 'top-16 origin-top-right'
        }
        ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0 visible' 
            : `opacity-0 scale-50 ${isUp ? 'translate-y-12' : '-translate-y-12'} invisible pointer-events-none`
        }`}
        style={{
            transitionTimingFunction: isOpen ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
         {/* 
            Ephemeral Glow Effect 
            One-time animation only. Not persistent.
         */}
         {isOpen && (
             <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 rounded-[26px] blur-md animate-border-once pointer-events-none"></div>
         )}
         
         {/* Main Content Card */}
         <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
            {/* Panel Header with Gradient */}
            <div className="px-5 py-3 bg-gradient-to-r from-stone-50/80 via-white/50 to-transparent border-b border-gray-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-bamboo-100 rounded-lg text-bamboo-600">
                        <Wand2 size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-ink leading-none">AI 灵感缪斯</h3>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Action Buttons Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { mode: AIMode.SUMMARY, icon: FileText, label: '概述', color: 'text-blue-600 bg-blue-50' },
                        { mode: AIMode.KEYPOINTS, icon: List, label: '总结', color: 'text-amber-600 bg-amber-50' },
                        { mode: AIMode.ANALYSIS, icon: Feather, label: '赏析', color: 'text-purple-600 bg-purple-50' },
                    ].map((item) => (
                        <button
                            key={item.mode}
                            onClick={() => handleAnalysis(item.mode)}
                            className={`relative overflow-hidden py-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group border
                            ${activeMode === item.mode 
                                ? 'bg-ink text-white border-ink shadow-lg scale-[1.02]' 
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5'
                            }`}
                        >
                            <item.icon size={14} className={activeMode === item.mode ? 'text-bamboo-300' : item.color.split(' ')[0]} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Result Area */}
                <div className="bg-stone-50/50 rounded-2xl p-4 border border-stone-100/50 min-h-[150px] max-h-[280px] overflow-y-auto custom-scrollbar relative shadow-inner text-sm">
                    {isLoading && !result && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 border-2 border-bamboo-200 border-t-bamboo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={10} className="text-bamboo-500 animate-pulse" />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-400 animate-pulse">正在品读文字...</span>
                        </div>
                    )}
                    
                    {!isLoading && !result && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center opacity-60">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-2">
                                <Sparkles size={16} />
                            </div>
                            <p className="text-xs">点击上方功能</p>
                            <p className="text-xs">开启智能阅读体验</p>
                        </div>
                    )}

                    {result && (
                        <div className="prose prose-sm prose-stone font-serif text-ink/80 leading-loose animate-fade-in">
                            {result.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0 text-justify">{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};