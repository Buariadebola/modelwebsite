import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ModelProvider } from "./context/ModelContext.jsx";
import { MessagingProvider } from './context/MessagingContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <MessagingProvider>
        <ModelProvider>
          <App />
        </ModelProvider>
      </MessagingProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
