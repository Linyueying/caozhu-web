
import React, { useState, useRef, useEffect } from 'react';
import { AIMode } from '../types';
import { generateLiteraryContent } from '../services/geminiService';
import { Sparkles, FileText, List, Feather, Loader2, X, Wand2, BrainCircuit } from 'lucide-react';

interface AIAssistantProps {
  content: string;
  contextLabel?: string; // e.g., "文章" or "活动"
  direction?: 'up' | 'down';
  minimal?: boolean; // Controls whether it shrinks to a circle
  actions?: AIMode[]; // Optional: restrict which actions are available
}

// Internal component for thinking animation
const ThinkingProcess: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = [
      "正在连接草竹灵感库...",
      "正在分析文本内容...",
      "正在提炼核心信息...",
      "正在构建回复逻辑...",
      "AI 正在组织语言...",
    ];
    
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (logsRef.current) {
          logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
      }, index * 800); // 800ms delay between steps
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
       <div className="mb-4 relative">
          <div className="w-10 h-10 border-2 border-bamboo-100 border-t-bamboo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <BrainCircuit size={16} className="text-bamboo-500 animate-pulse" />
          </div>
       </div>
       
       <div className="w-full max-w-[200px] space-y-2">
          <div ref={logsRef} className="h-[60px] overflow-hidden relative mask-image-b flex flex-col items-center">
             {logs.length === 0 && <span className="text-xs text-gray-400 animate-pulse">正在初始化...</span>}
             {logs.map((log, i) => (
               <div key={i} className="text-[10px] text-gray-500 font-mono animate-slide-up text-center w-full truncate">
                 {log}
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  content, 
  contextLabel = "内容", 
  direction = 'down', 
  minimal = false,
  actions 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUp = direction === 'up';

  // Define available buttons based on props or defaults
  const allActionButtons = [
      { mode: AIMode.SUMMARY, icon: FileText, label: '概述', color: 'text-blue-600 bg-blue-50' },
      { mode: AIMode.KEYPOINTS, icon: List, label: '总结', color: 'text-amber-600 bg-amber-50' },
      { mode: AIMode.ANALYSIS, icon: Feather, label: '赏析', color: 'text-purple-600 bg-purple-50' },
  ];

  const visibleButtons = actions 
      ? allActionButtons.filter(btn => actions.includes(btn.mode))
      : allActionButtons;

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
      await generateLiteraryContent(content, mode, (chunk, isComplete) => {
        setResult(chunk);
      });
    } catch (error) {
      setResult("AI 连接似乎断开了，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const isCircle = minimal && !isOpen;

  return (
    <div ref={containerRef} className="relative z-50 inline-block font-sans">
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
        .mask-image-b {
            -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
            mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
      `}} />

      {/* Trigger Button - Optimized easing to remove bounce/jerk */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20 
            rounded-[99px] overflow-hidden
            backdrop-blur-[16px] 
            border 
            shadow-[0_8px_32px_0_rgba(31,38,135,0.1),inset_0_1px_0_0_rgba(255,255,255,0.5)]
            hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2),inset_0_1px_0_0_rgba(255,255,255,0.8)]
            text-ink
            ${isCircle
              ? 'w-12 h-12 hover:scale-110 bg-white/60 border-white/50' 
              : 'w-32 h-12 hover:scale-105 hover:-translate-y-0.5 bg-white/80 border-white/70' 
            }
        `}
        title="AI 助手"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-transparent to-white/20 opacity-70 pointer-events-none"></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={`absolute transition-all duration-500 transform ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                <X size={20} strokeWidth={2} className="text-ink" />
            </div>

            <div className={`absolute transition-all duration-500 transform ${!isOpen && isCircle ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12'}`}>
                 <Sparkles size={20} className="text-bamboo-600 fill-bamboo-600/20" />
            </div>

            <div className={`absolute w-full flex items-center justify-center gap-2 transition-all duration-500 transform ${!isOpen && !isCircle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Sparkles size={16} className="text-bamboo-600 fill-bamboo-600/20" />
                <span className="text-sm font-bold tracking-wide text-ink/80 whitespace-nowrap">AI 助手</span>
            </div>
        </div>
      </button>

      {/* Popover Panel - Smoother transition curve */}
      <div 
        className={`absolute right-0 w-[300px] md:w-[320px] transition-all duration-500 z-10
        ${isUp 
            ? 'bottom-16 origin-bottom-right' 
            : 'top-16 origin-top-right'
        }
        ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0 visible' 
            : `opacity-0 scale-95 ${isUp ? 'translate-y-2' : '-translate-y-2'} invisible pointer-events-none`
        }`}
        style={{
            transitionTimingFunction: isOpen ? 'cubic-bezier(0.23, 1, 0.32, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
         {isOpen && (
             <div className="absolute -inset-[1px] bg-gradient-to-r from-bamboo-200 via-purple-200 to-blue-200 rounded-[26px] blur-md animate-border-once pointer-events-none opacity-50"></div>
         )}
         
         <div className="relative bg-white/90 backdrop-blur-[30px] rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/80 overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-white/60 to-transparent border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-bamboo-50 rounded-lg text-bamboo-600">
                        <Wand2 size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-ink leading-none">AI 灵感缪斯</h3>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Dynamic Actions Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {visibleButtons.map((item) => (
                        <button
                            key={item.mode}
                            onClick={() => handleAnalysis(item.mode)}
                            disabled={isLoading}
                            className={`relative overflow-hidden py-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group border
                            ${activeMode === item.mode 
                                ? 'bg-ink text-white border-transparent shadow-lg scale-[1.02]' 
                                : 'bg-gray-50 hover:bg-white text-gray-500 border-transparent hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50'
                            }`}
                        >
                            <item.icon size={14} className={activeMode === item.mode ? 'text-bamboo-300' : item.color.split(' ')[0]} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Result Area */}
                <div className="bg-stone-50/50 rounded-2xl p-4 border border-gray-100 min-h-[180px] max-h-[280px] overflow-y-auto custom-scrollbar relative shadow-inner text-sm">
                    {isLoading && !result ? (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                             <ThinkingProcess />
                        </div>
                    ) : !isLoading && !result ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-80">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm border border-gray-100">
                                <Sparkles size={16} className="text-gray-300" />
                            </div>
                            <p className="text-xs">点击上方功能</p>
                            <p className="text-xs">开启智能体验</p>
                        </div>
                    ) : (
                         <div className="prose prose-sm prose-stone font-serif text-ink/90 leading-loose animate-fade-in">
                            {result.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0 text-justify">{line}</p>
                            ))}
                            {isLoading && (
                               <span className="inline-block w-1.5 h-4 bg-bamboo-500 ml-1 animate-pulse align-middle"></span>
                            )}
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
