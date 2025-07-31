import { createRoot } from 'react-dom/client'
import './shadcn.css'
import './mobile-optimizations.css'
import App from './App'

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
