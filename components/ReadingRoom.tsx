
import React, { useEffect, useState } from 'react';
import { LiteraryWork } from '../types';
import { ArrowLeft, Clock, User, Quote, ArrowUp, Share2, ArrowRight, Check, Tag } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface ReadingRoomProps {
  work: LiteraryWork;
  onBack: () => void;
  onViewMore?: () => void;
}

export const ReadingRoom: React.FC<ReadingRoomProps> = ({ work, onBack, onViewMore }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
       const isScrolled = window.scrollY > 30;
       setScrolled(isScrolled);
       // Show back to top button when scrolled down a bit more
       setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
      const title = `推荐阅读：${work.title} - ${work.author}`;
      const url = window.location.href;
      const shareData = {
          title: '草竹文学社',
          text: title,
          url: url
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
              return;
          } catch (err) {
              console.log('Native share dismissed');
          }
      }

      const textToCopy = `${title} ${url}`;
      let success = false;

      if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
              await navigator.clipboard.writeText(textToCopy);
              success = true;
          } catch (err) {
              console.error('Clipboard API failed', err);
          }
      }

      if (!success) {
          // Fallback
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
              document.execCommand('copy');
              success = true;
          } catch (err) {}
          document.body.removeChild(textArea);
      }

      if (success) {
          setShowCopyToast(true);
          setTimeout(() => setShowCopyToast(false), 2000);
      } else {
          alert('浏览器不支持自动复制，请手动复制地址栏链接分享。');
      }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative animate-fade-in pb-20">
      
      {/* 
          1. Dynamic Navbar
      */}
      <div className="fixed top-0 left-0 right-0 z-50">
        
        {/* Layer 1: Blur Background */}
        <div 
            className={`absolute inset-0 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-stone-200/50 transition-opacity duration-700 ease-out ${
                scrolled ? 'opacity-100' : 'opacity-0'
            }`} 
        />
        
        {/* Layer 2: Gradient for Text Visibility (Fades out) */}
        <div 
            className={`absolute inset-0 bg-gradient-to-b from-black/40 to-transparent transition-opacity duration-700 ease-out ${
                scrolled ? 'opacity-0' : 'opacity-100'
            }`}
        />

        {/* Layer 3: Content */}
        <div className={`relative max-w-5xl w-full mx-auto px-6 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            scrolled ? 'py-3' : 'py-6'
        }`}>
            {/* Left: Back Button */}
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
                    返回首页
                </span>
            </button>

            {/* Center: Truncated Title (Slides in on scroll) */}
            <div className={`absolute left-1/2 -translate-x-1/2 font-serif font-bold text-ink transition-all duration-700 transform ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="text-center max-w-[200px] truncate text-sm">
                    {work.title}
                </div>
            </div>

            {/* Right: Share */}
            <div className="flex items-center gap-4 relative z-10">
                <button 
                    onClick={handleShare} 
                    className={`p-2 rounded-full transition-all duration-500 ${
                         scrolled 
                         ? 'text-stone-500 hover:text-ink hover:bg-stone-100 border border-transparent' 
                         : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 shadow-sm'
                    }`}
                >
                    <Share2 size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* 
          2. Hero Section (Compact & Immersive)
      */}
      <div className="relative w-full h-[45vh] md:h-[50vh] overflow-hidden bg-stone-200">
          {work.imageUrl ? (
            <img 
                src={work.imageUrl} 
                alt={work.title} 
                className="w-full h-full object-cover object-center animate-fade-in filter contrast-[1.05] grayscale-[0.1]"
            />
          ) : (
            // Elegant Fallback Pattern
            <div className="w-full h-full bg-[#e7e5e4] flex items-center justify-center opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <Quote size={48} className="text-stone-400 opacity-50" />
            </div>
          )}

          {/* Gradient Overlay for Text Readability - Stronger at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
          
          {/* Content Positioned at Bottom */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-24 md:pb-32 max-w-4xl mx-auto left-0 right-0">
                <div className="flex items-center gap-3 mb-4 animate-slide-up">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border border-white/20 bg-white/20 text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <Tag size={10} />
                        {work.category}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 animate-slide-up [animation-delay:100ms] drop-shadow-lg">
                    {work.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90 animate-slide-up [animation-delay:200ms]">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User size={14} className="text-bamboo-300"/> 
                        <span className="tracking-wide">{work.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                        <Clock size={14} className="text-bamboo-300"/> 
                        <span className="font-mono">{work.date}</span>
                    </div>
                </div>
          </div>
      </div>

      {/* Floating Actions Group */}
      <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-50 flex flex-col items-center gap-4 pointer-events-none">
          <button
            onClick={scrollToTop}
            className={`pointer-events-auto p-3 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 text-stone-500 shadow-lg hover:bg-bamboo-600 hover:text-white hover:border-bamboo-600 transition-all duration-500 transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 scale-50'}`}
            aria-label="回到顶部"
          >
             <ArrowUp size={20} />
          </button>

          <div className="pointer-events-auto">
            <AIAssistant 
                content={work.fullText || work.excerpt} 
                contextLabel="文章" 
                direction="up"
                minimal={scrolled} 
            />
          </div>
      </div>

      {/* Copy Toast Notification */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-ink/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all duration-300 ${showCopyToast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
          <Check size={18} className="text-bamboo-400" />
          <span className="font-medium text-sm">链接已复制</span>
      </div>

      {/* 
          3. Content Body (Seamless Card Layout)
      */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 z-10">
         {/* The Solid Card Container - Fixes Seams */}
         <div className="bg-[#fdfbf7] rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-8 md:p-16 min-h-[60vh]">
            
            <article className="prose prose-lg md:prose-xl prose-stone font-serif mx-auto leading-loose text-justify text-ink/90 selection:bg-bamboo-200 selection:text-bamboo-900">
                {work.fullText ? (
                    work.fullText.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="indent-8 mb-6 first-of-type:first-letter:text-5xl first-of-type:first-letter:font-bold first-of-type:first-letter:text-ink first-of-type:first-letter:mr-3 first-of-type:first-letter:float-left">
                            {paragraph}
                        </p>
                    ))
                ) : (
                    <div className="opacity-60 py-10">
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

            {/* Elegant Footer Actions */}
            <div className="pt-10 mt-10 border-t border-stone-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-stone-500 hover:text-bamboo-600 transition-colors group px-4 py-2 rounded-lg hover:bg-bamboo-50/50"
                >
                    <div className="p-2 bg-white border border-stone-200 rounded-full shadow-sm text-stone-400 group-hover:text-bamboo-600 group-hover:border-bamboo-200 transition-all">
                        <Share2 size={16} />
                    </div>
                    <span className="font-serif text-sm font-medium">分享此文</span>
                </button>

                <div className="hidden md:block flex-1 h-[1px] bg-stone-100 mx-8"></div>

                {onViewMore && (
                    <button 
                        onClick={onViewMore}
                        className="group flex items-center gap-2 font-serif text-ink hover:text-bamboo-700 transition-colors"
                    >
                        <span className="text-lg font-bold">阅览更多佳作</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-bamboo-500" />
                    </button>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
