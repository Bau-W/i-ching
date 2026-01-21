
import { BA_GUA, EARTHLY_BRANCHES, HEX_GRID, HEX_SYMBOLS } from '../constants';
import { DivinationMethod, HexagramResult, Trigram } from '../types';

export const getEarthlyBranch = (hour: number): { index: number; name: string } => {
  const branchMap = [
    { start: 23, end: 1, name: '子', index: 1 },
    { start: 1, end: 3, name: '丑', index: 2 },
    { start: 3, end: 5, name: '寅', index: 3 },
    { start: 5, end: 7, name: '卯', index: 4 },
    { start: 7, end: 9, name: '辰', index: 5 },
    { start: 9, end: 11, name: '巳', index: 6 },
    { start: 11, end: 13, name: '午', index: 7 },
    { start: 13, end: 15, name: '未', index: 8 },
    { start: 15, end: 17, name: '申', index: 9 },
    { start: 17, end: 19, name: '酉', index: 10 },
    { start: 19, end: 21, name: '戌', index: 11 },
    { start: 21, end: 23, name: '亥', index: 12 },
  ];

  const branch = branchMap.find(b => {
    if (b.start === 23) return hour >= 23 || hour < 1;
    return hour >= b.start && hour < b.end;
  }) || branchMap[0];

  return { index: branch.index, name: branch.name };
};

const getTrigramIndexByLines = (lines: number[]): number => {
  const target = lines.join(',');
  const idx = BA_GUA.findIndex(tg => tg.lines.join(',') === target);
  return idx + 1;
};

const getHexagramName = (shangIdx: number, xiaIdx: number): string => {
  const baseName = HEX_GRID[shangIdx - 1][xiaIdx - 1];
  const shangNature = BA_GUA[shangIdx - 1].nature;
  const xiaNature = BA_GUA[xiaIdx - 1].nature;
  
  if (shangIdx === xiaIdx) return `${baseName}為${shangNature}`;
  return `${shangNature}${xiaNature}${baseName}`;
};

export const calculateHexagram = (
  method: DivinationMethod,
  data: { character?: string; strokes?: number; numbers?: [number, number] }
): HexagramResult => {
  const now = new Date();
  const { index: branchIndex, name: branchName } = getEarthlyBranch(now.getHours());

  let shangIndex: number;
  let xiaIndex: number;
  let changingLine: number;

  const branchRem = branchIndex % 8; // 時辰餘數

  if (method === DivinationMethod.CONSCIOUSNESS) {
    const strokes = data.strokes || 0;
    // 1. 上卦 = 筆畫 % 8
    shangIndex = (strokes % 8) || 8;
    // 2. 下卦 = 上卦序數 往後推移 (時辰餘數) 位
    xiaIndex = ((shangIndex + branchRem - 1) % 8) + 1;
    // 3. 動爻 = (筆畫 + 時辰序數) % 6
    changingLine = ((strokes + branchIndex) % 6) || 6;
  } else {
    const n1 = data.numbers?.[0] || 0;
    const n2 = data.numbers?.[1] || 0;
    // 1. 上卦 = 第一組數字 % 8
    shangIndex = (n1 % 8) || 8;
    // 2. 下卦 = 上卦序數 往後推移 (時辰餘數) 位
    xiaIndex = ((shangIndex + branchRem - 1) % 8) + 1;
    // 3. 動爻 = (數字1 + 數字2) % 6 (不含時辰)
    changingLine = ((n1 + n2) % 6) || 6;
  }

  const shangGua = BA_GUA[shangIndex - 1];
  const xiaGua = BA_GUA[xiaIndex - 1];
  
  // 易經六爻由下而上：1-3 爻為下卦，4-6 爻為上卦
  const originalLines = [...xiaGua.lines, ...shangGua.lines];
  const changedLines = [...originalLines];
  const lineToChange = changingLine - 1;
  changedLines[lineToChange] = changedLines[lineToChange] === 1 ? 0 : 1;

  // 計算之卦卦象
  const changedXiaLines = changedLines.slice(0, 3);
  const changedShangLines = changedLines.slice(3, 6);
  const changedXiaIndex = getTrigramIndexByLines(changedXiaLines);
  const changedShangIndex = getTrigramIndexByLines(changedShangLines);

  const name = getHexagramName(shangIndex, xiaIndex);
  const changedName = getHexagramName(changedShangIndex, changedXiaIndex);

  return {
    shangGua,
    xiaGua,
    changingLine,
    name,
    changedName,
    originalSymbol: HEX_SYMBOLS[HEX_GRID[shangIndex - 1][xiaIndex - 1]] || '',
    changedSymbol: HEX_SYMBOLS[HEX_GRID[changedShangIndex - 1][changedXiaIndex - 1]] || '',
    originalLines,
    changedLines,
    divinationTime: now.toLocaleString('zh-TW'),
    earthlyBranch: branchName,
    inputDetails: {
      method,
      ...data
    }
  };
};
