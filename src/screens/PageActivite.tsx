import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { CATEGORIES_ACTIVITE } from '../domaine/activites';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
import { IndiceDefilement } from '../components/IndiceDefilement';

/**
 * LA PAGE D'UNE ACTIVITÉ PHYSIQUE (2026-09-25, son image « Ajouter une
 * activité » : « on va créer la page ajouter une activité physique (pas de
 * couleur vert, reprends juste l'idée, remplace le vert par notre bleu de
 * pastille bleu) […] pour la recherche laisse la blank, on s'occupera apres
 * de la fonctionnalité de recherche et son design ») : la case « Activité
 * Physique » du tiroir du « + » y mène. L'entête des pages, la barre du
 * bas ; « Catégories » et ses neuf tuiles — la pastille bleue du tiroir du
 * « + » avec l'icône de la catégorie (ses planches, en masques que le thème
 * peint), le nom dessous. RIEN DE VERT : les couleurs sont celles des
 * pastilles du « + ». PAS DE RECHERCHE ENCORE, ni de liste des activités
 * récentes (aucune activité n'est enregistrée) : les tuiles sont des
 * blocs, pas des boutons, tant que la liste d'une catégorie n'existe pas.
 */
export function PageActivite({
  forme,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  ajoutTraitement,
  fond,
}: {
  forme: Forme | null;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.modules['activite-physique']} onAccueil={onAccueil} />

        <div className="activite">
          <h2 className="activite__titre">{textes.activite.categories}</h2>
          <div className="categories">
            {CATEGORIES_ACTIVITE.map((categorie) => (
              <div key={categorie} className={`categorie categorie--${categorie}`}>
                <span className="categorie__pastille">
                  <span className="categorie__icone" aria-hidden="true" />
                </span>
                <span className="categorie__nom">{textes.activite.categorie[categorie]}</span>
              </div>
            ))}
          </div>
          <IndiceDefilement />
        </div>
      </div>

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={onOuvrirCompte}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
