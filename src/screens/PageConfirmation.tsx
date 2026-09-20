import { useState, type ReactElement } from 'react';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import { surLeFond, type FondProps } from './Accueil';
import {
  IconeAnalyse,
  IconeCalendrier,
  IconeChevronDroit,
  IconeCoche,
  IconeComprime,
  IconeCourbe,
  IconeEtoiles,
  IconeJournal,
  IconeLieu,
  IconePlus,
  IconeSeringue,
} from '../components/Icones';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { formaterDateLongue } from '../domaine/dates';
import { TRAITEMENTS, type Forme } from '../domaine/traitements';
import type { Prise } from '../domaine/prises';
import type { ModuleId } from '../app/modules';

/** Les cinq entrées de l'écran, DANS SON ORDRE (2026-09-20, « nouvelle
    element : en 1er ») : ajouter d'abord, l'accueil en dernier. */
export const ENTREES_CONFIRMATION = ['ajouter', 'journal', 'concentration', 'evolution', 'accueil'] as const;
export type EntreeConfirmation = (typeof ENTREES_CONFIRMATION)[number];

const ICONES: Record<EntreeConfirmation, () => ReactElement> = {
  ajouter: IconePlus,
  journal: IconeJournal,
  concentration: IconeCourbe,
  evolution: IconeAnalyse,
  accueil: IconeEtoiles,
};

/**
 * L'ÉCRAN DE CONFIRMATION D'UNE PRISE (2026-09-20, son image ; « ecran de
 * confirmation : que souhaitez vous -> vous pouvez maintenant : nouvelle
 * element : en 1er ; ouvre la meme chose que bouton plus. Rien en gras sur
 * cette page. ») : la coche dans son halo, « Injection enregistrée ! »,
 * « Votre suivi est à jour. » ; la carte de la prise — l'icône de la forme,
 * la spécialité et la dose, la date et l'heure, la zone ; puis « Vous
 * pouvez maintenant : » et cinq entrées, la première pleine : AJOUTER UN
 * AUTRE ÉLÉMENT, qui ouvre le tiroir du « + » ; le journal, la
 * concentration et l'évolution, dont les pages n'existent pas encore —
 * éteintes ; le retour à l'accueil. RIEN EN GRAS.
 */
export function PageConfirmation({
  prise,
  forme,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  fond,
}: {
  prise: Prise;
  forme: Forme;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const specialite = TRAITEMENTS.find((t) => t.id === prise.traitement);
  const orale = forme === 'comprime';
  const dose = `${String(prise.doseMg).replace('.', textes.separateurDecimal)} mg`;
  /* La demande d'ouvrir le tiroir du « + » : un compteur que la barre écoute. */
  const [demandeAjout, setDemandeAjout] = useState(0);

  const agir: Record<EntreeConfirmation, (() => void) | null> = {
    ajouter: () => setDemandeAjout((n) => n + 1),
    journal: null,
    concentration: null,
    evolution: null,
    accueil: onAccueil,
  };

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
      onClick={surLeFond(fond.onOuvrirBloc)}
    >
      <div className="page__colonne" onClick={surLeFond(fond.onOuvrirBloc)}>
        <EntetePage titre={textes.accueil.traitement[forme]} onAccueil={onAccueil} />

        <div className="confirmation">
          <div className="confirmation__coche" aria-hidden="true">
            <IconeCoche />
          </div>
          <h2 className="confirmation__titre">{textes.confirmation.titre[forme]}</h2>
          <p className="confirmation__sousTitre">{textes.confirmation.sousTitre}</p>

          <div className="carte confirmation__prise">
            <div className="confirmation__traitement">
              <span className="confirmation__icone">{orale ? <IconeComprime /> : <IconeSeringue />}</span>
              <span className="confirmation__nom">
                <span>{specialite?.nom}</span>
                <span className="confirmation__dose">{dose}</span>
              </span>
            </div>
            <div className="confirmation__ligne">
              <IconeCalendrier />
              <span>{formaterDateLongue(prise.date, textes.calendrier.mois, langue)}</span>
              <span className="confirmation__valeur">{prise.heure}</span>
            </div>
            {!orale ? (
              <div className="confirmation__ligne">
                <IconeLieu />
                <span>{textes.confirmation.zone}</span>
                <span className="confirmation__valeur">{textes.prise.zones[prise.zone]}</span>
              </div>
            ) : null}
          </div>

          <h3 className="confirmation__maintenant">{textes.confirmation.maintenant}</h3>
          <div className="confirmation__entrees">
            {ENTREES_CONFIRMATION.map((entree, i) => {
              const Icone = ICONES[entree];
              const action = agir[entree];
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
                  <span className="confirmation__texte">
                    <span className="confirmation__entreeNom">{textes.confirmation.entrees[entree].nom}</span>
                    <span className="confirmation__detail">{textes.confirmation.entrees[entree].detail}</span>
                  </span>
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
