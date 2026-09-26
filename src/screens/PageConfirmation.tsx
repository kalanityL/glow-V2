import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import {
  IconeAnalyse,
  IconeChevronDroit,
  IconeCourbe,
  IconeEtoiles,
  IconeJournal,
  IconePlus,
  IconeProfil,
} from '../components/Icones';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
/* SON IMAGE DE VALIDATION (2026-09-20, « image de validation :
   glp1low_validation_injection.svg ») : un fichier embarqué, comme les
   polices et la photo — jamais une ressource distante. */
import imageValidation from '../assets/images/validation-prise.svg';
import { IndiceDefilement } from '../components/IndiceDefilement';
import { jouerClics } from '../plateforme/navigateur';
import { SON_DE_LA_CONFIRMATION, morceauxDuSon } from '../app/sons';

const GLING = morceauxDuSon(SON_DE_LA_CONFIRMATION);

/** Les entrées possibles de l'écran ; chaque écran dit lesquelles, DANS
    SON ORDRE (2026-09-20, « nouvelle element : en 1er ») : ajouter
    d'abord, l'accueil en dernier. */
export const ENTREES_CONFIRMATION = ['ajouter', 'journal', 'concentration', 'evolution', 'evolutionPoids', 'evolutionSommeil', 'evolutionActivite'] as const;
export type EntreeConfirmation = (typeof ENTREES_CONFIRMATION)[number];

/** D'OÙ L'ON VIENT (2026-09-23, « 1er choix, pas en bleu : "retourner à"+
    l endroit d'ou vient ») : la page où le « + » a été touché — l'accueil
    ou « Mon compte » ; un formulaire ouvert depuis une confirmation garde
    l'origine de celle-ci. */
export const ORIGINES = ['accueil', 'compte'] as const;
export type Origine = (typeof ORIGINES)[number];

/** Les entrées de l'écran d'une prise, et celles d'une pesée (2026-09-21,
    « page de confirmation : exactement meme principe »). « Retour à
    l'accueil », qui fermait la liste éteint, est parti le 2026-09-23 : le
    premier choix ramène d'où l'on vient. */
export const ENTREES_PRISE: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'concentration', 'evolution'];
export const ENTREES_PESEE: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'evolutionPoids'];
export const ENTREES_SOMMEIL: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'evolutionSommeil'];
export const ENTREES_ACTIVITE: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'evolutionActivite'];

const ICONES: Record<EntreeConfirmation, () => ReactElement> = {
  ajouter: IconePlus,
  journal: IconeJournal,
  concentration: IconeCourbe,
  evolution: IconeAnalyse,
  evolutionPoids: IconeAnalyse,
  evolutionSommeil: IconeAnalyse,
  evolutionActivite: IconeAnalyse,
};

/** L'icône de l'endroit d'où l'on vient (« icone correspondant selon,la d
    ou on vient ») : celle de l'accueil dans la barre du bas, celle du
    profil pour « Mon compte ». */
const ICONES_ORIGINE: Record<Origine, () => ReactElement> = {
  accueil: IconeEtoiles,
  compte: IconeProfil,
};

/** Une ligne de la carte récapitulative : l'icône, le mot, la valeur à droite. */
export interface LigneConfirmation {
  icone: ReactNode;
  nom: string;
  valeur: string;
  /** Une icône devant la valeur (2026-09-21, « mettre icone heure devant l'heure »). */
  iconeValeur?: ReactNode;
}

/**
 * L'ÉCRAN DE CONFIRMATION (2026-09-20, son image ; « ecran de confirmation :
 * que souhaitez vous -> vous pouvez maintenant : nouvelle element : en 1er ;
 * ouvre la meme chose que bouton plus. Rien en gras sur cette page. ») —
 * d'abord celui d'une prise, puis LE MÊME pour une pesée (2026-09-21,
 * « page de confirmation : exactement meme principe que page de
 * confirmation injection ») : son image de validation, le titre et « Votre
 * suivi est à jour. » ; la carte récapitulative en lignes de même style —
 * UN BOUTON, qui rouvre le formulaire en modification ; « Vous pouvez
 * maintenant : » et ses entrées SANS SOUS-TITRE — D'ABORD « RETOURNER À »
 * L'ENDROIT D'OÙ L'ON VIENT, avec son icône, sur carte et pas à l'accent
 * (2026-09-23, « 1er choix, pas en bleu : "retourner à"+ l endroit d'ou
 * vient ; icone correspondant selon,la d ou on vient » — l'ancien « Retour
 * à l'accueil », éteint en dernier, est parti avec) ; puis AJOUTER UN
 * AUTRE ÉLÉMENT, pleine, qui ouvre le tiroir du « + » ; puis les autres,
 * éteintes tant que leurs pages n'existent pas. RIEN EN GRAS.
 */
export function PageConfirmation({
  titrePage,
  titre,
  lignes,
  entrees,
  origine,
  onRetour,
  forme,
  onModifier,
  onAccueil,
  onOuvrirCompte,
  onJournal,
  onVoirDansLeJournal,
  onAjouter,
  ajoutTraitement,
  fond,
}: {
  /** Le titre de la page, dans l'entête des pages. */
  titrePage: string;
  /** « Injection enregistrée ! », « Pesée mise à jour ! »… */
  titre: string;
  lignes: readonly LigneConfirmation[];
  entrees: readonly EntreeConfirmation[];
  /** D'où l'on vient, et le geste qui y ramène. */
  origine: Origine;
  onRetour: () => void;
  /** La forme du traitement, pour la case du tiroir du « + ». */
  forme: Forme | null;
  /** La carte touchée : rouvrir le formulaire sur ce qui vient d'être consigné. */
  onModifier: () => void;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  /** La page Journal, par la barre du bas (2026-09-26). */
  onJournal: () => void;
  /** « VOIR DANS LE JOURNAL » (2026-09-26, « brancher les pages de
      confirmation voir dans le journal envoie vers le jouranl à la date
      saisie pour l'item ») : le journal OUVERT À LA DATE DE CE QUI VIENT
      d'être consigné — pas à aujourd'hui, qui n'est pas forcément la même
      journée (on consigne une pesée d'hier, une séance de demain). */
  onVoirDansLeJournal: () => void;
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  /* La demande d'ouvrir le tiroir du « + » : un compteur que la barre écoute. */
  const [demandeAjout, setDemandeAjout] = useState(0);

  /* LE GLING (2026-09-22, « joue 7 :petite cloche a chaque page de
     confirmation ») : joué une fois, à l'instant où la page apparaît —
     chaque confirmation, enregistrement ou mise à jour, est une page qui
     naît. Un navigateur qui refuse le son se tait. Le drapeau : en
     développement, le mode strict monte l'écran deux fois, et la file des
     clics l'aurait joué deux fois à 45 ms d'écart (vu au Chrome piloté). */
  const glingJoue = useRef(false);
  useEffect(() => {
    if (glingJoue.current) return;
    glingJoue.current = true;
    jouerClics(GLING);
  }, []);

  /* Parmi les entrées, « Ajouter » ouvre le tiroir du « + » (2026-09-20) et
     « Voir dans le journal » mène au journal à la date de l'item
     (2026-09-26) ; les autres restent éteintes tant que leurs pages
     n'existent pas. Le retour d'où l'on vient est le premier choix, avant
     elles. */
  const agit = (entree: EntreeConfirmation) =>
    entree === 'ajouter' ? () => setDemandeAjout((n) => n + 1) : entree === 'journal' ? onVoirDansLeJournal : null;
  const IconeOrigine = ICONES_ORIGINE[origine];

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
    >
      <div className="page__colonne">
        <EntetePage titre={titrePage} onAccueil={onAccueil} />

        <div className="confirmation">
          <img className="confirmation__coche" src={imageValidation} alt="" />
          <h2 className="confirmation__titre">{titre}</h2>
          <p className="confirmation__sousTitre">{textes.confirmation.sousTitre}</p>

          <button type="button" className="carte confirmation__prise" onClick={onModifier}>
            {lignes.map((ligne) => (
              <div key={ligne.nom} className="confirmation__ligne">
                {ligne.icone}
                <span>{ligne.nom}</span>
                <span className="confirmation__valeur">
                  {ligne.iconeValeur}
                  {ligne.valeur}
                </span>
              </div>
            ))}
          </button>

          <h3 className="confirmation__maintenant">{textes.confirmation.maintenant}</h3>
          <div className="confirmation__entrees">
            <button type="button" className="confirmation__entree" onClick={onRetour}>
              <span className="confirmation__pastille">
                <IconeOrigine />
              </span>
              <span className="confirmation__entreeNom">{textes.confirmation.retourVers[origine]}</span>
              <IconeChevronDroit />
            </button>
            {entrees.map((entree) => {
              const Icone = ICONES[entree];
              const action = agit(entree);
              return (
                <button
                  key={entree}
                  type="button"
                  className={`confirmation__entree${entree === 'ajouter' ? ' confirmation__entree--pleine' : ''}`}
                  disabled={!action}
                  aria-disabled={!action}
                  onClick={action ?? undefined}
                >
                  <span className="confirmation__pastille">
                    <Icone />
                  </span>
                  <span className="confirmation__entreeNom">{textes.confirmation.entrees[entree]}</span>
                  <IconeChevronDroit />
                </button>
              );
            })}
          </div>
          <IndiceDefilement />
        </div>
      </div>

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={onOuvrirCompte}
        onJournal={onJournal}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
        demandeAjout={demandeAjout}
      />
    </div>
  );
}
