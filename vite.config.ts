import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Use the specific key provided by the user
  const apiKey = env.API_KEY || "AIzaSyBRIRUwNCaVrL_LvEwRsscWYQw5oef6TaA";

  return {
    plugins: [react()],
    base: './',
    define: {
      // 安全地注入环境变量
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});