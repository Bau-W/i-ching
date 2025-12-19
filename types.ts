
export enum DivinationMethod {
  CONSCIOUSNESS = 'CONSCIOUSNESS',
  NUMBER = 'NUMBER'
}

export interface Trigram {
  id: number;
  name: string;
  symbol: string;
  lines: number[]; // 1 for Yang, 0 for Yin (bottom to top)
  nature: string;
}

export interface HexagramResult {
  shangGua: Trigram;
  xiaGua: Trigram;
  changingLine: number; // 1 to 6
  name: string;
  changedName: string;
  originalSymbol: string;
  changedSymbol: string;
  originalLines: number[];
  changedLines: number[];
  divinationTime: string;
  earthlyBranch: string;
  inquiry?: string;
  inputDetails: {
    method: DivinationMethod;
    character?: string;
    strokes?: number;
    numbers?: [number, number];
  };
}
