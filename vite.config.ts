import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Läuft jetzt auf der eigenen Domain jasmindraxl.at (Root, kein Unterpfad
// mehr) – deshalb `base` für Produktion UND Dev einheitlich "/". Vorher war
// das hier nach `mode` unterschieden (GitHub-Pages-Projektseite unter
// /coming-home/), siehe Git-Historie, falls das je wieder gebraucht wird.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
