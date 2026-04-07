import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { loadLeafletHeat } from './utils/loadLeafletHeat.js'

// Load leaflet.heat plugin from CDN before mounting
loadLeafletHeat().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
