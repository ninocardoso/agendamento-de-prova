import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.tsx';
import './index.css';

console.log('App initializing...');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
