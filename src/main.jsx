import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import store from './redux/store'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <App />
      <ToastContainer />
    </StrictMode>
  </Provider>,
)
