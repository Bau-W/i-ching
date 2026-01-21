
import { GoogleGenAI } from "@google/genai";
import { HexagramResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretHexagram = async (result: HexagramResult) => {
  const { name, changedName, changingLine, divinationTime, earthlyBranch, inputDetails, inquiry } = result;
  
  const inputStr = inputDetails.method === 'CONSCIOUSNESS' 
    ? `所占之字：${inputDetails.character}（${inputDetails.strokes}畫）`
    : `所占數字：${inputDetails.numbers?.join(', ')}`;

  const inquiryContext = inquiry ? `\n    - 問卦之事：${inquiry}` : "";

  const prompt = `
    你是一位精通《易經》的國學大師，尤其擅長王思迅老師《易經白話講座》的詮釋風格。

    目前卜卦結果如下：
    - 本卦：${name}
    - 之卦：${changedName}
    - 變爻：第 ${changingLine} 爻
    - 基礎資訊：${inputStr}${inquiryContext}

    請按照以下結構進行深度解析：
    
    1. 【經文原文】：請務必完整列出以下三項內容：
       - 本卦「${name}」的【卦辭】原文
       - 第 ${changingLine} 爻的【爻辭】原文
       - 之卦「${changedName}」的【卦辭】原文
    2. 【本卦解析】：解析「${name}」卦的總體能量，代表目前的處境與心理狀態。
    3. 【爻變指引】：針對第 ${changingLine} 爻的變動（動爻），詳細說明該爻辭對當下行動的具體建議。
    4. 【之卦遠景】：解析「${changedName}」卦，這代表事情往下發展的可能趨向。
    5. 【哲學啟示】：引用王思迅式的哲學思考，告訴問卦者如何調適心態。
    6. 【綜合建議】：給出下一步最關鍵的一個具體建議。

    請使用繁體中文，語氣溫和、堅定且富有智慧。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，目前解析服務暫時無法連線，請稍後再試。";
  }
};
