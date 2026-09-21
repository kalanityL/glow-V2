import type { ReactNode } from 'react';
import { useCompte } from '../app/useCompte';
import { deconnexion } from '../plateforme/compte';
import { classeDuTheme } from '../themes/themes';
import { Connexion } from './Connexion';

/** Ce que le verrou donne à l'application : rien tant qu'il n'est pas
    armé ; armé et ouvert, le geste qui referme. */
export interface Session {
  /** Le lien « Se déconnecter » de « Mon compte » : absent sans verrou. */
  onDeconnexion?: () => void;
}

/**
 * LE VERROU DE L'APPLICATION — l'`AuthGate` de la V1 (2026-09-21, « brancher
 * sur la v2 en ligne la meme identification que la v1 »).
 *
 * Désarmé (`arme` faux), il laisse passer : le poste de développement et
 * les captures n'ont pas de compte. Armé, il ne rend l'application qu'à une
 * session connectée — et, le temps que le SDK restaure la session
 * mémorisée, une page vide du fond de la personne : pour ne pas éclairer
 * l'écran de connexion à quelqu'un qui est déjà connecté.
 *
 * C'est `main.tsx` qui l'arme, sur le build de production seulement : le
 * verrou vaut pour la V2 EN LIGNE, ses mots ; en développement, chaque
 * écran doit rester atteignable sans mot de passe.
 */
export function Verrou({
  arme,
  classeFond,
  children,
}: {
  arme: boolean;
  /** La classe du fond enregistré, pour la page d'attente et la connexion. */
  classeFond: string;
  children: (session: Session) => ReactNode;
}) {
  return arme ? <VerrouArme classeFond={classeFond}>{children}</VerrouArme> : <>{children({})}</>;
}

/** Séparé pour ne monter l'abonnement au SDK que si le verrou est armé. */
function VerrouArme({ classeFond, children }: { classeFond: string; children: (session: Session) => ReactNode }) {
  const etat = useCompte();

  if (etat.statut === 'restauration') {
    return <div className={`page page--photo ${classeFond} ${classeDuTheme('blanc')}`} aria-busy="true" />;
  }
  if (etat.statut === 'deconnecte') {
    return <Connexion classeFond={classeFond} />;
  }
  return <>{children({ onDeconnexion: () => void deconnexion() })}</>;
}
