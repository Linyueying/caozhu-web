import React, { useEffect, useRef, useState } from 'react';

// Component to handle the scroll-driven highlight effect (Sentence by Sentence)
const HighlightText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const segments = React.useMemo(() => {
    // Splits by Chinese OR English punctuation
    const parts = text.match(/[^，。！？；\n\.\?\!]+[，。！？；\n\.\?\!]?/g);
    return parts || [text];
  }, [text]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementTop = rect.top;     
      const offset = windowHeight * 0.75; 
      
      const scrolledPast = offset - elementTop;
      const progress = Math.max(0, Math.min(1, scrolledPast / (rect.height * 1.0)));
      
      const activeCount = Math.floor(progress * segments.length);
      
      const newActiveIndices = Array.from({ length: activeCount }, (_, i) => i);
      setActiveIndices(newActiveIndices);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [segments.length]);

  return (
    <p ref={containerRef} className="text-lg md:text-xl leading-loose font-serif mb-8 transition-colors duration-300 relative z-10">
      {segments.map((segment, index) => {
        const isActive = activeIndices.includes(index);
        return (
          <span 
            key={index} 
            className={`transition-all duration-1000 ease-out inline-block mr-1
              ${isActive 
                ? 'text-ink opacity-100 blur-none scale-100' 
                : 'text-gray-400 opacity-30 blur-[0.5px] scale-[0.99]'
              }
            `}
          >
            {segment}
          </span>
        );
      })}
    </p>
  );
};

export const About: React.FC = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-mist via-white to-mist relative overflow-hidden">
      
      {/* Decorative Background Watermark */}
      <div className="absolute top-20 right-[-5%] text-[180px] md:text-[350px] font-bold text-bamboo-50 pointer-events-none select-none leading-none z-0 font-serif opacity-60 mix-blend-multiply">
        1993
      </div>
      
      {/* Bamboo Silhouette Decoration */}
      <svg className="absolute bottom-0 left-[-50px] w-[300px] h-[400px] opacity-5 pointer-events-none z-0 text-bamboo-900" viewBox="0 0 100 200" preserveAspectRatio="none">
         <path d="M40,200 C45,150 35,100 42,0 M42,200 C48,140 38,80 45,10" stroke="currentColor" strokeWidth="2" fill="none" />
         <path d="M60,200 C65,160 55,110 62,20 M62,200 C68,150 58,90 65,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left: Composed Image & Info Card (Spans 5 cols) */}
          <div className="md:col-span-5 relative flex justify-center md:block">
             {/* Composition Container */}
             <div className="relative mt-8 md:mt-0 md:ml-8 w-64 md:w-72">
                
                {/* Layer 1: The "Polaroid" Image */}
                <div className="relative z-0 transform -rotate-6 transition-transform duration-700 hover:rotate-0 group">
                    <div className="bg-white p-3 pb-10 rounded shadow-2xl shadow-stone-300/50 border border-stone-100">
                        <div className="aspect-[3/4] overflow-hidden bg-stone-200 relative filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700">
                             <img 
                                src="https://picsum.photos/id/24/800/1000" 
                                alt="社团历史" 
                                className="w-full h-full object-cover"
                            />
                             {/* Texture Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 to-transparent pointer-events-none"></div>
                             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none"></div>
                        </div>
                        <div className="absolute bottom-3 right-4 font-handwriting text-gray-400 text-xs opacity-60 font-serif italic">
                             Since 1993
                        </div>
                    </div>
                </div>

                {/* Layer 2: Floating Info Card (The "Name Card") */}
                <div className="absolute -bottom-10 -right-10 md:-right-16 z-10 bg-white/90 backdrop-blur-xl p-6 rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-white/60 w-64 animate-slide-up hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                        <div>
                            <h3 className="font-serif font-bold text-lg text-ink leading-none mb-1">草竹</h3>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Literary Society</p>
                        </div>
                        <div className="w-10 h-10 bg-bamboo-50 rounded-full flex items-center justify-center text-bamboo-700 font-serif font-bold text-lg border border-bamboo-100">
                            文
                        </div>
                    </div>
                    
                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-stone-50 rounded-lg">
                            <p className="text-xl font-bold text-ink font-serif leading-none mb-1">500<span className="text-bamboo-500 text-base">+</span></p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wide">Works</p>
                        </div>
                         <div className="text-center p-2 bg-stone-50 rounded-lg">
                            <p className="text-xl font-bold text-ink font-serif leading-none mb-1">200<span className="text-bamboo-500 text-base">+</span></p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wide">Members</p>
                        </div>
                    </div>
                </div>

             </div>
          </div>
          
          {/* Right: Content (Spans 7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-center pt-12 md:pl-16">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full border border-bamboo-300 text-[10px] text-bamboo-600 font-bold">01</span>
                     <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">About Us</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
                  草色入帘青<br/>
                  <span className="text-bamboo-600/60 font-light italic">竹阴</span> 覆书案
                </h2>
            </div>
            
            {/* Scroll Text Area */}
            <div className="pl-0 md:pl-6 border-l-0 md:border-l border-gray-100 relative">
              <HighlightText text="浦城一中草竹文学社，取意“草根之韧”与“竹之气节”。我们扎根于校园这片沃土，致力于为全校文学爱好者搭建一个自由交流、展示才华的灵感空间。" />
              <div className="h-6"></div>
              <HighlightText text="在这里，我们不仅关注文学创作，更注重人文精神的培养。通过举办征文比赛、诗歌朗诵会、名家讲座以及采风活动，让同学们在繁忙的学业之余，保持对生活的热爱与敏锐。" />
            </div>

            {/* Button / Signature area could go here, but keeping it clean as requested */}
          </div>
        </div>
      </div>
    </section>
  );
};