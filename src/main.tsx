import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'

import './styles/tokens.css'
import './styles/global.css'
import './styles/typography.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
