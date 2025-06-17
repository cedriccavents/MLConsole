import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import store from './store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
    </StrictMode>
  </BrowserRouter>
)
