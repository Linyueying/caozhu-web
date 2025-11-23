import { AIMode } from "../types";

const apiKey = process.env.API_KEY || '';

// 你的代理地址 (注意：不需要加 /v1beta，我们在下面的代码中拼接)
// 确保这个地址在你的网络环境下是可以访问的
const PROXY_BASE_URL = 'https://api-proxy.me/gemini'; 

// 模型名称
const MODEL_NAME = "gemini-2.5-flash";

export const generateLiteraryContent = async (
  input: string,
  mode: AIMode,
  onStream: (text: string, isComplete: boolean) => void
): Promise<string> => {
  
  if (!apiKey) {
    console.error("[Gemini Service] ❌ Error: API Key is missing.");
    throw new Error("API Key is missing.");
  }

  let systemInstruction = "";
  let promptPrefix = "请分析以下文本：\n\n";

  // 1. 准备提示词逻辑
  switch (mode) {
    case AIMode.SUMMARY:
      systemInstruction = `你是一位专业的文学编辑。请对用户提供的文章或活动内容进行【内容概述】。要求：语言简练、客观，概括核心事件或情感脉络，字数控制在 100 字以内。`;
      break;
    case AIMode.KEYPOINTS:
      systemInstruction = `你是一位逻辑清晰的分析师。请对用户提供的文本进行【要点总结】。要求：1. 使用列表形式（Markdown）列出 3-5 个关键信息点或核心思想。2. 提炼精准，直击重点。`;
      break;
    case AIMode.ANALYSIS:
      systemInstruction = `你是一位深沉的文学评论家。请对用户提供的文本进行【文学赏析】。要求：1. 分析修辞手法、情感基调、语言风格。2. 挖掘文字背后的深层含义。3. 语言优美，具有感染力，字数 200 字左右。`;
      break;
    case AIMode.RECOMMENDATION:
      systemInstruction = `你是一位博学的文学荐书人。请根据用户的心情或描述，推荐 1-2 部合适的文学作品（书籍、诗歌或散文），并简要说明推荐理由。要求：1. 语气温柔治愈，如同老友交谈。2. 推荐理由要能触动人心，与用户的心情产生共鸣。3. 字数控制在 200 字以内。`;
      promptPrefix = "用户的心情或描述：\n\n";
      break;
  }

  // 2. 拼接完整的 API URL
  // 格式: {BaseURL}/v1beta/models/{ModelName}:streamGenerateContent?key={APIKey}
  const url = `${PROXY_BASE_URL}/v1beta/models/${MODEL_NAME}:streamGenerateContent?key=${apiKey}`;

  console.log(`[Gemini Service] 🚀 Requesting: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

  try {
    // 3. 发起原生 Fetch 请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${promptPrefix}${input}` }] }],
        system_instruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    if (!response.body) throw new Error("No response body received");

    // 4. 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    console.log("[Gemini Service] 🟢 Stream started.");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      
      // Gemini 的 SSE 数据通常以 "data: " 开头，包含 JSON
      //我们需要解析这些行
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (jsonStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(jsonStr);
            // 提取文本内容
            const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              fullText += textPart;
              onStream(fullText, false);
            }
          } catch (e) {
            // 忽略非 JSON 行或解析错误
          }
        } else {
          // 兼容普通的 JSON 块（非 SSE 格式的情况，有些代理可能会合并包）
          // 简单的尝试解析，如果不是 JSON 就不管
          try {
             // 这一步是容错处理，针对某些特殊的流格式
             if (line.trim().startsWith('{') && line.trim().includes('"text"')) {
                const data = JSON.parse(line);
                const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textPart) {
                    fullText += textPart;
                    onStream(fullText, false);
                }
             }
          } catch(e) {}
        }
      }
    }

    console.log("[Gemini Service] ✅ Stream complete. Length:", fullText.length);
    onStream(fullText, true);
    return fullText;

  } catch (error) {
    console.error("[Gemini Service] 🔴 Error Details:", error);
    throw error;
  }
};
