import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Avatar } from '../components/Avatar';
import {
  IconeActivite,
  IconeAnalyse,
  IconeBalance,
  IconeComprime,
  IconeCrayon,
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
import { rgbDepuisHex, teinteDePastille } from '../domaine/couleurs';
import { adresseDeLImage, pixelsDeLImage, proprieteCalculee } from '../plateforme/navigateur';
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
 * menu activité sommeil temps pour soi », puis « ajouter marche entre menus
 * et activité physique dusposition 4 et 4 alignés ») : huit cercles sur DEUX
 * RANGS ALIGNÉS de quatre — le quinconce de trois puis quatre a vécu de
 * l'après-midi au soir du 2026-09-16. L'ordre se lit rang par rang. Le
 * cercles sont des PASTILLES COLORÉES (2026-09-16, « pastilles colorees en
 * guise de cercles »), TOUTES DE LA MÊME COULEUR, CALCULÉE DEPUIS LA PHOTO DE
 * FOND À L'EXÉCUTION — « pareil que ce que fait youtube pour la couleur du
 * cadre qui change en fonction de l'image de la video » : la plateforme lit
 * les pixels de l'image que le thème donne à la page et le bleu du menu, le
 * domaine en tire la teinte de pastille (la teinte vive dominante de la
 * photo, hors jaune et orange, moyennée avec celle du menu), et elle est posée sur la page en propriété
 * `--module-fond`, que `dessins.css` consomme (avec une valeur de repli tant
 * qu'elle n'est pas lue). C'est la seule couleur en `style` de l'accueil,
 * et pour la même raison que le nuancier de l'avatar : elle n'existe qu'à
 * l'exécution. Le traitement montre la
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
  const page = useRef<HTMLDivElement>(null);
  const [teintePastille, setTeintePastille] = useState<string | null>(null);

  /* La couleur se lit une fois la page montée — la photo et le bleu du menu
     viennent du thème posé sur elle. Si la lecture échoue, la pastille
     garde sa couleur de repli. */
  useEffect(() => {
    let vivant = true;
    const url = adresseDeLImage(proprieteCalculee(page.current, '--accueil-fond-image'));
    const accentMenu = rgbDepuisHex(proprieteCalculee(page.current, '--menu-actif'));
    if (!url) return;
    pixelsDeLImage(url).then((pixels) => {
      if (vivant && pixels) setTeintePastille(teinteDePastille(pixels, accentMenu));
    });
    return () => {
      vivant = false;
    };
  }, []);

  const proprietes = (
    teintePastille ? { '--module-fond': teintePastille } : {}
  ) as CSSProperties;

  return (
    <div
      ref={page}
      className={`page page--accueil ${classeDuTheme('blanc')}`}
      style={proprietes}
    >
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
