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

/* LE VERROU N'EST ARMÉ QUE SUR LE BUILD DE PRODUCTION (2026-09-21, « brancher
   sur la v2 en ligne la meme identification que la v1 ») : la V2 EN LIGNE
   demande un compte, ses mots ; le poste de développement et les captures
   sans fenêtre n'en ont pas. La décision est ici, dans le point d'entrée du
   web, parce que `import.meta.env` est une affaire de l'outil de build, pas
   de l'application : en natif, ce sera la configuration du paquet. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App verrou={import.meta.env.PROD} />
  </StrictMode>,
);
