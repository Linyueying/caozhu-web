
import { GoogleGenAI } from "@google/genai";
import { AIMode } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateLiteraryContent = async (
  input: string,
  mode: AIMode,
  onStream: (text: string) => void
): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  let systemInstruction = "";
  let promptPrefix = "请分析以下文本：\n\n";
  const modelName = "gemini-2.5-flash"; 

  switch (mode) {
    case AIMode.SUMMARY:
      systemInstruction = `你是一位专业的文学编辑。
      请对用户提供的文章或活动内容进行【内容概述】。
      要求：语言简练、客观，概括核心事件或情感脉络，字数控制在 100 字以内。`;
      break;
      
    case AIMode.KEYPOINTS:
      systemInstruction = `你是一位逻辑清晰的分析师。
      请对用户提供的文本进行【要点总结】。
      要求：
      1. 使用列表形式（Markdown）列出 3-5 个关键信息点或核心思想。
      2. 提炼精准，直击重点。`;
      break;
      
    case AIMode.ANALYSIS:
      systemInstruction = `你是一位深沉的文学评论家。
      请对用户提供的文本进行【文学赏析】。
      要求：
      1. 分析修辞手法、情感基调、语言风格。
      2. 挖掘文字背后的深层含义。
      3. 语言优美，具有感染力，字数 200 字左右。`;
      break;

    case AIMode.RECOMMENDATION:
      systemInstruction = `你是一位博学的文学荐书人。
      请根据用户的心情或描述，推荐 1-2 部合适的文学作品（书籍、诗歌或散文），并简要说明推荐理由。
      要求：
      1. 语气温柔治愈，如同老友交谈。
      2. 推荐理由要能触动人心，与用户的心情产生共鸣。
      3. 字数控制在 200 字以内。`;
      promptPrefix = "用户的心情或描述：\n\n";
      break;
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: [{ parts: [{ text: `${promptPrefix}${input}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onStream(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};