import { Tiroir } from '../components/Tiroir';
import { useTextes } from '../i18n/useTextes';
import { MODULES_AJOUT } from '../app/modules';
import type { Forme } from '../domaine/traitements';
import { IconeDuModule } from './iconesModules';

/**
 * LE TIROIR DU « + » (2026-09-20, « bouton + du menu du bas : ouvre un tiroir
 * meme fonctionnalité que v1 avec le style actuel de v2 ») : LA FONCTION DE
 * LA V1 (`addDrawerItems`, le tiroir « ajout ») — les sept modules qui ont un
 * formulaire d'ajout, DEUX par rangée et le nom sur une seule ligne, sous le
 * titre « Que souhaitez-vous ajouter ? » (2026-09-20), chacun par son icône
 * et son nom, dans
 * l'ordre de la V1 ; toucher une case mène à la page du module avec son
 * formulaire d'ajout ouvert (« menu + : envoie sur les pages avec formulaire
 * d'ajout ouvert », 2026-08-25). LE STYLE DE LA V2 : le cadre commun des
 * tiroirs, l'icône sur sa pastille bleu clair, le nom à l'encre.
 *
 * Le nom du traitement suit la forme répondue (« Injections », « Comprimé »),
 * comme dans la V1 selon la marque. Un module éteint restera visible en
 * grisé et inerte (la V1, « oui en grisé ») le jour où les modules
 * s'éteindront.
 *
 * AUCUNE CASE NE MÈNE ENCORE NULLE PART : les pages n'existent pas.
 */
export function TiroirAjout({
  onFermer,
  onFermee,
  enFermeture,
  bouton,
  forme,
}: {
  onFermer: () => void;
  onFermee: () => void;
  enFermeture: boolean;
  bouton: () => Element | null;
  /** La forme du traitement répondue, pour l'icône et le nom de sa case. */
  forme: Forme | null;
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
      <h2 className="tiroir__titre">{textes.accueil.questionAjout}</h2>
      <div className="tiroir__cases">
        {MODULES_AJOUT.map((module) => (
          <div key={module} className="tiroir__case">
            <span className="tiroir__icone">
              <IconeDuModule module={module} forme={forme} />
            </span>
            <span className="tiroir__case-nom">
              {module === 'traitement' && forme
                ? textes.accueil.traitement[forme]
                : textes.accueil.modules[module]}
            </span>
          </div>
        ))}
      </div>
    </Tiroir>
  );
}
