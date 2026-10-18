import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap como dependencia local (npm), no por CDN: así el sitio funciona
// igual aunque no haya internet el día de la presentación.
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import './Estilos.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
