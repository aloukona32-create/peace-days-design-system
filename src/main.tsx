import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LocaleProvider } from './i18n/LocaleProvider'
import { SiteSettingsProvider } from './lib/siteSettings'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <SiteSettingsProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </SiteSettingsProvider>
    </LocaleProvider>
  </React.StrictMode>,
)
