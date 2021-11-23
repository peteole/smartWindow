import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/smartWindow/",
  server: {
    https:{
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./certificate.pem')
    }
  }
})
