
import React, { useState, useRef, useEffect } from 'react';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

interface Verse {
    text: string;
    keyword?: string;
    source: string;
}

const VERSES: Verse[] = [
    { text: "写作不是为了改变世界，而是为了不让世界改变我们内心的荒原。", keyword: "荒原", source: "致 每一个执笔的你" },
    { text: "且视今朝，把酒祝东风，且共从容。", keyword: "从容", source: "宋·欧阳修" },
    { text: "少年不惧岁月长，彼方尚有荣光在。", keyword: "荣光", source: "青春寄语" },
    { text: "我见青山多妩媚，料青山见我应如是。", keyword: "青山", source: "宋·辛弃疾" },
    { text: "追风赶月莫停留，平芜尽处是春山。", keyword: "春山", source: "明·田锡" },
    { text: "人生到处知何似，应似飞鸿踏雪泥。", keyword: "飞鸿", source: "宋·苏轼" },
];

export const DailyVerse: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const [slideOut, setSlideOut] = useState<'left' | 'right' | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);

  // Calculate the next index safely
  const nextIndex = (currentIndex + 1) % VERSES.length;
  const currentVerse = VERSES[currentIndex];
  const nextVerse = VERSES[nextIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // --- Touch / Mouse Events for Swipe Logic ---

  const handleStart = (clientX: number, clientY: number) => {
      setDragStart({ x: clientX, y: clientY });
      setIsDragging(true);
      setSlideOut(null);
  };

  const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging || !dragStart) return;
      const dx = clientX - dragStart.x;
      const dy = clientY - dragStart.y;
      
      // Scroll Lock Check:
      // If vertical movement is significantly larger than horizontal, assume user wants to scroll page.
      // In this case, do NOT move the card.
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
          // Do nothing to offset, let browser scroll
          return; 
      }

      // Only update X offset, Force Y to 0 to prevent vertical dragging of the card
      setOffset({ x: dx, y: 0 });
  };

  const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);

      const threshold = 60; // Lowered threshold from 100 to 60 for easier swipe
      
      if (Math.abs(offset.x) > threshold) {
          triggerSwipe(offset.x > 0 ? 'right' : 'left');
      } else {
          // Snap back
          setOffset({ x: 0, y: 0 });
          setDragStart(null);
      }
  };

  const triggerSwipe = (direction: 'left' | 'right') => {
      setSlideOut(direction);
      // Swipe out distance
      setOffset({ x: direction === 'right' ? 800 : -800, y: 0 });
      
      // Wait for animation then reset
      setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % VERSES.length);
          setOffset({ x: 0, y: 0 });
          setSlideOut(null);
          setDragStart(null);
      }, 400);
  };

  // Rotation calculation based on X offset
  const rotation = offset.x * 0.05;
  
  // Background card animation: Scales up as foreground card moves away
  const absOffset = Math.abs(offset.x);
  const progress = Math.min(absOffset / 300, 1); // Easier scaling progress
  const backScale = 0.9 + (0.1 * progress); // 0.9 -> 1.0
  const backOpacity = 0.6 + (0.4 * progress); // 0.6 -> 1.0
  const backY = 12 - (12 * progress); // Reduced offset 12px -> 0px

  return (
    <section ref={sectionRef} className="py-24 bg-[#fdfbf7] relative overflow-hidden reveal-on-scroll select-none">
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-serif font-bold text-ink">草竹清音</h2>
        </div>

        <div className="relative w-full flex items-center justify-center">
            
            {/* Left Control */}
            <button 
                onClick={() => triggerSwipe('left')}
                className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-ink z-20 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Card Stack Container - Reduced Size */}
            <div className="relative w-full max-w-md h-[360px] md:h-[380px] flex items-center justify-center perspective-1000">
                
                {/* 1. The "Next" Card (Background) */}
                <div 
                    className="absolute inset-0 bg-white rounded-3xl border border-stone-100 shadow-lg flex flex-col items-center justify-center p-8 text-center z-0 origin-center transition-transform duration-100 ease-out"
                    style={{
                        transform: `scale(${backScale}) translateY(${backY}px)`,
                        opacity: backOpacity
                    }}
                >
                    <div className="text-[100px] font-serif font-black text-stone-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                        {nextVerse.keyword?.charAt(0)}
                    </div>
                    <p className="font-serif text-lg text-ink/50 relative z-10 line-clamp-3">
                        {nextVerse.text}
                    </p>
                </div>

                {/* 2. The "Current" Card (Foreground) - Draggable */}
                <div 
                    className="absolute inset-0 bg-white rounded-3xl border border-stone-200 shadow-2xl shadow-stone-200/50 flex flex-col items-center justify-center p-8 md:p-12 text-center cursor-grab active:cursor-grabbing z-10 touch-pan-y"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        opacity: 1 // Always visible until replaced
                    }}
                    onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                    onMouseMove={(e) => handleStart && handleMove(e.clientX, e.clientY)} // Safety check
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchEnd={handleEnd}
                >
                    {/* Keyword Watermark - Smaller */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[150px] font-serif font-black text-stone-50 select-none pointer-events-none">
                        {currentVerse.keyword?.charAt(0)}
                    </div>

                    <div className="absolute top-6 left-6 text-bamboo-200">
                        <Quote size={32} className="transform scale-x-[-1]" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 pointer-events-none">
                        <p className="text-xl md:text-2xl font-serif leading-normal text-ink font-medium mb-8">
                            {currentVerse.text}
                        </p>
                        
                        <div className="inline-flex items-center gap-4">
                            <div className="h-[1px] w-6 bg-bamboo-300"></div>
                            <p className="text-sm text-gray-500 font-serif italic tracking-widest">{currentVerse.source}</p>
                            <div className="h-[1px] w-6 bg-bamboo-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Control */}
            <button 
                onClick={() => triggerSwipe('right')}
                className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-ink z-20 group"
            >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Guidance Text */}
        <div className="mt-8 flex items-center gap-4 opacity-40 animate-pulse-slow">
            <ArrowLeft size={12} />
            <span className="text-[10px] font-serif tracking-[0.2em] uppercase">左右滑动切换 · Swipe</span>
            <ArrowRight size={12} />
        </div>

      </div>
    </section>
  );
};
