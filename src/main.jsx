import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import {BrowserRouter} from 'react-router-dom'
import DisasterContextProvider from './DisasterContext.jsx'
import 'leaflet/dist/leaflet.css';



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <DisasterContextProvider>
  <App />
  </DisasterContextProvider>
    
  </BrowserRouter>,
)
