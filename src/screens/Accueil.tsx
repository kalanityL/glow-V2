import { Avatar } from '../components/Avatar';
import { Cocarde } from '../components/Cocarde';
import {
  IconeActivite,
  IconeAnalyse,
  IconeBalance,
  IconeCadenas,
  IconeComprime,
  IconeEffetsSecondaires,
  IconeJournal,
  IconeEtoiles,
  IconeMarche,
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
 * de l'avatar — son crayon d'édition retiré le 2026-09-17 —, « Bonjour » et le prénom, les trois étoiles du
 * logo en doré à la place du soleil), une page vide entre les deux, et le
 * menu du bas (Accueil, Journal, Ajouter en relief, Analyse, Profil).
 * « le logo est celui qui existe deja / les icones sont celles qui existent
 * deja » : la marque est celle de l'entête de l'onboarding, les icônes sont
 * les tracés de la V1 (`components/Icones.tsx`).
 *
 * LES SEPT MODULES, AU-DESSUS DU MENU (2026-09-16, « en bas de page au dessus
 * de notre menu, les 7 icones […] ne rajoute pas de fond / les icones doivent
 * etre celles de la v1 / l'ordre est : traitement poids effets secondaire
 * menu activité sommeil temps pour soi », puis « ajouter marche entre menus
 * et activité physique dusposition 4 et 4 alignés ») : huit cercles sur DEUX
 * RANGS ALIGNÉS de quatre — le quinconce de trois puis quatre a vécu de
 * l'après-midi au soir du 2026-09-16. L'ordre se lit rang par rang. Le
 * cercles sont des PASTILLES (2026-09-16, « pastilles colorees en guise de
 * cercles ») toutes de la même couleur, le Gris 50 de la palette (2026-09-17,
 * « couleur des pastilles : le gris blanc de la palquette ») — un jeton du
 * thème, `--module-fond`. Le calcul « comme YouTube » depuis la photo de
 * fond (2026-09-16) a vécu un jour ; il est dans l'historique (`129a7c9`).
 * Le traitement montre la
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
            mot-symbole, les deux outils centrés sur la ligne. La devise
            « Mon suivi. Mon équilibre. » a été retirée le 2026-09-16 ; le
            2026-09-17, la marque reprend l'entête de la V1 — logo,
            mot-symbole et devise « ready, shine, glow! ». */}
        <div className="entete entete--accueil">
          <Logomark />
          {/* COMME LA V1 (2026-09-17, « logo et glp1low comme sur v1 avec
              ready shine glow en dessous ») : le mot-symbole et, dessous, la
              devise. Les tailles sont celles de l'entête de la home de la
              V1, dans `page.css`. */}
          <div className="entete__marque">
            <Wordmark />
            <p className="entete__devise">{textes.accueil.devise}</p>
          </div>
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
          </div>
          <div className="salut__texte">
            <h1 className="salut__titre">
              {textes.accueil.bonjour(reponses.prenom)}
              <span className="salut__etoiles">
                <Etoiles />
              </span>
            </h1>
            {/* L'EMPLACEMENT D'UN BADGE, sous le salut (2026-09-17, « sous
                bonjour mettre un placeholder de la meme forme qu'un badge
                (rond avec collerette) ») : la cocarde vide, en attendant
                les badges. */}
            <span className="salut__cocarde">
              <Cocarde />
              {/* Le cadenas, au centre du rond : le badge n'est pas encore
                  gagné (2026-09-17, « mettre un cadenas sur le coin haut
                  droit du badge », puis « cadenas plus gros et centré sur le
                  placeholder »). */}
              <span className="salut__cadenas">
                <IconeCadenas />
              </span>
            </span>
          </div>
        </div>

        {/* La page, vide pour l'instant : c'est la zone qui défilera. */}
        <div className="page__defilant" />
      </div>

      {/* Chaque module : sa pastille avec l'icône, SANS NOM VISIBLE
          (2026-09-17, « ne pas mettre les noms sous les cercles » — le
          2026-09-16 le nom était dans le cercle, le matin du 17 sous lui).
          Le nom reste dit à qui écoute la page, en `aria-label`. Le
          traitement suit la forme répondue : dessin et nom. */}
      <div className="modules">
        {RANGS_MODULES.map((rang) => (
          <div key={rang[0]} className="modules__rang">
            {rang.map((module) => (
              <span
                key={module}
                className={`module module--${module}`}
                role="img"
                aria-label={
                  module === 'traitement' && reponses.formeTraitement
                    ? textes.accueil.traitement[reponses.formeTraitement]
                    : textes.accueil.modules[module]
                }
              >
                {module === 'traitement'
                  ? reponses.formeTraitement === 'comprime'
                    ? <IconeComprime />
                    : <IconeSeringue />
                  : ICONES_MODULES[module]}
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
  marche: <IconeMarche />,
  'activite-physique': <IconeActivite />,
  sommeil: <IconeSommeil />,
  'temps-pour-soi': <IconeTempsPourSoi />,
};

/** L'icône de chaque entrée : une par entrée, le type l'exige. */
const ICONES_MENU: Record<EntreeMenu, React.ReactNode> = {
  accueil: <IconeEtoiles />,
  journal: <IconeJournal />,
  ajouter: <IconePlus />,
  analyse: <IconeAnalyse />,
  profil: <IconeProfil />,
};
