import { GoogleGenAI } from "@google/genai";
import { AIMode } from "../types";

// Configuration
const API_KEY = process.env.API_KEY || ''; 
const BASE_URL = 'https://api-proxy.me/gemini/v1beta';
const MODEL_NAME = "gemini-2.5-flash";

// Initialize Client with Proxy
const ai = new GoogleGenAI({ 
  apiKey: API_KEY,
}, {
  baseUrl: BASE_URL
});

export const generateLiteraryContent = async (
  input: string,
  mode: AIMode,
  onStream: (text: string, isComplete: boolean) => void
): Promise<string> => {
  
  // 1. Log Configuration (Masked Key)
  console.log(`[Gemini Service] Initializing request...`);
  console.log(`[Gemini Service] Proxy: ${BASE_URL}`);
  console.log(`[Gemini Service] Model: ${MODEL_NAME}`);
  console.log(`[Gemini Service] Key Status: ${API_KEY ? 'Present (Ends with ...' + API_KEY.slice(-4) + ')' : 'Missing'}`);

  if (!API_KEY) {
    console.error("[Gemini Service] Error: API Key is missing.");
    throw new Error("API Key is missing.");
  }

  // 2. Prepare Prompt
  let systemInstruction = "";
  let promptPrefix = "请分析以下文本：\n\n";

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

  console.log(`[Gemini Service] Mode: ${mode}`);
  console.log(`[Gemini Service] System Instruction Preview: ${systemInstruction.substring(0, 50)}...`);

  try {
    // 3. Send Request
    console.log("[Gemini Service] Sending stream request...");
    
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: `${promptPrefix}${input}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    console.log("[Gemini Service] Connection established. Receiving stream...");

    let fullText = "";
    let chunkCount = 0;

    // 4. Handle Stream
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        chunkCount++;
        // Log first few chunks to verify data flow
        if (chunkCount <= 3) {
            console.log(`[Gemini Service] Received chunk #${chunkCount}:`, text.substring(0, 20) + "...");
        }
        onStream(fullText, false);
      }
    }

    console.log(`[Gemini Service] Stream complete. Total chunks: ${chunkCount}. Total length: ${fullText.length}`);
    onStream(fullText, true);
    return fullText;

  } catch (error: any) {
    console.error("[Gemini Service] API Request Failed:", error);
    
    // Log specific error details if available
    if (error.response) {
        console.error("[Gemini Service] Error Status:", error.response.status);
        console.error("[Gemini Service] Error Body:", await error.response.text());
    } else if (error.message) {
        console.error("[Gemini Service] Error Message:", error.message);
    }

    throw error;
  }
};