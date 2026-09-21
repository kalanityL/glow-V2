import { useEffect, useState } from 'react';
import { surCompte, type Compte } from '../plateforme/compte';

/** L'état de connexion, de la restauration de la session à la décision. */
export type EtatCompte =
  | { statut: 'restauration' }
  | { statut: 'deconnecte' }
  | { statut: 'connecte'; compte: Compte };

/**
 * Suit l'état de connexion (le `useAuth` de la V1).
 *
 * Démarre en `restauration` le temps que le SDK relise la session
 * mémorisée — c'est ce qui évite d'éclairer l'écran de connexion à
 * quelqu'un qui est déjà connecté. À n'employer que si le verrou est armé.
 */
export function useCompte(): EtatCompte {
  const [etat, setEtat] = useState<EtatCompte>({ statut: 'restauration' });

  useEffect(
    () => surCompte((compte) => setEtat(compte ? { statut: 'connecte', compte } : { statut: 'deconnecte' })),
    [],
  );

  return etat;
}
