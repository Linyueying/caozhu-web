
import React, { useEffect, useState, useRef } from 'react';
import { Activity, AIMode } from '../types';
import { generateLiteraryContent } from '../services/geminiService';
import { ArrowLeft, Calendar, MapPin, Share2, Sparkles, Loader2, FileText, List, Check, X, Copy, Tag } from 'lucide-react';

interface ActivityDetailProps {
  activity: Activity;
  onBack: () => void;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onBack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // AI State
  const [aiMode, setAiMode] = useState<AIMode | null>(null);
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
       setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
      const title = `社团活动：${activity.title}`;
      const url = window.location.href;
      const shareData = { title: '草竹文学社', text: title, url: url };

      if (navigator.share) {
          try { await navigator.share(shareData); return; } catch (err) { console.log('Native share dismissed'); }
      }

      const textToCopy = `${title} ${url}`;
      try {
          await navigator.clipboard.writeText(textToCopy);
          setShowCopyToast(true);
          setTimeout(() => setShowCopyToast(false), 2000);
      } catch (err) {
          setShowShareModal(true);
      }
  };

  const handleManualCopy = () => {
      const urlInput = document.getElementById('share-url-input') as HTMLInputElement;
      if (urlInput) {
          urlInput.select();
          document.execCommand('copy');
          setShowShareModal(false);
          setShowCopyToast(true);
          setTimeout(() => setShowCopyToast(false), 2000);
      }
  };

  const handleAIAnalyze = async (mode: AIMode) => {
      if (isAiLoading) return;
      if (!isAiExpanded) setIsAiExpanded(true);
      
      setAiMode(mode);
      setIsAiLoading(true);
      setAiResult('');
      
      setTimeout(() => {
          aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      const promptContext = `活动名称：${activity.title}\n时间：${activity.date}\n地点：${activity.location}\n内容详情：${activity.description}`;

      try {
        await generateLiteraryContent(promptContext, mode, (chunk, isComplete) => {
            setAiResult(chunk);
        });
      } catch (error) {
        setAiResult("AI 连接似乎断开了，请稍后再试。");
      } finally {
        setIsAiLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative animate-fade-in pb-20">
      
      {/* 
          1. Navbar (Layered)
      */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div 
            className={`absolute inset-0 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-stone-200/50 transition-opacity duration-700 ease-out ${
                scrolled ? 'opacity-100' : 'opacity-0'
            }`} 
        />
        <div 
            className={`absolute inset-0 bg-gradient-to-b from-black/40 to-transparent transition-opacity duration-700 ease-out ${
                scrolled ? 'opacity-0' : 'opacity-100'
            }`}
        />
        <div className={`relative max-w-5xl w-full mx-auto px-6 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            scrolled ? 'py-3' : 'py-6'
        }`}>
            <button 
                onClick={onBack}
                className="group relative z-10 flex items-center gap-2"
            >
                <div className={`p-2 rounded-full transition-all duration-500 ${
                    scrolled 
                        ? 'bg-transparent text-ink hover:bg-stone-100 border border-transparent' 
                        : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30'
                }`}>
                   <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className={`font-medium text-sm tracking-wide hidden md:inline transition-all duration-500 ${
                    scrolled 
                        ? 'text-ink' 
                        : 'text-white drop-shadow-md'
                }`}>
                    返回列表
                </span>
            </button>

            <div className={`absolute left-1/2 -translate-x-1/2 font-serif font-bold text-ink transition-all duration-700 transform ${
                scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
                {activity.title}
            </div>

            <button 
                onClick={handleShare}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-500 ${
                    scrolled 
                        ? 'text-stone-500 hover:text-bamboo-600 hover:bg-stone-50 border border-transparent' 
                        : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 shadow-sm'
                }`}
            >
                <Share2 size={16} />
                <span className="hidden md:inline">分享活动</span>
            </button>
        </div>
      </div>

      {/* 
          2. Hero Section (Compact)
      */}
      <div className="relative w-full h-[45vh] md:h-[50vh] overflow-hidden">
          <img 
            src={activity.image} 
            alt={activity.title} 
            className="w-full h-full object-cover object-center filter contrast-[1.05] grayscale-[0.1]"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-24 md:pb-32 max-w-5xl mx-auto left-0 right-0">
                <div className="flex flex-wrap items-center gap-3 mb-4 animate-slide-up">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border border-white/10 tracking-wider uppercase ${
                        activity.status === 'Upcoming' ? 'bg-bamboo-600/90 text-white' : 'bg-stone-800/80 text-stone-200'
                    }`}>
                        {activity.status === 'Upcoming' ? 'Upcoming · 即将开始' : 'Finished · 已结束'}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 animate-slide-up [animation-delay:100ms] drop-shadow-lg">
                    {activity.title}
                </h1>
                
                <div className="flex items-center gap-6 text-white/90 animate-slide-up [animation-delay:200ms]">
                    <span className="flex items-center gap-2 text-sm font-medium">
                        <Calendar size={14} className="text-bamboo-300"/> 
                        <span>{activity.date}</span>
                    </span>
                    {activity.location && (
                        <span className="flex items-center gap-2 text-sm font-medium">
                            <MapPin size={14} className="text-bamboo-300"/> 
                            <span>{activity.location}</span>
                        </span>
                    )}
                </div>
          </div>
      </div>

      {/* 
          3. Content Card (Seamless Overlap)
      */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 z-10">
         <div className="bg-[#fdfbf7] rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 min-h-[60vh]">
         
             {/* AI Analysis Section */}
             <div ref={aiSectionRef} className="mb-12 bg-white rounded-2xl border border-bamboo-100 shadow-xl shadow-bamboo-900/5 overflow-hidden transition-all duration-500">
                 <div className="p-6 bg-gradient-to-r from-bamboo-50/50 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bamboo-400 to-bamboo-600 flex items-center justify-center text-white shadow-md">
                             <Sparkles size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-ink text-lg">AI 智能活动助手</h3>
                             <p className="text-xs text-gray-500">快速获取活动亮点与摘要</p>
                         </div>
                     </div>
                     
                     <div className="flex gap-2">
                         <button
                            onClick={() => handleAIAnalyze(AIMode.SUMMARY)}
                            disabled={isAiLoading && aiMode !== AIMode.SUMMARY}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${aiMode === AIMode.SUMMARY 
                                    ? 'bg-bamboo-600 text-white shadow-md ring-2 ring-bamboo-200 ring-offset-1' 
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-bamboo-300 hover:text-bamboo-600'
                                }
                            `}
                         >
                            {isAiLoading && aiMode === AIMode.SUMMARY ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                            活动概述
                         </button>
                         <button
                            onClick={() => handleAIAnalyze(AIMode.KEYPOINTS)}
                            disabled={isAiLoading && aiMode !== AIMode.KEYPOINTS}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${aiMode === AIMode.KEYPOINTS 
                                    ? 'bg-bamboo-600 text-white shadow-md ring-2 ring-bamboo-200 ring-offset-1' 
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-bamboo-300 hover:text-bamboo-600'
                                }
                            `}
                         >
                             {isAiLoading && aiMode === AIMode.KEYPOINTS ? <Loader2 size={14} className="animate-spin" /> : <List size={14} />}
                            亮点总结
                         </button>
                     </div>
                 </div>

                 <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isAiExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="p-6 pt-2 bg-white">
                        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 min-h-[100px] relative">
                            <div className="absolute top-4 right-4 text-stone-200">
                                <Sparkles size={40} className="opacity-20" />
                            </div>

                            {aiResult ? (
                                <div className="prose prose-sm prose-stone font-serif text-ink/80 leading-loose animate-fade-in relative z-10">
                                    {aiResult.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-24 flex items-center justify-center text-gray-400 text-sm gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>AI 正在思考中...</span>
                                </div>
                            )}
                        </div>
                     </div>
                 </div>
             </div>

             {/* Description */}
             <div className="prose prose-lg md:prose-xl prose-stone font-serif mx-auto leading-loose text-justify text-ink/90 selection:bg-bamboo-200 selection:text-bamboo-900 pb-12 border-b border-gray-100">
                 <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-bamboo-800 first-letter:mr-3 first-letter:float-left">
                     {activity.description}
                 </p>
                 <p>
                     我们诚挚地邀请每一位热爱文学、热爱生活的同学参与其中。在这里，你不仅是观众，更是故事的创造者。
                 </p>
             </div>
             
             {/* Info Grid */}
             <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h4 className="text-center font-serif font-bold text-gray-400 text-sm tracking-widest uppercase mb-8">
                    Activity Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">时间</span>
                        <span className="font-serif text-lg font-bold text-ink">{activity.date}</span>
                    </div>
                    
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">地点</span>
                        <span className="font-serif text-lg font-bold text-ink">{activity.location || '线上活动'}</span>
                    </div>

                    <div className="flex flex-col items-center text-center group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${activity.status === 'Upcoming' ? 'bg-bamboo-50 text-bamboo-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Tag size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">状态</span>
                        <span className={`font-serif text-lg font-bold ${activity.status === 'Upcoming' ? 'text-bamboo-600' : 'text-gray-500'}`}>
                            {activity.status === 'Upcoming' ? '进行中' : '已结束'}
                        </span>
                    </div>
                </div>
             </div>

         </div>
      </div>

      {/* Copy Toast */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-ink/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all duration-300 ${showCopyToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
          <Check size={18} className="text-bamboo-400" />
          <span className="font-medium text-sm">链接已复制</span>
      </div>

      {/* Manual Share Modal */}
      {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div 
                  className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
                  onClick={() => setShowShareModal(false)}
              ></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-ink text-lg">分享活动</h3>
                      <button onClick={() => setShowShareModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                          <X size={20} />
                      </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                      自动复制失败，请手动复制下方链接分享给好友：
                  </p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 mb-4">
                      <input 
                          id="share-url-input"
                          type="text" 
                          value={window.location.href} 
                          readOnly 
                          className="bg-transparent border-none focus:ring-0 text-sm text-gray-600 flex-1 w-full"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                  </div>
                  <button 
                      onClick={handleManualCopy}
                      className="w-full py-3 bg-ink text-white rounded-xl font-medium hover:bg-bamboo-700 transition-colors flex items-center justify-center gap-2"
                  >
                      <Copy size={16} />
                      复制链接
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};
