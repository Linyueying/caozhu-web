
import React, { useState, useEffect } from 'react';
import { ACTIVITIES } from '../constants';
import { Activity } from '../types';
import { Calendar, ArrowRight, X, MapPin } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

export const ActivityTimeline: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedActivity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedActivity]);

  return (
    <section className="py-24 bg-[#fcfcfc] relative">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16 border-b border-gray-200 pb-6">
           <div>
             <h2 className="text-4xl font-serif font-bold text-ink mb-2">社团动态</h2>
             <p className="text-gray-400 text-sm font-serif tracking-widest">EVENTS & NEWS</p>
           </div>
           <div className="hidden md:block text-right">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Current Year</div>
              <div className="text-xl font-bold text-ink font-serif">2025</div>
           </div>
        </div>

        {/* Magazine Style Layout */}
        <div className="space-y-12">
          {ACTIVITIES.map((activity, index) => {
            const [year, month] = activity.date.split('.'); // Expects 'YYYY.MM'
            
            return (
            <div key={activity.id} className="reveal group cursor-pointer" onClick={() => setSelectedActivity(activity)}>
                <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
                    
                    {/* Left: Date Badge (Stylish) */}
                    <div className="hidden md:flex flex-col items-center justify-start pt-4 min-w-[80px] border-r border-gray-100 pr-8">
                        <span className="text-4xl font-serif font-bold text-ink/20 group-hover:text-bamboo-600 transition-colors duration-500">{month}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">月 / {year}</span>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group-hover:border-bamboo-100">
                         <div className="grid md:grid-cols-2 gap-0 h-full">
                             
                             {/* Image Side */}
                             <div className="h-48 md:h-full overflow-hidden relative">
                                <img 
                                    src={activity.image} 
                                    alt={activity.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                
                                {/* Mobile Date Badge */}
                                <div className="md:hidden absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center text-ink">
                                    {activity.date}
                                </div>
                             </div>

                             {/* Text Side */}
                             <div className="p-8 flex flex-col justify-between relative">
                                 <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            activity.status === 'Upcoming' 
                                            ? 'bg-bamboo-50 text-bamboo-700 border-bamboo-100' 
                                            : 'bg-gray-50 text-gray-500 border-gray-100'
                                        }`}>
                                            {activity.status === 'Upcoming' ? 'Upcoming · 即将开始' : 'Past · 已结束'}
                                        </span>
                                        {activity.location && (
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <MapPin size={10} /> {activity.location}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-2xl font-serif font-bold text-ink mb-3 leading-snug group-hover:text-bamboo-700 transition-colors">
                                        {activity.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-serif">
                                        {activity.description}
                                    </p>
                                 </div>

                                 <div className="mt-6 pt-6 border-t border-gray-50 flex items-center text-xs font-bold text-ink group-hover:text-bamboo-600 transition-colors">
                                     了解更多 <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                 </div>
                                 
                                 {/* Decorative Number */}
                                 <div className="absolute bottom-4 right-6 text-6xl font-serif font-bold text-gray-50 -z-0 select-none pointer-events-none">
                                     0{index + 1}
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
          )})}
        </div>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center bg-ink/60 backdrop-blur-md animate-fade-in p-4 overflow-hidden">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-slide-up rounded-2xl">
                
                {/* Modal Header Image */}
                <div className="relative h-48 md:h-64 shrink-0">
                    <img src={selectedActivity.image} alt={selectedActivity.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button 
                        onClick={() => setSelectedActivity(null)} 
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-6 text-white">
                         <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-90">
                             <span className={`px-2 py-0.5 rounded text-xs ${
                                 selectedActivity.status === 'Upcoming' ? 'bg-bamboo-600' : 'bg-gray-600'
                             }`}>{selectedActivity.status === 'Upcoming' ? '即将开始' : '已结束'}</span>
                             <span className="flex items-center gap-1"><Calendar size={14}/> {selectedActivity.date}</span>
                         </div>
                         <h2 className="text-2xl md:text-3xl font-serif font-bold">{selectedActivity.title}</h2>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                    
                    {/* AI Assistant Button - Sticky Top Right */}
                    <div className="sticky top-0 right-0 z-20 flex justify-end pointer-events-none">
                       <div className="pointer-events-auto">
                         <AIAssistant 
                            content={`活动名称：${selectedActivity.title}\n时间：${selectedActivity.date}\n地点：${selectedActivity.location}\n简介：${selectedActivity.description}`} 
                            contextLabel="活动"
                            direction="down"
                          />
                       </div>
                    </div>

                    <div className="prose prose-stone max-w-none font-serif mt-4 pb-20">
                        <p className="lead text-lg text-gray-600">{selectedActivity.description}</p>
                        
                        {selectedActivity.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 my-6 not-prose p-4 bg-bamboo-50/50 rounded-lg border border-bamboo-100/50">
                                <MapPin size={18} className="text-bamboo-600 shrink-0"/>
                                <span><span className="font-bold">活动地点：</span>{selectedActivity.location}</span>
                            </div>
                        )}

                        <div className="text-sm text-gray-400 italic mt-8 border-t border-gray-100 pt-4">
                            更多活动细节请关注社团官方QQ群通知或咨询社团负责人。
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};
