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
}) {
  const textes = useTextes();
  const tousRetenus = retenus.length === MODULES.length;

  return (
    <Tiroir nom={textes.journal.filtrer} onFermer={onFermer} onFermee={onFermee} enFermeture={enFermeture} bouton={bouton}>
      {/* Sur la ligne de la croix, sans ligne dessous, à l'encre — la règle
          du tiroir du « + » (2026-09-20). */}
      <h2 className="tiroir__titre tiroir__titre--entete">{textes.journal.filtrer}</h2>
      <div className="filtre__intitule">
        <h3 className="filtre__groupe">{textes.journal.categories}</h3>
        {/* Un lien à l'encre et souligné, la charte des formulaires — pas un
            texte en bleu. Éteint quand tout est déjà coché : il ne ferait rien. */}
        <button type="button" className="filtre__reinitialiser" disabled={tousRetenus} onClick={onReinitialiser}>
          {textes.journal.reinitialiser}
        </button>
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
    </Tiroir>
  );
}
