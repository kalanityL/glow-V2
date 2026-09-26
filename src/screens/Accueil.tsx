import { Avatar } from '../components/Avatar';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import type { ModuleId } from '../app/modules';
import { IconeDuModule } from './iconesModules';
import { Cocarde } from '../components/Cocarde';
import {
  IconeRecherche,
  IconeNotifications,
} from '../components/Icones';
import { Etoiles, Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { RANGS_MODULES } from '../app/modules';
import { classeDuTheme } from '../themes/themes';
import type { Reponses } from './onboarding/reponses';
import type { FondId } from '../app/fonds';

/** Le fond de page tel que `App` le tient : l'enregistré, l'aperçu, les
    gestes — et le bloc « Thème », ouvert ou non, qu'on ouvre depuis le
    tiroir ou d'UN CLIC SUR LE FOND de n'importe quelle page (2026-09-20). */
export interface FondProps {
  courant: FondId;
  apercu: FondId | null;
  onApercu: (fond: FondId | null) => void;
  onChoisir: (fond: FondId) => void;
  blocOuvert: boolean;
  onOuvrirBloc: () => void;
  onFermerBloc: () => void;
}

/**
 * UN CLIC SUR LE FOND (2026-09-20, « clique sur fond d'écran depuis n'importe
 * quelle page : ouvre comme si on avait cliqué sur menu couleur » — puis
 * 2026-09-21, « clic sur fond de page ouvre theme => sauf si un formulaire
 * est ouvert ; uniquement sur la home page ») : le clic qui tombe sur
 * l'élément lui-même, et non sur un de ses enfants — une carte, une
 * pastille, un bouton, une vitre —, ouvre le bloc « Thème ». SUR L'ACCUEIL
 * SEULEMENT : les autres pages ne l'écoutent plus.
 */
export function surLeFond(onOuvrir: () => void) {
  return (evenement: React.MouseEvent) => {
    if (evenement.target === evenement.currentTarget) onOuvrir();
  };
}

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
 * PREMIÈRE EXCEPTION (2026-09-19) : le portrait, qui ouvre la page Profil ;
 * « Menu » dans la barre, qui ouvre le tiroir du menu principal ; et « + »
 * (2026-09-20), qui ouvre le tiroir d'ajout.
 *
 * POUR L'INSTANT EN THÈME BLANC, QUEL QUE SOIT LE THÈME CHOISI (« peu importe
 * la couleur choisie dans l'onboarding, pour l'instant on arrive sur le theme
 * fond gris blanc ») : provisoire, de son mot.
 */
export function Accueil({
  reponses,
  onOuvrirCompte,
  onJournal,
  fond,
  onAjouter,
  ajoutTraitement,
}: {
  reponses: Reponses;
  /** Le fond de page et ses gestes, tenus par `App`. */
  fond: FondProps;
  /** Le portrait ouvre la page « Mon compte » (2026-09-19), et l'entrée
      « Mon compte » du tiroir aussi. */
  onOuvrirCompte: () => void;
  /** La page Journal, par la barre du bas (2026-09-26). */
  onJournal: () => void;
  /** Une case du tiroir du « + » : voir `App`. */
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
}) {
  const textes = useTextes();
  /* LE MENU PRINCIPAL EN TIROIR (2026-09-19) : ouvert par l'entrée « Menu »
     de la barre, fermé par sa croix, par un clic à côté ou par « Menu » de
     nouveau. */
  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
      onClick={surLeFond(fond.onOuvrirBloc)}
    >
      <div className="page__colonne" onClick={surLeFond(fond.onOuvrirBloc)}>
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
            <p className="entete__devise">
              {textes.accueil.devise.debut}
              <span className="entete__devise-fin">{textes.accueil.devise.fin}</span>
            </p>
          </div>
          <div className="entete__outils">
            <span className="rond">
              <IconeRecherche />
            </span>
            <span className="rond">
              {/* La cloche des notifications, à la place de la roue des
                  préférences (2026-09-19) : les préférences sont dans le
                  menu principal. */}
              <IconeNotifications />
            </span>
          </div>
        </div>

        <div className="salut">
          {/* LE PORTRAIT OUVRE LE PROFIL (2026-09-19, « clic sur avatar ouvre
              une page profil ») : le seul geste de l'accueil qui mène quelque
              part, pour l'instant. */}
          <button
            type="button"
            className="salut__portrait"
            aria-label={textes.compte.titre}
            onClick={onOuvrirCompte}
          >
            <div className="salut__cercle">
              <Avatar avatar={reponses.avatar} />
            </div>
          </button>
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
            </span>
          </div>
        </div>

        {/* La page, vide pour l'instant : c'est la zone qui défilera. */}
        <div className="page__defilant" onClick={surLeFond(fond.onOuvrirBloc)} />
      </div>

      {/* Chaque module : sa pastille avec l'icône, SANS NOM VISIBLE
          (2026-09-17, « ne pas mettre les noms sous les cercles » — le
          2026-09-16 le nom était dans le cercle, le matin du 17 sous lui).
          Le nom reste dit à qui écoute la page, en `aria-label`. Le
          traitement suit la forme répondue : dessin et nom. */}
      <div className="modules" onClick={surLeFond(fond.onOuvrirBloc)}>
        {RANGS_MODULES.map((rang) => (
          <div key={rang[0]} className="modules__rang" onClick={surLeFond(fond.onOuvrirBloc)}>
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
                <IconeDuModule module={module} forme={reponses.formeTraitement} />
              </span>
            ))}
          </div>
        ))}
      </div>

      <BarreDuBas
        active="accueil"
        onAccueil={() => undefined}
        onOuvrirCompte={onOuvrirCompte}
        onJournal={onJournal}
        forme={reponses.formeTraitement}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
