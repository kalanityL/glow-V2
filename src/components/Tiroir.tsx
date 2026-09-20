import { useEffect, useRef, type ReactNode } from 'react';
import { IconeCroix } from './Icones';
import { useTextes } from '../i18n/useTextes';
import { surClicDehors } from '../plateforme/navigateur';

/**
 * LE CADRE D'UN TIROIR — ce que le menu principal et le « + » ont en commun
 * (2026-09-20, « bouton + du menu du bas : ouvre un tiroir meme fonctionnalité
 * que v1 avec le style actuel de v2 ») : la vitre floue sur la page, le
 * panneau qui monte depuis la barre du bas sur la photo de la page, sa
 * poignée, sa croix, ses mouvements d'ouverture et de fermeture, et sa
 * fermeture au clic à côté ou à Échap — le mécanisme du panneau des roues,
 * qui n'est pas un popup au sens des guidelines. Le contenu vient de
 * l'appelant.
 */
export function Tiroir({
  nom,
  onFermer,
  onFermee,
  enFermeture,
  bouton,
  children,
}: {
  /** Le nom du tiroir, pour qui écoute la page. */
  nom: string;
  /** Demande la fermeture : le tiroir redescend. */
  onFermer: () => void;
  /** Le tiroir a fini de redescendre : il peut se démonter. */
  onFermee: () => void;
  /** Vrai le temps de la descente. */
  enFermeture: boolean;
  /** Le bouton de la barre qui l'ouvre : un clic dessus n'est pas « à côté ». */
  bouton: () => Element | null;
  children: ReactNode;
}) {
  const textes = useTextes();
  const tiroir = useRef<HTMLDivElement>(null);

  /* Le clic à côté et Échap ferment — comme les roues. Le bouton qui ouvre le
     tiroir n'est PAS « à côté » (2026-09-20, « clic menu ouvre menu ; reclic
     menu ferme menu ») : c'est lui qui bascule, et le clic à côté fermait
     juste avant qu'il ne rouvre. */
  useEffect(
    () => surClicDehors(() => [tiroir.current, bouton()], onFermer),
    [onFermer, bouton],
  );

  return (
    <>
      <div className={`vitre${enFermeture ? ' vitre--fermeture' : ''}`} aria-hidden="true" />
      <div
        className={`tiroir${enFermeture ? ' tiroir--fermeture' : ''}`}
        ref={tiroir}
        role="dialog"
        aria-label={nom}
        /* La descente finie, le tiroir se démonte — c'est son mouvement qui
           le dit, pas une minuterie à côté. */
        onAnimationEnd={enFermeture ? onFermee : undefined}
      >
        <div className="tiroir__poignee" aria-hidden="true" />
        <button type="button" className="tiroir__fermer" aria-label={textes.fermer} onClick={onFermer}>
          <IconeCroix />
        </button>
        <div className="tiroir__contenu">{children}</div>
      </div>
    </>
  );
}
