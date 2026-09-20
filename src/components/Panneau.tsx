import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { pageDe, placerPanneau, surClicDehors, surDefilementHors, type PlacePanneau } from '../plateforme/navigateur';

/**
 * UN PANNEAU DÉROULANT SOUS UNE ANCRE — ce que tous les choix de
 * l'application déroulent (2026-09-20, « Regle ABSOLUE : AUCUN SELECT NE
 * DOIT JAMAIS DEPASSER DE L'ECRAN. […] tout est stylé, accordé au theme,
 * comme sur la v1 ») : dessiné par l'application, jamais par le système ;
 * PORTÉ SUR L'ÉCRAN DU TÉLÉPHONE, dont il ne sort jamais — sous l'ancre, ou
 * au-dessus quand la place manque, jamais plus haut que la place qui reste
 * (`placerPanneau`) ; il se ferme au clic à côté, à Échap, et à tout
 * défilement hors de lui. Ce n'est pas un popup au sens des guidelines :
 * c'est le panneau déroulant qui se ferme au clic à côté. Il est PORTÉ DANS
 * LA PAGE de son ancre, pas sur l'écran nu : c'est la page qui porte les
 * jetons du thème, et un panneau porté à côté d'elle n'avait plus ni fond ni
 * encre — les coordonnées, elles, restent celles de l'écran, qui est le bloc
 * conteneur des éléments fixes.
 */
export function Panneau({
  ancre,
  hauteur,
  largeur,
  onFermer,
  classe,
  children,
}: {
  ancre: RefObject<Element | null>;
  /** La hauteur souhaitée ; la place disponible la borne. */
  hauteur: number;
  /** Une largeur minimale, quand l'ancre est trop étroite pour le contenu ;
      l'écran la borne. */
  largeur?: number;
  onFermer: () => void;
  classe?: string;
  children: ReactNode;
}) {
  const panneau = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<PlacePanneau | null>(null);

  useLayoutEffect(() => {
    setPlace(placerPanneau(ancre.current, hauteur, largeur ?? 0));
  }, [ancre, hauteur, largeur]);

  useEffect(() => surClicDehors(() => [ancre.current, panneau.current], onFermer), [ancre, onFermer]);
  useEffect(() => surDefilementHors(() => [panneau.current], onFermer), [onFermer]);

  const page = pageDe(ancre.current);
  if (!page || !place) return null;
  return createPortal(
    <div
      ref={panneau}
      className={`panneau${classe ? ` ${classe}` : ''}`}
      style={{
        left: place.left,
        width: place.width,
        maxHeight: place.maxHeight,
        top: place.top,
        bottom: place.bottom,
      }}
    >
      {children}
    </div>,
    page,
  );
}
