import { useState, type ReactElement, type ReactNode } from 'react';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import {
  IconeAnalyse,
  IconeChevronDroit,
  IconeCourbe,
  IconeEtoiles,
  IconeJournal,
  IconePlus,
} from '../components/Icones';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
/* SON IMAGE DE VALIDATION (2026-09-20, « image de validation :
   glp1low_validation_injection.svg ») : un fichier embarqué, comme les
   polices et la photo — jamais une ressource distante. */
import imageValidation from '../assets/images/validation-prise.svg';

/** Les entrées possibles de l'écran ; chaque écran dit lesquelles, DANS
    SON ORDRE (2026-09-20, « nouvelle element : en 1er ») : ajouter
    d'abord, l'accueil en dernier. */
export const ENTREES_CONFIRMATION = ['ajouter', 'journal', 'concentration', 'evolution', 'evolutionPoids', 'accueil'] as const;
export type EntreeConfirmation = (typeof ENTREES_CONFIRMATION)[number];

/** Les entrées de l'écran d'une prise, et celles d'une pesée (2026-09-21,
    « page de confirmation : exactement meme principe »). */
export const ENTREES_PRISE: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'concentration', 'evolution', 'accueil'];
export const ENTREES_PESEE: readonly EntreeConfirmation[] = ['ajouter', 'journal', 'evolutionPoids', 'accueil'];

const ICONES: Record<EntreeConfirmation, () => ReactElement> = {
  ajouter: IconePlus,
  journal: IconeJournal,
  concentration: IconeCourbe,
  evolution: IconeAnalyse,
  evolutionPoids: IconeAnalyse,
  accueil: IconeEtoiles,
};

/** Une ligne de la carte récapitulative : l'icône, le mot, la valeur à droite. */
export interface LigneConfirmation {
  icone: ReactNode;
  nom: string;
  valeur: string;
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
 * maintenant : » et ses entrées SANS SOUS-TITRE, la première pleine :
 * AJOUTER UN AUTRE ÉLÉMENT, qui ouvre le tiroir du « + » ; les autres
 * éteintes tant que leurs pages n'existent pas, le retour à l'accueil aussi
 * (« retour à l'accueil comme les autres désactivés »). RIEN EN GRAS.
 */
export function PageConfirmation({
  titrePage,
  titre,
  lignes,
  entrees,
  forme,
  onModifier,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  fond,
}: {
  /** Le titre de la page, dans l'entête des pages. */
  titrePage: string;
  /** « Injection enregistrée ! », « Pesée mise à jour ! »… */
  titre: string;
  lignes: readonly LigneConfirmation[];
  entrees: readonly EntreeConfirmation[];
  /** La forme du traitement, pour la case du tiroir du « + ». */
  forme: Forme | null;
  /** La carte touchée : rouvrir le formulaire sur ce qui vient d'être consigné. */
  onModifier: () => void;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  fond: FondProps;
}) {
  const textes = useTextes();
  /* La demande d'ouvrir le tiroir du « + » : un compteur que la barre écoute. */
  const [demandeAjout, setDemandeAjout] = useState(0);

  /* Seul « Ajouter » agit (2026-09-20, « retour à l'accueil comme les
     autres désactivés ») ; la barre du bas et le bouton du téléphone
     ramènent à l'accueil. */
  const agit = (entree: EntreeConfirmation) => (entree === 'ajouter' ? () => setDemandeAjout((n) => n + 1) : null);

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
                <span className="confirmation__valeur">{ligne.valeur}</span>
              </div>
            ))}
          </button>

          <h3 className="confirmation__maintenant">{textes.confirmation.maintenant}</h3>
          <div className="confirmation__entrees">
            {entrees.map((entree, i) => {
              const Icone = ICONES[entree];
              const action = agit(entree);
              return (
                <button
                  key={entree}
                  type="button"
                  className={`confirmation__entree${i === 0 ? ' confirmation__entree--pleine' : ''}`}
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
        </div>
      </div>

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={onOuvrirCompte}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        demandeAjout={demandeAjout}
      />
    </div>
  );
}
