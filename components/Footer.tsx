import React from 'react';
import { View } from '../types';
import { Mail, MessageCircle, ArrowUp, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-100 pt-20 pb-10 relative z-10 overflow-hidden font-sans">
        
        {/* Background Decor: Giant Watermark */}
        <div className="absolute -top-10 -right-10 pointer-events-none select-none opacity-[0.03]">
             <span className="font-serif text-[200px] leading-none text-ink font-bold">竹</span>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-20">
                
                {/* Brand Column (5 cols) */}
                <div className="md:col-span-5 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center text-white font-serif font-bold">
                                竹
                            </div>
                            <h3 className="font-serif font-bold text-xl text-ink">草竹文学社</h3>
                        </div>
                        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-medium">Caozhu Literary Society</p>
                    </div>
                    
                    <p className="text-gray-500 font-serif leading-loose text-sm max-w-sm">
                        “草色入帘青，竹风醒墨。” <br/>
                        成立于 1993 年，福建省浦城第一中学历史悠久的学生社团。我们以文会友，在文字的土壤里耕耘青春的梦想。
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <a 
                            href="https://qun.qq.com/universal-share/share?ac=1&authKey=zIdE6%2BoAD53YrgeS7waSk%2B94dTSvsPtuW3z5Jtm0TlNxvEpoqKDYUzTtCibxcaDh&busi_data=eyJncm91cENvZGUiOiI4NjE3MDc3NzgiLCJ0b2tlbiI6Imd6Rkg5M1h6OTA1VTZWWUNqL1I2MCthcEVSd0NKUkFSNUZrNkY3WG9ybCthNkJwWEk0THJBaE5qaTY5VUM4NEUiLCJ1aW4iOiIzMjkwNzIxMzUyIn0%3D&data=GglIrJd226rpluQTILmbwtCzxC8FUfCpazqt-jMg-vbjKJKmKPUAcVcJgyR7kUZSxidRFAlmOqYd3cfRFUcDCw&svctype=4&tempid=h5_group_info" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100 transition-all duration-300"
                            title="加入 QQ 群"
                        >
                            <MessageCircle size={18} />
                        </a>
                        <a 
                            href="mailto:contact@caozhu.com" 
                            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100 transition-all duration-300"
                            title="发送邮件"
                        >
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:col-span-1"></div>

                {/* Links Column 1: Site Map */}
                <div className="md:col-span-3">
                    <h4 className="font-bold text-ink mb-6 text-sm tracking-wide">网站导航</h4>
                    <ul className="space-y-4 text-sm text-gray-500 font-medium">
                        <li>
                            <button onClick={() => onNavigate(View.HOME)} className="hover:text-bamboo-600 transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-bamboo-500 transition-colors"></span>
                                首页
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate(View.WORKS)} className="hover:text-bamboo-600 transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-bamboo-500 transition-colors"></span>
                                佳作画廊
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onNavigate(View.ACTIVITIES)} className="hover:text-bamboo-600 transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-bamboo-500 transition-colors"></span>
                                社团动态
                            </button>
                        </li>
                        <li>
                             <button onClick={() => {
                                 const joinSection = document.getElementById('join-us');
                                 if (joinSection) joinSection.scrollIntoView({ behavior: 'smooth' });
                             }} className="hover:text-bamboo-600 transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-bamboo-500 transition-colors"></span>
                                加入我们
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Links Column 2: Friends & Info */}
                <div className="md:col-span-3">
                    <h4 className="font-bold text-ink mb-6 text-sm tracking-wide">相关链接</h4>
                    <ul className="space-y-4 text-sm text-gray-500 font-medium">
                        <li>
                            <a href="https://www.pc1z.com/" target="_blank" rel="noreferrer" className="hover:text-bamboo-600 transition-colors flex items-center gap-2 group">
                                浦城一中官网
                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                        <li className="pt-2">
                             <div className="text-xs text-gray-400 mb-2 font-serif italic">Powered by</div>
                             <div className="flex items-center gap-2 text-ink/80">
                                <Sparkles size={14} className="text-bamboo-500"/>
                                <span>Gemini 2.5 Flash</span>
                             </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    <span>© {currentYear} Caozhu Literary Society</span>
                    <span className="hidden md:inline w-px h-3 bg-gray-200"></span>
                    <span>Fujian Pucheng No.1 High School</span>
                </div>
                
                <div className="flex items-center gap-6">
                     <button 
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 hover:bg-ink hover:text-white transition-all duration-300 text-xs font-bold text-gray-500"
                    >
                        Back to Top 
                        <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform"/>
                    </button>
                </div>
            </div>
        </div>
    </footer>
  );
};