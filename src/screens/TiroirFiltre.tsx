import { useRef } from 'react';
import { Tiroir } from '../components/Tiroir';
import { useTextes } from '../i18n/useTextes';
import { MODULES, type ModuleId } from '../app/modules';
import type { Forme } from '../domaine/traitements';
import { IconeDuModule } from './iconesModules';
import { IconeCoche } from '../components/Icones';

/**
 * LE TIROIR DU FILTRE DU JOURNAL (2026-09-26, son template
 * « écran-filtre.png ») : le panneau qui monte de la barre du bas — le cadre
 * commun des tiroirs, donc pas un popup —, « Catégories » et LES HUIT
 * MODULES en tuiles cochables, quatre par rangée comme sur son image.
 *
 * DE L'IMAGE : la mise en page — quatre colonnes, la pastille ronde, le nom
 * dessous sur deux lignes s'il le faut, la coche en haut à droite d'une case
 * retenue, et les cases écartées en pâle. PAS de l'image, comme pour le
 * tiroir du « + » : ses icônes (les nôtres, `IconeDuModule` — « utilise
 * evidemment nos icones pas celles des templates ») et ses mots (les nôtres,
 * ceux de VOCABULAIRE : « Balance » et non « Poids », « Menus » et non
 * « Repas », « Marche » et non « Pas », « Un Temps pour Soi »).
 *
 * Le filtre agit tout de suite : il n'y a rien à valider. « Réinitialiser »
 * recoche tout — c'est l'état de départ.
 *
 * LA RANGÉE DU PIED (2026-09-26, « filtrer : gros bouton annuler / fermer en
 * bas ») : deux boutons pleine largeur, sous le filet que montre son image.
 * Comme le filtre agit à chaque clic, « Annuler » a un vrai travail : il REND
 * LE FILTRE TEL QU'IL ÉTAIT À L'OUVERTURE du tiroir — ce que « Réinitialiser »
 * ne fait pas, lui qui recoche TOUT — puis ferme. « Fermer », à l'accent,
 * garde le filtre qu'on vient de poser.
 */
export function TiroirFiltre({
  onFermer,
  onFermee,
  enFermeture,
  bouton,
  forme,
  retenus,
  onBasculer,
  onReinitialiser,
  onRetablir,
}: {
  onFermer: () => void;
  onFermee: () => void;
  enFermeture: boolean;
  bouton: () => Element | null;
  /** La forme du traitement répondue, pour l'icône et le nom de sa case. */
  forme: Forme | null;
  /** Les catégories retenues ; les autres sont écartées de la liste. */
  retenus: readonly ModuleId[];
  onBasculer: (module: ModuleId) => void;
  onReinitialiser: () => void;
  /** « Annuler » : remet les catégories qu'on avait en ouvrant. */
  onRetablir: (retenus: readonly ModuleId[]) => void;
}) {
  const textes = useTextes();
  const tousRetenus = retenus.length === MODULES.length;
  /* Le filtre tel qu'il était à l'ouverture, retenu une fois pour toutes :
     c'est ce que « Annuler » rend. */
  const aLOuverture = useRef(retenus);

  return (
    <Tiroir nom={textes.journal.filtrer} onFermer={onFermer} onFermee={onFermee} enFermeture={enFermeture} bouton={bouton}>
      {/* Sur la ligne de la croix, sans ligne dessous, à l'encre — la règle
          du tiroir du « + » (2026-09-20). */}
      <h2 className="tiroir__titre tiroir__titre--entete">{textes.journal.filtrer}</h2>
      <div className="filtre__intitule">
        <h3 className="filtre__groupe">{textes.journal.categories}</h3>
        {/* Un lien à l'encre et souligné, la charte des formulaires — pas un
            texte en bleu. IL DISPARAÎT QUAND TOUT EST DÉJÀ COCHÉ (2026-09-26,
            « réinitialiser disparait s'il est desativé ») : il ne ferait rien,
            et un lien éteint n'apprend rien à personne. */}
        {tousRetenus ? null : (
          <button type="button" className="filtre__reinitialiser" onClick={onReinitialiser}>
            {textes.journal.reinitialiser}
          </button>
        )}
      </div>
      <div className="filtre__cases">
        {MODULES.map((module) => {
          const retenu = retenus.includes(module);
          return (
            <button
              key={module}
              type="button"
              role="checkbox"
              aria-checked={retenu}
              className={`filtre__case${retenu ? ' filtre__case--retenue' : ''}`}
              onClick={() => onBasculer(module)}
            >
              <span className="filtre__pastille">
                <IconeDuModule module={module} forme={forme} />
                {retenu ? (
                  <span className="filtre__coche" aria-hidden="true">
                    <IconeCoche />
                  </span>
                ) : null}
              </span>
              <span className="filtre__nom">
                {module === 'traitement' && forme ? textes.accueil.traitement[forme] : textes.accueil.modules[module]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="filtre__pied">
        <button
          type="button"
          className="bouton bouton--second"
          onClick={() => {
            onRetablir(aLOuverture.current);
            onFermer();
          }}
        >
          {textes.journal.annuler}
        </button>
        <button type="button" className="bouton" onClick={onFermer}>
          {textes.fermer}
        </button>
      </div>
    </Tiroir>
  );
}
