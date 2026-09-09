import { useEffect, useRef, useState } from 'react';
import { centrerDansSaListe, surClicDehors } from '../../plateforme/navigateur';

/**
 * L'OUVERTURE ET LA FERMETURE D'UN SÉLECTEUR À ROUES.
 *
 * Écrit une fois pour toutes : le poids, l'âge et la taille s'ouvrent de la
 * même façon, et trois copies de ces écouteurs auraient fini par diverger —
 * l'une oubliant Échap, l'autre le clic dehors.
 *
 * Rien du navigateur ici : le clic dehors, Échap et le défilement viennent de
 * `plateforme/navigateur`, le seul fichier qui les connaisse.
 */
export function useSelecteurOuvert() {
  const [ouvert, setOuvert] = useState(false);
  const enveloppe = useRef<HTMLDivElement>(null);
  /* Les crans retenus, un par roue : ils se placent au milieu à l'ouverture. */
  const crans = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!ouvert) return;
    for (const cran of crans.current) centrerDansSaListe(cran);
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;
    return surClicDehors(
      () => enveloppe.current,
      () => setOuvert(false),
    );
  }, [ouvert]);

  /** Garde une référence vers le cran retenu de la roue numéro `roue`. */
  const cranRetenu = (roue: number) => (element: HTMLButtonElement | null) => {
    crans.current[roue] = element;
  };

  return { ouvert, setOuvert, enveloppe, cranRetenu };
}
