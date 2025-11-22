
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // base: './' 确保资源路径是相对的，适配 GitHub Pages 的子目录部署
    base: './',
    define: {
      // Polyfill process.env，确保现有代码中的 process.env.API_KEY 不会报错
      // 注意：在静态构建中，API_KEY 会被替换为构建时的环境变量值
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY)
      }
    }
  };
});
