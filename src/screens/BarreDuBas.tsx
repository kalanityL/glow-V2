import { useCallback, useRef, useState } from 'react';
import type { ModuleId } from '../app/modules';
import {
  IconeAnalyse,
  IconeEtoiles,
  IconeJournal,
  IconeMenu,
  IconePlus,
} from '../components/Icones';
import { useTextes } from '../i18n/useTextes';
import { ENTREES_MENU, type EntreeMenu } from '../app/menu';
import type { Forme } from '../domaine/traitements';
import { TiroirAjout } from './TiroirAjout';
import { TiroirMenu } from './TiroirMenu';
import { BlocTheme } from './BlocTheme';
import type { FondProps } from './Accueil';

/**
 * LA BARRE DU BAS ET SES DEUX TIROIRS — communs à toutes les pages de
 * l'application (2026-09-20, « mon compte est une page à part entiere : le
 * menu du bas apparait ») : sortis de l'accueil, où ils sont nés.
 *
 * Les entrées : « Accueil » ramène à l'accueil ; « + » et « Menu » ouvrent
 * leur tiroir ; « Journal » et « Analyse » attendent leurs pages. L'entrée de
 * la page courante est allumée.
 *
 * DEUX TIROIRS, chacun en trois états : fermé, ouvert, et EN FERMETURE — le
 * tiroir reste monté le temps de redescendre, puis se démonte quand son
 * mouvement finit. OUVRIR L'UN FERME L'AUTRE EN MÊME TEMPS (« si un autre
 * tiroir est déjà ouvert, ferme le tiroir ouvert et ouvre le tiroir + en
 * meme temps et inversement ») : c'est le clic « à côté » de l'ouvert qui le
 * ferme, et le bouton du nouveau qui l'ouvre, dans le même geste. Les
 * tiroirs sont rendus AVANT la barre, dans la page : la barre garde le
 * dessus.
 */
export function BarreDuBas({
  active,
  onAccueil,
  onOuvrirCompte,
  forme,
  fond,
  onAjouter,
}: {
  /** L'entrée de la page courante, allumée. */
  active: EntreeMenu | null;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  /** La forme du traitement répondue, pour la case du tiroir d'ajout. */
  forme: Forme | null;
  /** LE FOND DE PAGE, pour le bloc « Thème » : l'enregistré, l'aperçu, et les
      deux gestes — voir `App`, qui tient l'aperçu pour toute page. */
  fond: FondProps;
  /** Une case du tiroir du « + » touchée : le tiroir se ferme, la page change. */
  onAjouter: (module: ModuleId) => void;
}) {
  const textes = useTextes();

  type EtatTiroir = 'ferme' | 'ouvert' | 'fermeture';
  const [tiroirs, setTiroirs] = useState<Record<'menu' | 'ajout', EtatTiroir>>({
    menu: 'ferme',
    ajout: 'ferme',
  });
  const fermer = (lequel: 'menu' | 'ajout') =>
    setTiroirs((etats) => (etats[lequel] === 'ouvert' ? { ...etats, [lequel]: 'fermeture' } : etats));
  const ferme = (lequel: 'menu' | 'ajout') => setTiroirs((etats) => ({ ...etats, [lequel]: 'ferme' }));
  const basculer = (lequel: 'menu' | 'ajout') =>
    setTiroirs((etats) => ({ ...etats, [lequel]: etats[lequel] === 'ouvert' ? 'fermeture' : 'ouvert' }));
  const fermerMenu = useCallback(() => fermer('menu'), []);
  const menuFerme = useCallback(() => ferme('menu'), []);
  const fermerAjout = useCallback(() => fermer('ajout'), []);
  const ajoutFerme = useCallback(() => ferme('ajout'), []);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const leBoutonMenu = useCallback(() => boutonMenu.current, []);
  const boutonAjout = useRef<HTMLButtonElement>(null);
  const leBoutonAjout = useCallback(() => boutonAjout.current, []);

  return (
    <>
      {tiroirs.menu !== 'ferme' ? (
        <TiroirMenu
          onFermer={fermerMenu}
          onFermee={menuFerme}
          enFermeture={tiroirs.menu === 'fermeture'}
          onOuvrirCompte={onOuvrirCompte}
          onOuvrirCouleurs={fond.onOuvrirBloc}
          bouton={leBoutonMenu}
        />
      ) : null}
      {fond.blocOuvert ? (
        <BlocTheme
          courant={fond.courant}
          apercu={fond.apercu}
          onApercu={fond.onApercu}
          onChoisir={(choix) => {
            fond.onChoisir(choix);
            fond.onFermerBloc();
          }}
          onFermer={fond.onFermerBloc}
        />
      ) : null}
      {tiroirs.ajout !== 'ferme' ? (
        <TiroirAjout
          onFermer={fermerAjout}
          onFermee={ajoutFerme}
          enFermeture={tiroirs.ajout === 'fermeture'}
          bouton={leBoutonAjout}
          forme={forme}
          onAjouter={(module) => {
            fermerAjout();
            onAjouter(module);
          }}
        />
      ) : null}

      {/* LA BARRE EST HORS DE LA COLONNE DE LECTURE : la colonne est bornée à
          380 px, la barre doit aller d'un bord à l'autre de l'écran. */}
      <div className="menu">
        {ENTREES_MENU.map((entree) => {
          const contenu = (
            <>
              <span className="menu__icone">{ICONES_MENU[entree]}</span>
              <span className="menu__nom">{textes.accueil.menu[entree]}</span>
            </>
          );
          if (entree === 'menu') {
            return (
              <button
                key={entree}
                ref={boutonMenu}
                type="button"
                className={`menu__entree menu__entree--menu menu__entree--bouton${tiroirs.menu !== 'ferme' ? ' menu__entree--active' : ''}`}
                aria-expanded={tiroirs.menu === 'ouvert'}
                onClick={() => basculer('menu')}
              >
                {contenu}
              </button>
            );
          }
          if (entree === 'ajouter') {
            return (
              <button
                key={entree}
                ref={boutonAjout}
                type="button"
                className="menu__entree menu__entree--ajouter menu__entree--bouton"
                aria-expanded={tiroirs.ajout === 'ouvert'}
                onClick={() => basculer('ajout')}
              >
                {contenu}
              </button>
            );
          }
          if (entree === 'accueil') {
            return (
              <button
                key={entree}
                type="button"
                className={`menu__entree menu__entree--accueil menu__entree--bouton${active === 'accueil' ? ' menu__entree--active' : ''}`}
                aria-current={active === 'accueil' ? 'page' : undefined}
                onClick={onAccueil}
              >
                {contenu}
              </button>
            );
          }
          return (
            <div
              key={entree}
              className={`menu__entree menu__entree--${entree}${active === entree ? ' menu__entree--active' : ''}`}
            >
              {contenu}
            </div>
          );
        })}
      </div>
    </>
  );
}

/** L'icône de chaque entrée : une par entrée, le type l'exige. */
const ICONES_MENU: Record<EntreeMenu, React.ReactNode> = {
  accueil: <IconeEtoiles />,
  journal: <IconeJournal />,
  ajouter: <IconePlus />,
  analyse: <IconeAnalyse />,
  menu: <IconeMenu />,
};
