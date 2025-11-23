
import React, { useState, useRef } from 'react';
import { View, LiteraryWork, Activity } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Showcase } from './components/Showcase';
import { WorksGallery } from './components/WorksGallery';
import { ActivityTimeline } from './components/ActivityTimeline';
import { ActivityDetail } from './components/ActivityDetail';
import { InkCursor } from './components/InkCursor';
import { DailyVerse } from './components/DailyVerse';
import { ReadingRoom } from './components/ReadingRoom';
import { Users, ArrowUpRight, X, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [readingWork, setReadingWork] = useState<LiteraryWork | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Ref to store the scroll position of the main feed
  const scrollPositionRef = useRef<number>(0);

  const handleReadWork = (work: LiteraryWork) => {
      scrollPositionRef.current = window.scrollY;
      setReadingWork(work);
      setCurrentView(View.READING);
  };

  const handleViewActivity = (activity: Activity) => {
      scrollPositionRef.current = window.scrollY;
      setSelectedActivity(activity);
      setCurrentView(View.ACTIVITY_DETAIL);
  };

  const handleBackToHome = () => {
      setCurrentView(View.HOME);
      setTimeout(() => {
          window.scrollTo({
              top: scrollPositionRef.current,
              behavior: 'auto'
          });
      }, 0);
  };

  const handleViewMoreWorks = () => {
    setCurrentView(View.WORKS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentView) {
      case View.READING:
        return readingWork ? (
            <ReadingRoom 
                work={readingWork} 
                onBack={handleBackToHome}
                onViewMore={handleViewMoreWorks} 
            />
        ) : (
            <div className="pt-20 text-center">文章加载错误</div>
        );
      case View.ACTIVITY_DETAIL:
        return selectedActivity ? (
            <ActivityDetail
                activity={selectedActivity}
                onBack={handleBackToHome}
            />
        ) : (
             <div className="pt-20 text-center">活动加载错误</div>
        );
      case View.WORKS:
        return (
          <div className="min-h-screen bg-mist">
            <WorksGallery onRead={handleReadWork} />
          </div>
        );
      case View.ACTIVITIES:
        return (
          <div className="pt-20 min-h-screen bg-mist">
            <ActivityTimeline onViewActivity={handleViewActivity} />
          </div>
        );
      case View.HOME:
      default:
        return (
          <>
            <Hero onNavigate={setCurrentView} onJoin={() => setIsJoinModalOpen(true)} />
            <About />
            <DailyVerse />
            <Showcase onRead={handleReadWork} onViewMore={handleViewMoreWorks} />
            <ActivityTimeline onViewActivity={handleViewActivity} />
            
            {/* Bottom Join Section */}
            <section id="join-us" className="py-24 bg-gradient-to-b from-white to-bamboo-50/30 relative overflow-hidden border-t border-gray-100">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bamboo-100/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-white border border-gray-100 shadow-sm rounded-full text-bamboo-700 mb-8">
                    <Users size={24} />
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink mb-6 tracking-tight">
                    加入草竹，<span className="text-bamboo-700">共绘</span>青春
                </h2>
                
                <p className="text-lg text-gray-500 mb-12 font-serif leading-relaxed max-w-2xl mx-auto">
                    无论是执笔成文的创作者，还是热爱阅读的倾听者。<br/>
                    这里有一群志同道合的伙伴，在这个喧嚣的时代，为你留一张安静的书桌。
                </p>
                
                <button 
                    onClick={() => setIsJoinModalOpen(true)}
                    className="group inline-flex items-center gap-3 px-10 py-4 bg-ink text-white rounded-full text-lg font-medium shadow-xl shadow-bamboo-900/10 hover:shadow-2xl hover:bg-bamboo-800 transition-all duration-500 transform hover:-translate-y-1"
                >
                    <span>加入官方交流群</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-mist text-ink font-sans selection:bg-bamboo-200 selection:text-bamboo-900 flex flex-col relative">
      <InkCursor />
      
      {/* Hide Navigation when reading for immersion */}
      {currentView !== View.READING && currentView !== View.ACTIVITY_DETAIL && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}

      <main className="flex-grow">
        {renderContent()}
      </main>
      
      {/* Footer - Only show on non-reading views */}
      {currentView !== View.READING && currentView !== View.ACTIVITY_DETAIL && (
        <footer className="bg-white py-8 border-t border-gray-100 relative z-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-ink">草竹</span>
                <span className="text-[10px] text-gray-300">•</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Since 1993</span>
            </div>

            <div className="text-[10px] text-gray-400 font-sans">
                Pucheng No.1 High School
            </div>
            </div>
        </footer>
      )}

      {/* Join Us Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsJoinModalOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10 max-w-md w-full animate-slide-up overflow-hidden">
                {/* Close Button */}
                <button 
                    onClick={() => setIsJoinModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bamboo-300 via-bamboo-500 to-bamboo-300"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-bamboo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-bamboo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-bamboo-600 shadow-inner">
                        <MessageCircle size={32} />
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-ink mb-4">
                        入社邀请
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                        <p className="text-gray-600 font-serif leading-relaxed">
                            "一支笔，甚至比剑更锋利。"
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            在草竹，我们相信文字的力量。<br/>
                            无论你是热衷于指尖流淌的诗意，<br/>
                            还是偏爱翻阅书页的静谧，<br/>
                            这里都有你的席位。
                        </p>
                    </div>

                    <a 
                        href="https://qun.qq.com/universal-share/share?ac=1&authKey=zIdE6%2BoAD53YrgeS7waSk%2B94dTSvsPtuW3z5Jtm0TlNxvEpoqKDYUzTtCibxcaDh&busi_data=eyJncm91cENvZGUiOiI4NjE3MDc3NzgiLCJ0b2tlbiI6Imd6Rkg5M1h6OTA1VTZWWUNqL1I2MCthcEVSd0NKUkFSNUZrNkY3WG9ybCthNkJwWEk0THJBaE5qaTY5VUM4NEUiLCJ1aW4iOiIzMjkwNzIxMzUyIn0%3D&data=GglIrJd226rpluQTILmbwtCzxC8FUfCpazqt-jMg-vbjKJKmKPUAcVcJgyR7kUZSxidRFAlmOqYd3cfRFUcDCw&svctype=4&tempid=h5_group_info" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-ink hover:bg-bamboo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <span className="font-sans">加入官方 QQ 群</span>
                        <ArrowUpRight size={16} />
                    </a>
                    <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-wider">
                        Group ID: 861707778
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
