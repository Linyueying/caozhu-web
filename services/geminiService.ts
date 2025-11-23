// 注意：新版 SDK 的导入通常是 Client
import { Client } from "@google/genai"; 
import { AIMode } from "../types";

const apiKey = process.env.API_KEY || ''; 

// 1. 修改 BaseURL：去掉末尾的 /v1beta
// SDK 会自动追加版本号。如果你的代理映射是标准的，这应该是正确的。
const BASE_URL = 'https://api-proxy.me/gemini';

console.log(`[Gemini Service] Initializing... API_KEY present: ${!!apiKey}`);

// 自定义 fetch 用于调试：可以看到 SDK 到底访问了什么地址
const debugFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  console.log(`[DEBUG] 🌐 Request URL: ${input.toString()}`); // 👈 这一行会告诉你真相
  return fetch(input, init);
};

// 2. 初始化 Client (注意这里用 Client 而不是 GoogleGenAI)
const client = new Client({ 
  apiKey,
  baseUrl: BASE_URL,
  // 如果你需要强制指定 API 版本（防止 SDK 默认用 v1alpha），可以在这里配置
  // 也可以传入自定义 fetch 来调试
  httpOptions: {
    apiVersion: 'v1beta', 
  },
  // 这一行开启调试模式，拦截请求
  fetch: debugFetch, 
});

export const generateLiteraryContent = async (
  input: string,
  mode: AIMode,
  onStream: (text: string, isComplete: boolean) => void
): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // 3. 确认模型名称：Gemini 2.5 Flash
  const modelName = "gemini-2.5-flash"; 
  
  let systemInstruction = "";
  let promptPrefix = "请分析以下文本：\n\n";

  // ... (Switch 逻辑保持不变) ...
  switch (mode) {
    case AIMode.SUMMARY: systemInstruction = "你是一位专业的文学编辑..."; break;
    case AIMode.KEYPOINTS: systemInstruction = "你是一位逻辑清晰的分析师..."; break;
    case AIMode.ANALYSIS: systemInstruction = "你是一位深沉的文学评论家..."; break;
    case AIMode.RECOMMENDATION: 
      systemInstruction = "你是一位博学的文学荐书人..."; 
      promptPrefix = "用户的心情或描述：\n\n";
      break;
  }

  try {
    console.log(`[Gemini Service] 🚀 Sending request using model: ${modelName}`);
    
    // 4. 调用方式：使用 client.models.generateContentStream
    const responseStream = await client.models.generateContentStream({
      model: modelName,
      contents: [{ parts: [{ text: `${promptPrefix}${input}` }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    console.log("[Gemini Service] 🟢 Stream started.");

    let fullText = "";
    for await (const chunk of responseStream) {
      // 新版 SDK chunk 取值方式可能稍有不同，通常是 chunk.text() 方法或属性
      // 这里做个兼容处理
      const text = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
      
      if (text) {
        fullText += text;
        onStream(fullText, false);
      }
    }
    onStream(fullText, true);
    return fullText;

  } catch (error) {
    console.error("[Gemini Service] 🔴 Error Details:", error);
    // 提示用户可能的错误原因
    if (error instanceof Error && error.message.includes("404")) {
       console.error("👉 可能是 URL 路径错误。请检查控制台上方 [DEBUG] 输出的 URL 是否有多余的 /v1beta");
    }
    throw error;
  }
};
