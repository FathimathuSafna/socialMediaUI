import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Context from './store/Context.jsx'
import App from './App.jsx'
import { ThemeProvider } from './store/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </Context>
    </StrictMode>

)
