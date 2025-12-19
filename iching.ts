
import { BA_GUA, EARTHLY_BRANCHES, HEX_GRID } from '../constants';
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
  return BA_GUA.findIndex(tg => 
    tg.lines.length === lines.length && tg.lines.every((val, i) => val === lines[i])
  ) + 1;
};

const getHexagramName = (shang: number, xia: number): string => {
  const base = HEX_GRID[shang - 1][xia - 1];
  const shangNature = BA_GUA[shang - 1].nature;
  const xiaNature = BA_GUA[xia - 1].nature;
  
  if (shang === xia) return `${shangNature}為${base}`; // e.g. 乾為天
  return `${shangNature}${xiaNature}${base}`; // e.g. 天地否
};

export const calculateHexagram = (
  method: DivinationMethod,
  data: { character?: string; strokes?: number; numbers?: [number, number] }
): HexagramResult => {
  const now = new Date();
  const { index: branchIndex, name: branchName } = getEarthlyBranch(now.getHours());
  const timeRemainder = (branchIndex % 8) || 8;

  let shangIndex: number;
  let changingLine: number;
  let xiaIndex: number;

  if (method === DivinationMethod.CONSCIOUSNESS) {
    const strokes = data.strokes || 0;
    shangIndex = (strokes % 8) || 8;
    xiaIndex = ((shangIndex + timeRemainder - 1) % 8) + 1;
    changingLine = ((strokes + branchIndex) % 6) || 6;
  } else {
    const n1 = data.numbers?.[0] || 0;
    const n2 = data.numbers?.[1] || 0;
    shangIndex = (n1 % 8) || 8;
    xiaIndex = ((shangIndex + timeRemainder - 1) % 8) + 1;
    changingLine = ((n1 + n2) % 6) || 6;
  }

  const shangGua = BA_GUA[shangIndex - 1];
  const xiaGua = BA_GUA[xiaIndex - 1];
  const hexName = getHexagramName(shangIndex, xiaIndex);

  const originalLines = [...xiaGua.lines, ...shangGua.lines];
  const changedLines = [...originalLines];
  const lineToChange = changingLine - 1;
  changedLines[lineToChange] = changedLines[lineToChange] === 1 ? 0 : 1;

  // Determine Zhi Gua name
  const changedXiaLines = changedLines.slice(0, 3);
  const changedShangLines = changedLines.slice(3, 6);
  const changedXiaIndex = getTrigramIndexByLines(changedXiaLines);
  const changedShangIndex = getTrigramIndexByLines(changedShangLines);
  const changedName = getHexagramName(changedShangIndex, changedXiaIndex);

  return {
    shangGua,
    xiaGua,
    changingLine,
    name: hexName,
    changedName: changedName,
    originalSymbol: "", 
    changedSymbol: "",
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
