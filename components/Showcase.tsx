import React, { useRef, useEffect } from 'react';
import { FEATURED_WORKS } from '../constants';
import { LiteraryWork } from '../types';
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';

interface ShowcaseProps {
  onRead: (work: LiteraryWork) => void;
  onViewMore?: () => void;
}

export const Showcase: React.FC<ShowcaseProps> = ({ onRead, onViewMore }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-mist reveal-on-scroll border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        <div className="px-6 md:px-12 flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">佳作画廊</h2>
                <p className="text-gray-500 text-sm tracking-wide">左右滑动，翻阅少年的奇思妙想</p>
            </div>
            <button 
                onClick={scrollRight}
                className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:bg-bamboo-50 hover:border-bamboo-200 transition-colors text-ink"
                aria-label="Scroll Right"
            >
                <ArrowRight size={20} />
            </button>
        </div>

        {/* Horizontal Gallery Container */}
        <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-12 px-6 md:px-12 snap-x snap-mandatory hide-scrollbar"
        >
          {FEATURED_WORKS.map((work) => (
            <div 
              key={work.id}
              className="snap-center shrink-0 w-[85vw] md:w-[450px] group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 bg-white"
              onClick={() => onRead(work)}
            >
              {/* Image Section */}
              <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={work.imageUrl} 
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.1] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                    {work.category}
                  </div>

                  {/* Call to Action Arrow (Visual Cue) */}
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform transition-all duration-300 group-hover:bg-white group-hover:text-ink group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                  </div>
              </div>

              {/* Content Card */}
              <div className="p-8 relative">
                 <h3 className="text-2xl font-serif font-bold text-ink mb-3 group-hover:text-bamboo-700 transition-colors">{work.title}</h3>
                 <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-serif italic opacity-80">
                   "{work.excerpt}"
                 </p>
                 
                 <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bamboo-50 flex items-center justify-center text-xs font-bold text-bamboo-700 border border-bamboo-100">
                            {work.author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{work.author}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono tracking-tight">{work.date}</span>
                 </div>
              </div>
            </div>
          ))}
          
          {/* Placeholder for 'More' */}
          <div 
            onClick={onViewMore}
            className="snap-center shrink-0 w-[200px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 hover:border-bamboo-300 hover:text-bamboo-600 transition-colors cursor-pointer bg-white/50 hover:bg-white/80"
          >
             <span className="text-sm font-bold mb-2">查看更多</span>
             <span className="text-xs opacity-50">View All Works</span>
          </div>
        </div>
      </div>
    </section>
  );
};