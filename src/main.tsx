import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { detecterLangue } from './i18n/useTextes';
import './fonts.css';
import './index.css';

/* La langue du document, pour les lecteurs d'écran et la césure. Web
   seulement : en React Native, rien n'a d'attribut `lang`, et c'est pour cela
   que ce geste vit dans le point d'entrée du web et pas dans un écran. */
document.documentElement.lang = detecterLangue();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
