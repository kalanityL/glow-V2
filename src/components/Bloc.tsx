import { useEffect, useRef, type ReactNode } from 'react';
import { IconeCroix } from './Icones';
import { useTextes } from '../i18n/useTextes';
import { surClicDehors } from '../plateforme/navigateur';

/**
 * UN BLOC SUR LA PAGE VITRÉE (2026-09-20, « un bloc en reste page vitré ») :
 * le reste de la page passe derrière la vitre floue — la même que sous les
 * tiroirs —, et le bloc se pose entre l'entête et la barre du bas, avec son
 * titre et sa croix. IL A TOUJOURS SA HAUTEUR MAXIMALE, quel que soit son
 * contenu (« hauteur maximal du bloc peu importe le choix ») : son contenu
 * défile, son pied ne bouge pas. Son fond est celui de la page, sous le même
 * voile que les tiroirs. Il se
 * ferme à la croix, au clic à côté ou à Échap ; mais c'est l'appelant qui
 * décide de ce que « fermer » veut dire (il peut d'abord demander de
 * confirmer). Pas de voile sombre, pas de fenêtre : la vitre des tiroirs, à
 * l'endroit du geste.
 */
export function Bloc({
  titre,
  onFermer,
  pied,
  hauteur = 'pleine',
  children,
}: {
  titre: string;
  /** Demandé par la croix, le clic à côté ou Échap. */
  onFermer: () => void;
  /** Les boutons, ANCRÉS AU BAS DU BLOC (2026-09-20, « bouton du bloc encrés
      en bas de bloc, ne change pas de place c'est le reste qui scrolle »). */
  pied?: ReactNode;
  /** `ajustee` : le bloc prend la hauteur de son contenu, et non toute la
      hauteur (2026-09-20, le bloc du poids : « la hauteur du bloc doit etre
      ajustée à la hauteur nécessaire »). */
  hauteur?: 'pleine' | 'ajustee';
  children: ReactNode;
}) {
  const textes = useTextes();
  const bloc = useRef<HTMLDivElement>(null);
  useEffect(() => surClicDehors(() => bloc.current, onFermer), [onFermer]);

  return (
    <>
      <div className="vitre" aria-hidden="true" />
      <div
        className={`bloc${hauteur === 'ajustee' ? ' bloc--ajuste' : ''}`}
        ref={bloc}
        role="dialog"
        aria-label={titre}
      >
        <div className="bloc__entete">
          <h2 className="bloc__titre">{titre}</h2>
          <button type="button" className="tiroir__fermer bloc__fermer" aria-label={textes.fermer} onClick={onFermer}>
            <IconeCroix />
          </button>
        </div>
        <div className="bloc__contenu">{children}</div>
        {pied ? <div className="bloc__pied">{pied}</div> : null}
      </div>
    </>
  );
}
