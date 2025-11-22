import React, { useEffect, useRef } from 'react';
import { View } from '../types';
import { ArrowRight, UserPlus } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: View) => void;
  onJoin: () => void;
}

// Bamboo Node interface for the animation
interface Bamboo {
  x: number;
  width: number;
  height: number;
  segments: number;
  lean: number; // How much it leans
  color: string;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  leaves: Leaf[];
}

interface Leaf {
  y: number;
  side: -1 | 1; // Left or Right
  length: number;
  angle: number;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onJoin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize Bamboo Forest
    const bambooCount = Math.floor(width / 100); // Density based on width
    const bamboos: Bamboo[] = [];

    for (let i = 0; i < bambooCount; i++) {
      const depth = Math.random(); // 0 (far) to 1 (near)
      const x = Math.random() * width;
      // Farther bamboo is thinner, lighter, shorter
      const w = 4 + depth * 15; 
      const h = height * (0.6 + depth * 0.6);
      
      // Leaves generation
      const leaves: Leaf[] = [];
      const segments = 6 + Math.floor(Math.random() * 4);
      const segmentHeight = h / segments;
      
      for(let s = 2; s < segments; s++) { // Start from 2nd segment up
         if(Math.random() > 0.4) {
             leaves.push({
                 y: height - (s * segmentHeight),
                 side: Math.random() > 0.5 ? 1 : -1,
                 length: 20 + Math.random() * 40 * depth,
                 angle: Math.random() * 0.5 + 0.2
             });
         }
      }

      bamboos.push({
        x,
        width: w,
        height: h,
        segments,
        lean: (Math.random() - 0.5) * 0.1,
        color: depth > 0.8 ? '#166534' : (depth > 0.5 ? '#4ade80' : '#94a3b8'), // Ink Green to Slate
        opacity: 0.1 + depth * 0.4, // Nearer is more opaque
        swaySpeed: 0.002 + Math.random() * 0.003,
        swayOffset: Math.random() * Math.PI * 2,
        leaves
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time++;

      // Sort by opacity (draw far ones first) to handle layering
      bamboos.sort((a, b) => a.opacity - b.opacity);

      bamboos.forEach((b) => {
        // Calculate Sway
        const sway = Math.sin(time * b.swaySpeed + b.swayOffset) * 15; // Pixel sway at top
        
        ctx.globalAlpha = b.opacity;
        ctx.fillStyle = b.color;
        ctx.strokeStyle = b.color;
        
        const segmentH = b.height / b.segments;
        
        // Draw Stalk (Segments)
        let currentX = b.x;
        for (let i = 0; i < b.segments; i++) {
          const progress = i / b.segments;
          const nextX = b.x + (sway * progress * progress); // Quadratic sway curve
          
          const yBottom = height - (i * segmentH);
          const yTop = height - ((i + 1) * segmentH);
          
          // Draw Segment
          ctx.beginPath();
          ctx.moveTo(currentX - b.width/2, yBottom);
          ctx.lineTo(nextX - b.width/2 + (b.width * 0.05), yTop); // Slight taper
          ctx.lineTo(nextX + b.width/2 - (b.width * 0.05), yTop);
          ctx.lineTo(currentX + b.width/2, yBottom);
          ctx.fill();
          
          // Draw Joint (Knuckle)
          if (i > 0) {
             ctx.beginPath();
             ctx.ellipse(currentX, yBottom, b.width/2 + 2, 3, 0, 0, Math.PI * 2);
             ctx.fill();
          }

          currentX = nextX;
        }

        // Draw Leaves
        b.leaves.forEach(leaf => {
             // Approximate leaf position based on sway
             const leafProgress = (height - leaf.y) / b.height;
             const leafX = b.x + (sway * leafProgress * leafProgress);
             
             ctx.beginPath();
             ctx.moveTo(leafX, leaf.y);
             
             // Leaf control points for curve
             const tipX = leafX + (leaf.length * leaf.side) + (sway * 0.5);
             const tipY = leaf.y + (leaf.length * 0.5);
             
             ctx.quadraticCurveTo(
                 leafX + (leaf.length * 0.2 * leaf.side), leaf.y - 5, // Control point 1 (upward curve start)
                 tipX, tipY // End point
             );
             ctx.quadraticCurveTo(
                 leafX + (leaf.length * 0.5 * leaf.side), leaf.y + 10, // Control point 2 (downward curve return)
                 leafX, leaf.y + 3 // Close to stem
             );
             ctx.fill();
        });

      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#fdfbf7]">
      
      {/* Ink Wash Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#f1f5f9_100%)] pointer-events-none"></div>

      {/* Dynamic Bamboo Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'blur(1px)' }} // Slight blur for depth of field
      />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-[-5vh]">
          
          {/* Elegant School Header - Replaces the Boxy Badge */}
          <div className="animate-slide-up opacity-0 [animation-delay:0ms] mb-8 flex flex-col items-center">
             <div className="flex items-center gap-3 opacity-80">
                <div className="w-[1px] h-4 bg-bamboo-800/40"></div>
                <span className="text-sm font-serif tracking-[0.3em] text-bamboo-900 font-medium">
                  福建省浦城第一中学
                </span>
                <div className="w-[1px] h-4 bg-bamboo-800/40"></div>
             </div>
          </div>

          {/* Main Title */}
          <div className="animate-slide-up opacity-0 [animation-delay:200ms] relative w-full">
             {/* Red Seal / Stamp Decoration (Top Right of Title) */}
             <div className="hidden md:flex absolute -top-6 -right-12 w-10 h-10 border border-red-800/80 rounded-sm items-center justify-center opacity-80 rotate-6">
                <div className="text-[10px] writing-vertical-rl text-red-900 font-serif font-bold leading-none pt-1">
                    草竹
                </div>
             </div>

             {/* Responsive Title Layout */}
             <h1 className="font-serif text-ink relative z-10 flex flex-col items-center md:block">
                <span className="text-5xl md:text-8xl font-bold tracking-tight text-ink drop-shadow-sm whitespace-nowrap mb-2 md:mb-0 block">
                    <span className="text-bamboo-700">草</span>色入帘
                </span>
                
                {/* Separator: Hidden on Mobile, Visible on Desktop */}
                <span className="hidden md:inline mx-8 text-bamboo-200 font-light align-text-top text-6xl">|</span>
                
                <span className="text-5xl md:text-8xl font-bold tracking-tight text-ink drop-shadow-sm whitespace-nowrap block">
                    <span className="text-ink">竹</span>风醒墨
                </span>
             </h1>
          </div>
          
          {/* Subtitle */}
          <p className="animate-slide-up opacity-0 [animation-delay:400ms] text-lg md:text-xl text-gray-600 mt-10 mb-12 max-w-xl leading-loose font-serif">
            <span className="font-bold text-bamboo-800 border-b border-bamboo-200 pb-0.5">草</span>根之韧 &nbsp;•&nbsp; <span className="font-bold text-ink border-b border-gray-200 pb-0.5">竹</span>之气节
            <br/>
            <span className="text-base md:text-lg text-gray-500 mt-4 block font-light">
              在此间，以笔为犁，耕耘心灵的荒原。
            </span>
          </p>
          
          {/* Action Buttons */}
          <div className="animate-slide-up opacity-0 [animation-delay:600ms] flex flex-col md:flex-row gap-4 items-center">
            <button 
              onClick={() => onNavigate(View.WORKS)}
              className="group relative px-12 py-4 overflow-hidden rounded-full bg-ink text-[#fdfbf7] shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 w-full h-full bg-bamboo-700/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative flex items-center font-serif tracking-[0.2em] text-lg">
                入社观文 <ArrowRight size={16} className="ml-3 text-bamboo-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button 
              onClick={onJoin}
              className="group px-10 py-4 rounded-full border border-ink/20 text-ink hover:bg-ink/5 transition-all duration-300 flex items-center font-serif tracking-[0.1em] backdrop-blur-sm"
            >
              加入我们 <UserPlus size={16} className="ml-2 opacity-70 group-hover:scale-110 transition-transform" />
            </button>
          </div>
      </div>

      {/* Scroll Indicator - Perfectly Centered */}
      <div 
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center gap-3 opacity-60 animate-float cursor-pointer hover:opacity-100 transition-opacity z-20 mx-auto"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
         <div className="h-16 w-[1px] bg-gradient-to-b from-transparent to-ink"></div>
         <span className="text-[10px] font-serif text-ink tracking-[0.3em]">SCROLL</span>
      </div>
    </div>
  );
};