import { useEffect, useRef, type ReactNode } from 'react';
import { IconeCroix } from './Icones';
import { useTextes } from '../i18n/useTextes';
import { surClicDehors } from '../plateforme/navigateur';

/**
 * UN BLOC SUR LA PAGE VITRÉE (2026-09-20, « un bloc en reste page vitré ») :
 * le reste de la page passe derrière la vitre floue — la même que sous les
 * tiroirs —, et le bloc se pose au milieu, avec son titre et sa croix. Il se
 * ferme à la croix, au clic à côté ou à Échap ; mais c'est l'appelant qui
 * décide de ce que « fermer » veut dire (il peut d'abord demander de
 * confirmer). Pas de voile sombre, pas de fenêtre : la vitre des tiroirs, à
 * l'endroit du geste.
 */
export function Bloc({
  titre,
  onFermer,
  children,
}: {
  titre: string;
  /** Demandé par la croix, le clic à côté ou Échap. */
  onFermer: () => void;
  children: ReactNode;
}) {
  const textes = useTextes();
  const bloc = useRef<HTMLDivElement>(null);
  useEffect(() => surClicDehors(() => bloc.current, onFermer), [onFermer]);

  return (
    <>
      <div className="vitre" aria-hidden="true" />
      <div className="bloc" ref={bloc} role="dialog" aria-label={titre}>
        <div className="bloc__entete">
          <h2 className="bloc__titre">{titre}</h2>
          <button type="button" className="tiroir__fermer bloc__fermer" aria-label={textes.fermer} onClick={onFermer}>
            <IconeCroix />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
