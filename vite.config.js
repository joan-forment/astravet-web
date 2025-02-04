import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Three.js (motor 3D) pesa ~930 kB por sí solo: es inevitable.
    // Subimos el umbral para no recibir un aviso de algo esperado.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Separa las librerías pesadas en archivos propios para
        // que carguen y se cacheen de forma independiente.
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap", "@gsap/react"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
