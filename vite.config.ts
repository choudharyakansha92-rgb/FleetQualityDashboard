**GitHub → vite.config.ts → REPLACE ENTIRE file:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ← NO root, NO alias, NO custom paths
})
