import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Deployt wird als GitHub-Pages-Projektseite unter /coming-home/ (siehe
// .github/workflows/deploy.yml) – deshalb bekommt nur der Produktions-Build
// diesen Unterpfad als Basis. `npm run dev` bleibt bei "/", damit lokale
// Vorschau ohne Umwege funktioniert. Zieht die Seite später auf eine eigene
// Domain (z. B. cominghome.de), wird `base` hier einfach wieder auf "/" gesetzt.
//
// Wichtig: nach `mode`, nicht nach `command` unterscheiden. `vite preview`
// läuft (wie `vite dev`) unter command "serve" – würde also mit "/" statt
// "/coming-home/" ausliefern und dabei fälschlich alle Assets 404en, obwohl
// index.html (aus dem echten Build) schon auf "/coming-home/..." verweist.
// `mode` ist dagegen bei build UND preview "production", nur bei dev
// "development" – das trifft genau den gewünschten Unterschied.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/coming-home/' : '/',
  plugins: [react()],
}))
