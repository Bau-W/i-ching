
import React from 'react';

interface HexagramVisualProps {
  lines: number[]; // 6 lines from bottom to top
  changingLine?: number; // 1 to 6
  size?: 'sm' | 'lg';
}

const HexagramVisual: React.FC<HexagramVisualProps> = ({ lines, changingLine, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const itemHeight = isLarge ? 'h-3.5' : 'h-2.5';
  const gap = isLarge ? 'gap-3' : 'gap-1.5';

  return (
    <div className={`flex flex-col-reverse ${gap} items-center w-full max-w-[220px] p-2`}>
      {lines.map((isYang, index) => {
        const isChanging = (index + 1) === changingLine;
        const lineIndex = index + 1;

        return (
          <div key={index} className="w-full flex items-center gap-4 group relative">
            {/* Line UI Wrapper - 變爻時顯示統一的大框標示 */}
            <div className={`flex-1 ${itemHeight} flex items-center justify-between px-1.5 py-4 rounded-md transition-all ${
              isChanging 
                ? 'bg-amber-50/80 border-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'border border-transparent'
            }`}>
              {isYang === 1 ? (
                /* Yang Line */
                <div className={`w-full ${itemHeight} bg-slate-800 rounded-sm`}></div>
              ) : (
                /* Yin Line - 雖然是兩個線段，但外層已由上面的 div 統一包裝成一個大框 */
                <>
                  <div className={`w-[44%] ${itemHeight} bg-slate-800 rounded-sm`}></div>
                  <div className={`w-[44%] ${itemHeight} bg-slate-800 rounded-sm`}></div>
                </>
              )}
            </div>
            
            {/* Marker */}
            <span className={`text-sm font-mono w-4 transition-colors ${
              isChanging ? 'text-amber-600 font-bold scale-110' : 'text-slate-300'
            }`}>
               {lineIndex}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HexagramVisual;
