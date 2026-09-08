import { useEffect, useRef, useState } from 'react';

/**
 * L'OUVERTURE ET LA FERMETURE D'UN SÉLECTEUR À ROUES.
 *
 * Écrit une fois pour toutes : le poids, l'âge et la taille s'ouvrent de la
 * même façon, et trois copies de ces trois écouteurs auraient fini par diverger
 * — l'une oubliant Échap, l'autre le clic dehors.
 *
 * CE QUI EST DU NAVIGATEUR EST ICI, ET NULLE PART AILLEURS : le clic dehors
 * (`document`), la touche Échap, et `scrollIntoView` qui amène le cran retenu
 * au milieu de sa colonne. En React Native, ce seul fichier changera.
 */
export function useSelecteurOuvert() {
  const [ouvert, setOuvert] = useState(false);
  const enveloppe = useRef<HTMLDivElement>(null);
  /* Les crans retenus, un par roue : ils se placent au milieu à l'ouverture. */
  const crans = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!ouvert) return;
    for (const cran of crans.current) cran?.scrollIntoView({ block: 'center' });
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;

    const auClic = (evenement: MouseEvent) => {
      if (!enveloppe.current?.contains(evenement.target as Node)) setOuvert(false);
    };
    const auClavier = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') setOuvert(false);
    };

    document.addEventListener('mousedown', auClic);
    document.addEventListener('keydown', auClavier);
    return () => {
      document.removeEventListener('mousedown', auClic);
      document.removeEventListener('keydown', auClavier);
    };
  }, [ouvert]);

  /** Garde une référence vers le cran retenu de la roue numéro `roue`. */
  const cranRetenu = (roue: number) => (element: HTMLButtonElement | null) => {
    crans.current[roue] = element;
  };

  return { ouvert, setOuvert, enveloppe, cranRetenu };
}
