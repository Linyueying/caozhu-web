
import React, { useEffect } from 'react';
import { FEATURED_WORKS } from '../constants';
import { LiteraryWork } from '../types';
import { ArrowUpRight, Clock, User } from 'lucide-react';

interface WorksGalleryProps {
  onRead: (work: LiteraryWork) => void;
}

export const WorksGallery: React.FC<WorksGalleryProps> = ({ onRead }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-mist py-24 px-6 md:px-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-4">
                佳作画廊
            </h2>
            <p className="text-gray-500 font-serif text-lg">
                收录浦城一中草竹文学社历年优秀作品
            </p>
        </div>

        {/* Vertical Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_WORKS.map((work, index) => (
                <div 
                    key={work.id}
                    onClick={() => onRead(work)}
                    className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Image Aspect Ratio 4:3 for Grid */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                        <img 
                            src={work.imageUrl} 
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm z-10">
                            {work.category}
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-8 flex flex-col flex-grow relative">
                        {/* Floating Action Button on Card Hover */}
                        <div className="absolute -top-6 right-8 w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-spring">
                            <ArrowUpRight size={20} />
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-ink mb-3 group-hover:text-bamboo-700 transition-colors">
                            {work.title}
                        </h3>
                        
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-serif flex-grow">
                            {work.excerpt}
                        </p>

                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                             <div className="flex items-center gap-2">
                                <User size={14} />
                                <span>{work.author}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{work.date}</span>
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* End Marker */}
        <div className="mt-20 text-center opacity-40">
            <div className="w-1 h-12 bg-gray-300 mx-auto mb-4"></div>
            <span className="font-serif text-sm text-gray-400 tracking-widest">THE END</span>
        </div>

      </div>
    </div>
  );
};
