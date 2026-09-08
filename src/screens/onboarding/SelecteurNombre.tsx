import { useTextes } from '../../i18n/useTextes';
import type { Unite } from '../../domaine/unites';
import { useSelecteurOuvert } from './useSelecteurOuvert';

interface SelecteurNombreProps {
  id: string;
  valeur: number | null;
  onValeur: (valeur: number) => void;
  /** Les bornes de la roue, incluses toutes les deux. */
  min: number;
  max: number;
  /** L'unité, posée à côté du champ. Absente pour un nombre qui n'en a pas. */
  unite?: Unite;
  /** La question, qui nomme le sélecteur à qui écoute la page. */
  question: string;
}

/**
 * UN NOMBRE QUI SE CHOISIT DANS UNE ROUE — l'âge, la taille.
 *
 * Même geste que le sélecteur de poids, une roue au lieu de deux : le champ
 * s'ouvre sur une colonne, le cran choisi referme aussitôt puisqu'il n'y a rien
 * d'autre à poser après lui.
 *
 * L'UNITÉ RESTE HORS DU CHAMP, comme partout : dedans, elle se mêlerait au
 * nombre et un lecteur d'écran la dicterait comme une part de la valeur.
 *
 * TANT QUE RIEN N'EST CHOISI, le champ montre un tiret plutôt qu'un nombre :
 * afficher la première valeur de la roue ferait passer un défaut pour une
 * réponse.
 */
export function SelecteurNombre({
  id,
  valeur,
  onValeur,
  min,
  max,
  unite,
  question,
}: SelecteurNombreProps) {
  const textes = useTextes();
  const { ouvert, setOuvert, enveloppe, cranRetenu } = useSelecteurOuvert();
  const crans = Array.from({ length: max - min + 1 }, (_, rang) => min + rang);

  return (
    <div className="selecteur" ref={enveloppe}>
      <button
        type="button"
        id={id}
        className={`selecteur__boite${ouvert ? ' selecteur__boite--ouvert' : ''}`}
        onClick={() => setOuvert((etait) => !etait)}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={question}
      >
        <span className="selecteur__valeur selecteur__valeur--entiere">
          {valeur === null ? '—' : valeur}
        </span>
      </button>

      {unite ? <span className="champ__unite">{textes.unites[unite]}</span> : null}

      {ouvert ? (
        <div className="roues">
          <ul className="roue" role="listbox" aria-label={question}>
            {crans.map((cran) => (
              <li key={cran}>
                <button
                  type="button"
                  ref={cran === valeur ? cranRetenu(0) : undefined}
                  className={`roue__cran${cran === valeur ? ' roue__cran--choisi' : ''}`}
                  role="option"
                  aria-selected={cran === valeur}
                  /* Une seule roue : le choix vaut confirmation et referme. */
                  onClick={() => {
                    onValeur(cran);
                    setOuvert(false);
                  }}
                >
                  {cran}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
