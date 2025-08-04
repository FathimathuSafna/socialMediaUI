import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './store/ThemeContext.jsx'
import { supabase } from  './store/supabaseClient.jsx'
import { SessionContextProvider } from '@supabase/auth-helpers-react'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SessionContextProvider>
  </StrictMode>
)