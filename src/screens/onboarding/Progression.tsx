import { useTextes } from '../../i18n/useTextes';

interface ProgressionProps {
  /** Combien d'écrans sont derrière soi. */
  passees: number;
  /** Combien d'écrans compte le parcours, celui-ci compris. */
  total: number;
}

/**
 * LE DÉCOMPTE DES ÉCRANS — des billes, et rien d'autre.
 *
 * AUCUN TEXTE (demande du 2026-09-08) : une bille allumée par écran passé, une
 * bille éteinte par écran qui reste à remplir avant la page d'accueil. Pas de
 * « 3 sur 7 », qui ferait lire un calcul là où un coup d'œil suffit.
 *
 * L'ÉCRAN COURANT COMPTE PARMI CEUX QUI RESTENT, parce qu'il n'est pas encore
 * rempli : sur le premier écran à décompte, aucune bille de sa part n'est
 * allumée, et la dernière ne s'allume qu'une fois la dernière question passée.
 *
 * MUET À L'ŒIL, PAS AUX OREILLES : `role="progressbar"` et son libellé disent
 * la même chose à qui écoute la page, où des billes ne se voient pas. C'est le
 * seul texte, et il ne s'affiche jamais.
 */
export function Progression({ passees, total }: ProgressionProps) {
  const textes = useTextes();

  return (
    <div
      className="progression"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={passees}
      aria-label={textes.progression}
    >
      {Array.from({ length: total }, (_, rang) => (
        <span
          key={rang}
          className={`bille${rang < passees ? ' bille--allumee' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
