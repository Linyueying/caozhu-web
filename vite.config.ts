import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // 关键配置：设置为相对路径 './'，这样无论部署在什么子目录下都能找到资源
    base: './',
    define: {
      // 安全地注入环境变量，避免覆盖整个 process.env 导致 React 崩溃
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});