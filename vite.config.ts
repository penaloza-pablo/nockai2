import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lambda': {
        target: 'https://ucx62yjkuhs4lofrfjeicvdaim0mkiac.lambda-url.eu-central-1.on.aws',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lambda/, ''),
      },
    },
  },
})
