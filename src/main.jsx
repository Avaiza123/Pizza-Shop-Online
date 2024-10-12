// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // If using Bootstrap
import './index.css'; // Custom global CSS if needed
import { CartProvider } from './CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <CartProvider>
   <Router> <App /></Router>
  </CartProvider>,
  document.getElementById('root')
);