import { useId, useRef, type PointerEvent } from 'react';

/** L'ÉTOILE À CINQ BRANCHES — celle d'origine, rétablie (2026-09-21 au
    soir, « remet la forme d'étoile initiale, pas la forme d'étoile du
    logo », après un passage par l'étoile du logo le même soir). */
const ETOILE =
  'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';

/**
 * LA NOTE EN ÉTOILES (2026-09-21, « notez votre nuit ou notez votre sieste :
 * système d'étoiles, 5 étoiles qu'on peut cliquer ou slider pour remplir ;
 * par défaut 3 étoiles remplies ») : cinq étoiles, de 0 à 5 pleines — la
 * qualité de la V1, de 0 à 5. Toucher une étoile la remplit avec celles
 * d'avant ; glisser le doigt sur la rangée remplit au fur et à mesure ;
 * toucher la première étoile pleine seule la vide (le zéro). Le nom de la
 * valeur se dit à qui écoute la page.
 */
export function NoteEtoiles({
  valeur,
  onValeur,
  nom,
  noms,
}: {
  /** De 0 à 5. */
  valeur: number;
  onValeur: (valeur: number) => void;
  nom: string;
  /** Les six mots de l'échelle, de 0 à 5. */
  noms: readonly string[];
}) {
  const rangee = useRef<HTMLDivElement>(null);
  const glisse = useRef(false);
  /* LE DÉGRADÉ DU « + » (2026-09-21, « couleur des étoiles de notation : bleu
     dégradé du bouton + ») : ses deux bouts sont des jetons du thème, posés
     sur les arrêts du dégradé par la feuille. */
  /* L'identifiant de React porte des signes que `url(#…)` ne lit pas : on
     le nettoie. */
  const degrade = `etoiles-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const noteSous = (x: number): number => {
    const r = rangee.current?.getBoundingClientRect();
    if (!r || r.width === 0) return valeur;
    const part = (x - r.left) / r.width;
    return Math.max(0, Math.min(5, Math.ceil(part * 5)));
  };
  const surGlissement = (e: PointerEvent) => {
    if (!glisse.current) return;
    const n = noteSous(e.clientX);
    if (n !== valeur) onValeur(n);
  };

  return (
    <div
      ref={rangee}
      className="etoiles-note"
      role="slider"
      aria-label={nom}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={valeur}
      aria-valuetext={noms[valeur] ?? String(valeur)}
      tabIndex={0}
      onPointerDown={(e) => {
        glisse.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        const n = noteSous(e.clientX);
        /* La seule étoile pleine touchée à nouveau se vide : le zéro. */
        onValeur(n === 1 && valeur === 1 ? 0 : n);
      }}
      onPointerMove={surGlissement}
      onPointerUp={() => {
        glisse.current = false;
      }}
      onPointerCancel={() => {
        glisse.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onValeur(Math.min(5, valeur + 1));
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onValeur(Math.max(0, valeur - 1));
      }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={degrade} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="etoiles-note__debut" />
            <stop offset="1" className="etoiles-note__fin" />
          </linearGradient>
        </defs>
      </svg>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`etoiles-note__etoile${i <= valeur ? ' etoiles-note__etoile--pleine' : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          style={i <= valeur ? { fill: `url(#${degrade})` } : undefined}
        >
          <path d={ETOILE} />
        </svg>
      ))}
    </div>
  );
}
