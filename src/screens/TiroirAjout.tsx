import { Tiroir } from '../components/Tiroir';
import { useTextes } from '../i18n/useTextes';
import { MODULES_AJOUT, type ModuleId } from '../app/modules';
import type { Forme } from '../domaine/traitements';
import { IconeDuModule } from './iconesModules';
import { IconeChevronDroit } from '../components/Icones';

/**
 * LE TIROIR DU « + » (2026-09-20, « bouton + du menu du bas : ouvre un tiroir
 * meme fonctionnalité que v1 avec le style actuel de v2 ») : LA FONCTION DE
 * LA V1 (`addDrawerItems`, le tiroir « ajout ») — les sept modules qui ont un
 * formulaire d'ajout, DEUX par rangée et le nom sur une seule ligne, sous le
 * titre « Que souhaitez-vous ajouter ? » (2026-09-20), chacun par son icône
 * et son nom, dans
 * l'ordre de la V1 ; toucher une case mène à la page du module avec son
 * formulaire d'ajout ouvert (« menu + : envoie sur les pages avec formulaire
 * d'ajout ouvert », 2026-08-25). Le cadre commun des tiroirs.
 *
 * LES CASES SONT DES CARTES DEPUIS LE 2026-09-25 (« nouveau design pour me
 * menu + dans ../images pour claude / menu-plus.png / ne mets pas les sous
 * titres des catégories, garde nos icones la croix de fermeture et nos
 * textes ») : d'après son image, chaque case est une carte blanche — la
 * pastille ronde bleu pâle avec l'icône en bleu, un chevron en haut à
 * droite, le nom en gras dessous, sur deux lignes s'il le faut. Rien de
 * l'image au-delà de la mise en page et des couleurs (relevées au pixel,
 * dans `page.css` et les jetons `--ajout-*` des thèmes) : pas de
 * sous-titre, NOS icônes (`IconeDuModule`), NOTRE titre et NOTRE croix.
 *
 * Le nom du traitement suit la forme répondue (« Injections », « Comprimé »),
 * comme dans la V1 selon la marque. Un module éteint restera visible en
 * grisé et inerte (la V1, « oui en grisé ») le jour où les modules
 * s'éteindront.
 *
 * LA CASE DU TRAITEMENT MÈNE À LA PAGE D'UNE PRISE (2026-09-20,
 * « ajouter->injection : envoie vers une page ultra simple avec uniquement
 * le formulaire d'ajout d'injection de la v1 ») ; les autres n'ont pas
 * encore de page.
 */
export function TiroirAjout({
  onFermer,
  onFermee,
  enFermeture,
  bouton,
  forme,
  onAjouter,
}: {
  onFermer: () => void;
  onFermee: () => void;
  enFermeture: boolean;
  bouton: () => Element | null;
  /** La forme du traitement répondue, pour l'icône et le nom de sa case. */
  forme: Forme | null;
  /** Une case touchée : le module dont on veut ajouter quelque chose. */
  onAjouter: (module: ModuleId) => void;
}) {
  const textes = useTextes();

  return (
    <Tiroir
      nom={textes.accueil.menu.ajouter}
      onFermer={onFermer}
      onFermee={onFermee}
      enFermeture={enFermeture}
      bouton={bouton}
    >
      {/* Sur la ligne de la croix, sans ligne dessous, à l'encre (2026-09-20). */}
      <h2 className="tiroir__titre tiroir__titre--entete">{textes.accueil.questionAjout}</h2>
      <div className="tiroir__cases">
        {MODULES_AJOUT.map((module) => (
          <button key={module} type="button" className="tiroir__case" onClick={() => onAjouter(module)}>
            <span className="tiroir__icone">
              <IconeDuModule module={module} forme={forme} />
            </span>
            {/* Le chevron de l'image, en haut à droite : décoratif, la carte
                entière est le geste. */}
            <span className="tiroir__case-chevron" aria-hidden="true">
              <IconeChevronDroit />
            </span>
            <span className="tiroir__case-nom">
              {module === 'traitement' && forme
                ? textes.accueil.traitement[forme]
                : textes.accueil.modules[module]}
            </span>
          </button>
        ))}
      </div>
    </Tiroir>
  );
}
