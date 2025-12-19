
import React, { useState, useEffect } from 'react';
import { DivinationMethod, HexagramResult } from './types';
import { calculateHexagram } from './utils/iching';
import { interpretHexagram } from './services/geminiService';
import HexagramVisual from './components/HexagramVisual';

const App: React.FC = () => {
  const [method, setMethod] = useState<DivinationMethod>(DivinationMethod.CONSCIOUSNESS);
  const [char, setChar] = useState('');
  const [strokes, setStrokes] = useState<number | ''>('');
  const [num1, setNum1] = useState<number | ''>('');
  const [num2, setNum2] = useState<number | ''>('');
  const [inquiry, setInquiry] = useState('');
  
  const [result, setResult] = useState<HexagramResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDivination = async () => {
    setLoading(true);
    setInterpretation(null);
    
    let res: HexagramResult;
    if (method === DivinationMethod.CONSCIOUSNESS) {
      if (!char || !strokes) {
        alert("請輸入感應到的字及其康熙筆畫數");
        setLoading(false);
        return;
      }
      res = calculateHexagram(method, { character: char, strokes: Number(strokes) });
    } else {
      if (!num1 || !num2) {
        alert("請輸入兩組數字");
        setLoading(false);
        return;
      }
      res = calculateHexagram(method, { numbers: [Number(num1), Number(num2)] });
    }

    // Add inquiry to the result
    res.inquiry = inquiry;

    setResult(res);
    const text = await interpretHexagram(res);
    setInterpretation(text || "暫無解析結果。");
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setInterpretation(null);
    setChar('');
    setStrokes('');
    setNum1('');
    setNum2('');
    setInquiry('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="serif text-5xl font-black text-slate-900 mb-4 tracking-widest">靈曜易占</h1>
        <p className="text-slate-600 font-light italic">觀乎天文，以察時變；觀乎人文，以化成天下。</p>
      </header>

      {!result ? (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-stone-200 overflow-hidden transition-all duration-500">
          {/* Method Tabs */}
          <div className="flex border-b border-stone-100">
            <button 
              onClick={() => setMethod(DivinationMethod.CONSCIOUSNESS)}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${method === DivinationMethod.CONSCIOUSNESS ? 'bg-white text-amber-700 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600 bg-stone-50/50'}`}
            >
              意識卦（字占）
            </button>
            <button 
              onClick={() => setMethod(DivinationMethod.NUMBER)}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${method === DivinationMethod.NUMBER ? 'bg-white text-amber-700 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600 bg-stone-50/50'}`}
            >
              數字卦
            </button>
          </div>

          <div className="p-8 md:p-12">
            {/* Inquiry Field (Common to both methods) */}
            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 serif">所求之事（選填）</label>
              <textarea 
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="例如：這項新事業的未來發展如何？"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-lg serif placeholder:text-base placeholder:text-slate-300 resize-none h-24"
              />
            </div>

            {method === DivinationMethod.CONSCIOUSNESS ? (
              <div className="space-y-6">
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-amber-900 leading-relaxed text-sm serif">
                  <p className="font-bold mb-2">【意識卦說明】</p>
                  放鬆心情平靜思緒，心中默誦想問的事情，誠心祈求解惑，然後閉目不語。<br />
                  心中產生「一陽初動」的靈感，腦海中浮現一個字，請輸入該字並查詢其筆畫。
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 serif">浮現的字</label>
                    <input 
                      type="text" 
                      maxLength={1}
                      value={char}
                      onChange={(e) => setChar(e.target.value)}
                      placeholder="例：誠"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-center text-xl serif placeholder:text-lg placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest serif">筆畫數（康熙字典）</label>
                      <a href="https://www.kangxizidian.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber-600 hover:underline">查詢筆畫 →</a>
                    </div>
                    <input 
                      type="number" 
                      value={strokes}
                      onChange={(e) => setStrokes(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="請輸入總筆畫"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-center text-xl serif placeholder:text-lg placeholder:tracking-wider placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-amber-900 leading-relaxed text-sm serif">
                  <p className="font-bold mb-2">【數字卦說明】</p>
                  在 1~99 之間選兩個與祈求解惑的事情有關聯的數字。
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 serif">第一組數字</label>
                    <input 
                      type="number" 
                      min={1}
                      max={99}
                      value={num1}
                      onChange={(e) => setNum1(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="1~99"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-center text-xl serif placeholder:text-lg placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 serif">第二組數字</label>
                    <input 
                      type="number" 
                      min={1}
                      max={99}
                      value={num2}
                      onChange={(e) => setNum2(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="1~99"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-center text-xl serif placeholder:text-lg placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handleDivination}
              disabled={loading}
              className="w-full mt-10 bg-slate-900 text-white py-4 rounded-xl font-bold tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed serif"
            >
              {loading ? '正在感應天地靈氣...' : '起卦問玄'}
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-stone-100">
             <div className="text-xs text-slate-500 serif">
                <p>本卦：<span className="text-slate-900 font-bold">{result.name}</span></p>
                <p>之卦：<span className="text-slate-900 font-bold">{result.changedName}</span></p>
                <p>時辰：<span className="text-slate-900">{result.divinationTime} ({result.earthlyBranch}時)</span></p>
                <p>輸入：<span className="text-slate-900">
                  {result.inputDetails.method === DivinationMethod.CONSCIOUSNESS 
                    ? `字「${result.inputDetails.character}」${result.inputDetails.strokes}畫` 
                    : `數字 ${result.inputDetails.numbers?.join(', ')}`}
                </span></p>
                {result.inquiry && (
                  <p className="mt-1 border-t border-stone-200 pt-1">所求：<span className="text-slate-900 italic">「{result.inquiry}」</span></p>
                )}
             </div>
             <button onClick={reset} className="text-xs bg-stone-200 hover:bg-stone-300 text-slate-700 px-3 py-1.5 rounded-lg transition-colors serif">重新起卦</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Column */}
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center justify-center space-y-8">
               <div className="flex flex-col items-center gap-6 w-full">
                  <div className="text-center w-full">
                    <p className="text-[10px] text-amber-600 font-bold mb-2 uppercase tracking-widest border-b border-amber-100 pb-1 serif">本卦 (現狀)</p>
                    <h3 className="serif text-2xl font-bold text-slate-800 mb-4">{result.name}</h3>
                    <div className="flex justify-center">
                      <HexagramVisual lines={result.originalLines} changingLine={result.changingLine} />
                    </div>
                    <p className="mt-4 text-amber-700 text-[10px] font-bold bg-amber-50 px-3 py-1 rounded-full inline-block serif">動在第 {result.changingLine} 爻</p>
                  </div>

                  <div className="w-full flex items-center justify-center gap-2 text-slate-300">
                    <div className="h-[1px] flex-1 bg-stone-100"></div>
                    <span className="text-xs italic serif">變更為</span>
                    <div className="h-[1px] flex-1 bg-stone-100"></div>
                  </div>

                  <div className="text-center w-full">
                    <p className="text-[10px] text-emerald-600 font-bold mb-2 uppercase tracking-widest border-b border-emerald-100 pb-1 serif">之卦 (發展)</p>
                    <h3 className="serif text-2xl font-bold text-slate-800 mb-4">{result.changedName}</h3>
                    <div className="flex justify-center">
                      <HexagramVisual lines={result.changedLines} />
                    </div>
                  </div>
               </div>
            </div>

            {/* Interpretation Column */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100 min-h-[500px]">
               <div className="flex items-center gap-3 mb-8 border-b border-stone-100 pb-4">
                 <div className="w-2 h-8 bg-amber-600 rounded-full"></div>
                 <h2 className="serif text-2xl font-bold text-slate-800">卦辭與解讀</h2>
               </div>
               
               {loading ? (
                 <div className="space-y-4">
                   <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse"></div>
                   <div className="h-4 bg-stone-100 rounded w-1/2 animate-pulse"></div>
                   <div className="h-4 bg-stone-100 rounded w-5/6 animate-pulse"></div>
                   <div className="h-32 bg-stone-50 rounded w-full animate-pulse mt-8"></div>
                 </div>
               ) : (
                 <div className="prose prose-slate max-w-none serif">
                    {interpretation?.split('\n').map((para, i) => (
                      <p key={i} className="mb-4 text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {para}
                      </p>
                    ))}
                    <div className="mt-12 pt-8 border-t border-stone-100 text-slate-400 text-sm italic">
                      解析參考：王思迅《易經白話講座》。以上解析內容由靈曜 AI 輔助生成。
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-24 text-center text-slate-400 text-xs space-y-2 serif">
        <p>© 2024 靈曜易占 · 玄學與科技的交匯</p>
        <p>易道廣大，無所不包。問卦求的是心平氣和，行為得體。</p>
      </footer>
    </div>
  );
};

export default App;
