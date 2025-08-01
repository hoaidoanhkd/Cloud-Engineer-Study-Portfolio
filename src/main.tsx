import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './shadcn.css'
import App from './App'

const root = createRoot(document.getElementById('app')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
