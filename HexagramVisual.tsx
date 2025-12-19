
import React from 'react';

interface HexagramVisualProps {
  lines: number[]; // 6 lines from bottom to top
  changingLine?: number; // 1 to 6
  size?: 'sm' | 'lg';
}

const HexagramVisual: React.FC<HexagramVisualProps> = ({ lines, changingLine, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const itemHeight = isLarge ? 'h-3' : 'h-2';
  const gap = isLarge ? 'gap-2' : 'gap-1';

  return (
    <div className={`flex flex-col-reverse ${gap} items-center w-full max-w-[200px]`}>
      {lines.map((isYang, index) => {
        const isChanging = (index + 1) === changingLine;
        const lineIndex = index + 1;

        return (
          <div key={index} className="w-full flex items-center gap-2 group relative">
            {/* Line UI Wrapper - 統一的外框在此顯示 */}
            <div className={`flex-1 ${itemHeight} flex items-center justify-between ${isChanging ? 'ring-2 ring-amber-500 ring-offset-2 rounded-sm' : ''}`}>
              {isYang === 1 ? (
                /* Yang Line */
                <div className={`w-full ${itemHeight} bg-slate-800 rounded-sm`}></div>
              ) : (
                /* Yin Line */
                <>
                  <div className={`w-[45%] ${itemHeight} bg-slate-800 rounded-sm`}></div>
                  <div className={`w-[45%] ${itemHeight} bg-slate-800 rounded-sm`}></div>
                </>
              )}
            </div>
            
            {/* Marker */}
            <span className={`text-xs font-mono text-slate-400 w-4 ${isChanging ? 'text-amber-600 font-bold' : ''}`}>
               {lineIndex}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HexagramVisual;
