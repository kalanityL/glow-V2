import { Avatar } from '../components/Avatar';
import {
  IconeActivite,
  IconeAnalyse,
  IconeBalance,
  IconeComprime,
  IconeCrayon,
  IconeEffetsSecondaires,
  IconeJournal,
  IconeMaison,
  IconePlus,
  IconeProfil,
  IconeRecherche,
  IconeReglages,
  IconeRepas,
  IconeSeringue,
  IconeSommeil,
  IconeTempsPourSoi,
} from '../components/Icones';
import { Etoiles, Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { ENTREES_MENU, type EntreeMenu } from '../app/menu';
import { RANGS_MODULES, type ModuleId } from '../app/modules';
import { classeDuTheme } from '../themes/themes';
import type { Reponses } from './onboarding/reponses';

/**
 * L'ACCUEIL — la page où mène le dernier écran de l'onboarding (2026-09-16,
 * « a la fin du formulaire on arrive à la home »).
 *
 * D'APRÈS SES DEUX IMAGES, et rien de plus : l'entête (la marque, la
 * recherche et les préférences en pastilles rondes), le salut (le portrait
 * de l'avatar avec son crayon, « Bonjour » et le prénom, les trois étoiles du
 * logo en doré à la place du soleil), une page vide entre les deux, et le
 * menu du bas (Accueil, Journal, Ajouter en relief, Analyse, Profil).
 * « le logo est celui qui existe deja / les icones sont celles qui existent
 * deja » : la marque est celle de l'entête de l'onboarding, les icônes sont
 * les tracés de la V1 (`components/Icones.tsx`).
 *
 * LES SEPT MODULES, AU-DESSUS DU MENU (2026-09-16, « en bas de page au dessus
 * de notre menu, les 7 icones […] ne rajoute pas de fond / les icones doivent
 * etre celles de la v1 / l'ordre est : traitement poids effets secondaire
 * menu activité sommeil temps pour soi ») : des icônes sans mot, chacune
 * dans un cercle, sur DEUX RANGS EN QUINCONCE — trois en haut, quatre en
 * dessous (2026-09-16, « trait plus fin, chaque icone entourée d'un cercle,
 * 3 icones sur une ligne 4 icones sur la ligne du dessous, disposées en
 * quinconces »). L'ordre se lit rang par rang. Le traitement montre la
 * seringue ou le comprimé selon la forme répondue — la seringue quand rien
 * n'est répondu, comme la V1.
 *
 * RIEN N'EST CLIQUABLE (« les liens ne menent pour l'instant nulle part […]
 * rien de clicable ») : pas un bouton, pas un lien — des blocs, en attendant
 * les pages. Le jour où elles existeront, chaque bloc devient un bouton.
 *
 * POUR L'INSTANT EN THÈME BLANC, QUEL QUE SOIT LE THÈME CHOISI (« peu importe
 * la couleur choisie dans l'onboarding, pour l'instant on arrive sur le theme
 * fond gris blanc ») : provisoire, de son mot.
 */
export function Accueil({ reponses }: { reponses: Reponses }) {
  const textes = useTextes();

  return (
    <div className={`page page--accueil ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        {/* UNE SEULE LIGNE (2026-09-16, « header : logo / glow / recherche/
            parametre tous sur la meme ligne / logo et titre meme hauteur,
            recherche et parametre valigne middle ») : la pastille, le
            mot-symbole à la hauteur de la pastille, les deux outils centrés
            sur la ligne — le tout DEUX FOIS PLUS PETIT que l'entête de
            l'onboarding (2026-09-16, « tous les éléments du header 2x plus
            petits »). La devise « Mon suivi. Mon équilibre. » a été
            retirée le même jour. */}
        <div className="entete entete--accueil">
          <Logomark />
          <Wordmark />
          <div className="entete__outils">
            <span className="rond">
              <IconeRecherche />
            </span>
            <span className="rond">
              <IconeReglages />
            </span>
          </div>
        </div>

        <div className="salut">
          <div className="salut__portrait">
            <div className="salut__cercle">
              <Avatar avatar={reponses.avatar} />
            </div>
            <span className="salut__badge">
              <IconeCrayon />
            </span>
          </div>
          <h1 className="salut__titre">
            {textes.accueil.bonjour(reponses.prenom)}
            <span className="salut__etoiles">
              <Etoiles />
            </span>
          </h1>
        </div>

        {/* La page, vide pour l'instant : c'est la zone qui défilera. */}
        <div className="page__defilant" />
      </div>

      {/* Chaque cercle porte son icône et, dessous, son nom (2026-09-16,
          « cercle plus grand dans les cercle sous les icones le nom ds
          catégories »). Le traitement suit la forme répondue : dessin et
          nom. */}
      <div className="modules">
        {RANGS_MODULES.map((rang) => (
          <div key={rang[0]} className="modules__rang">
            {rang.map((module) => (
              <span key={module} className="module">
                <span className="module__icone">
                  {module === 'traitement'
                    ? reponses.formeTraitement === 'comprime'
                      ? <IconeComprime />
                      : <IconeSeringue />
                    : ICONES_MODULES[module]}
                </span>
                <span className="module__nom">
                  {module === 'traitement' && reponses.formeTraitement
                    ? textes.accueil.traitement[reponses.formeTraitement]
                    : textes.accueil.modules[module]}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* LE MENU EST HORS DE LA COLONNE DE LECTURE : la colonne est bornée à
          380 px, la barre doit aller d'un bord à l'autre de l'écran. */}
      <div className="menu">
          {ENTREES_MENU.map((entree) => (
          <div
            key={entree}
            className={`menu__entree menu__entree--${entree}${entree === 'accueil' ? ' menu__entree--active' : ''}`}
          >
            <span className="menu__icone">{ICONES_MENU[entree]}</span>
            <span className="menu__nom">{textes.accueil.menu[entree]}</span>
          </div>
          ))}
      </div>
    </div>
  );
}

/** L'icône de chaque module — sauf le traitement, qui suit la forme répondue. */
const ICONES_MODULES: Record<Exclude<ModuleId, 'traitement'>, React.ReactNode> = {
  balance: <IconeBalance />,
  'effets-secondaires': <IconeEffetsSecondaires />,
  menus: <IconeRepas />,
  'activite-physique': <IconeActivite />,
  sommeil: <IconeSommeil />,
  'temps-pour-soi': <IconeTempsPourSoi />,
};

/** L'icône de chaque entrée : une par entrée, le type l'exige. */
const ICONES_MENU: Record<EntreeMenu, React.ReactNode> = {
  accueil: <IconeMaison />,
  journal: <IconeJournal />,
  ajouter: <IconePlus />,
  analyse: <IconeAnalyse />,
  profil: <IconeProfil />,
};
