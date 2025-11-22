
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { BookOpen, Feather, Calendar, Menu, X, Users } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Added pseudo-view 'JOIN' for logic, mapped to null or handled separately
  const navItems = [
    { view: View.HOME, label: '首页', icon: BookOpen },
    { view: View.WORKS, label: '佳作', icon: Feather },
    { view: View.ACTIVITIES, label: '动态', icon: Calendar },
    { view: 'JOIN', label: '加入我们', icon: Users },
  ];

  const handleNavClick = (view: View | 'JOIN') => {
    if (view === 'JOIN') {
      // If scrolling to join, close menu and scroll
      setIsMobileMenuOpen(false);
      const joinSection = document.getElementById('join-us');
      if (joinSection) {
        joinSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onChangeView(view as View);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6 pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-500 ease-out
          ${isScrolled || isMobileMenuOpen 
            ? 'bg-white/70 backdrop-blur-xl shadow-lg shadow-bamboo-900/5 border border-white/40 w-full max-w-xl rounded-full py-3' 
            : 'bg-transparent w-full max-w-5xl py-4'
          } px-6 flex justify-between items-center
        `}
      >
        <div 
            className="cursor-pointer group" 
            onClick={() => handleNavClick(View.HOME)}
        >
            <span className={`font-serif font-bold text-lg tracking-tight transition-colors ${isScrolled ? 'text-ink' : 'text-ink'}`}>
              草竹<span className="text-bamboo-500">.</span>
            </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view as View | 'JOIN')}
                className={`text-sm font-medium transition-colors hover:text-bamboo-600 ${(item.view as any) === currentView ? 'text-bamboo-600 font-bold' : 'text-gray-500'}`}
              >
                {item.label}
              </button>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden pointer-events-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-800"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full mt-4 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col space-y-2 animate-slide-up origin-top">
               {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view as View | 'JOIN')}
                  className="text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-600 flex items-center gap-2"
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
          </div>
        )}
      </nav>
    </div>
  );
};
