import type { ReactNode } from 'react';
import { montrerEnEntier } from '../plateforme/navigateur';

/**
 * UN MESSAGE ÉCRIT LÀ OÙ LE GESTE A LIEU — refus, règle manquée, question —
 * QUI SE MONTRE (2026-09-21, « si un bouton valider ou autre actionne un
 * message d'erreur, positionner la fenêtre pour avoir ce message d'erreur
 * visible — valable partout sur le site ») : dès qu'il apparaît, la zone
 * qui défile l'amène en entier sous les yeux. En italique et à l'accent du
 * thème, comme le veut GUIDELINES ; dans un formulaire, en gris (charte).
 */
export function MessageEnPlace({ children, classe }: { children: ReactNode; classe?: string }) {
  return (
    <p ref={montrerEnEntier} className={`regle regle--manquee${classe ? ` ${classe}` : ''}`}>
      {children}
    </p>
  );
}
