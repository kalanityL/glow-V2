import { useState, type ReactElement } from 'react';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import { surLeFond, type FondProps } from './Accueil';
import {
  IconeAnalyse,
  IconeCalendrier,
  IconeChevronDroit,
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
/* SON IMAGE DE VALIDATION (2026-09-20, « image de validation :
   glp1low_validation_injection.svg ») : un fichier embarqué, comme les
   polices et la photo — jamais une ressource distante. */
import imageValidation from '../assets/images/validation-prise.svg';

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
 * la spécialité et la dose, la date et l'heure, la zone — TROIS LIGNES DE
 * MÊME STYLE (2026-09-20, « icone + wegovy meme style et taille que date
 * et zone d'injection ; 0.25mg come 20:30 et cuisse droite ») ; puis « Vous
 * pouvez maintenant : » et cinq entrées SANS SOUS-TITRE, la première
 * pleine : AJOUTER UN AUTRE ÉLÉMENT, qui ouvre le tiroir du « + » ; les
 * quatre autres éteintes — le journal, la concentration et l'évolution
 * n'ont pas de page, et le retour à l'accueil l'est aussi, à sa demande
 * (« retour à l'accueil comme les autres désactivés »). RIEN EN GRAS. LA
 * CARTE EST UN BOUTON (2026-09-20, « clic sur bloc récapitulatif : réouvre
 * le formulaire avec les données enregistrées par defaut ») : elle rouvre
 * le formulaire en modification ; revenue d'une mise à jour, la page titre
 * « Injection mise à jour ! ».
 *
 * LA COCHE EST SON IMAGE, LE FICHIER MÊME (2026-09-20, « image de
 * validation : ../image pour claude/glp1low_validation_injection.svg ») :
 * `assets/images/validation-prise.svg`, montré en plus petit. Ses couleurs
 * sont celles de l'image, pas du thème — l'exception est consignée dans
 * GUIDELINES.
 */
export function PageConfirmation({
  prise,
  forme,
  miseAJour,
  onModifier,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  fond,
}: {
  prise: Prise;
  forme: Forme;
  /** La prise vient d'être mise à jour, pas enregistrée pour la première fois. */
  miseAJour: boolean;
  /** La carte touchée : rouvrir le formulaire sur cette prise. */
  onModifier: () => void;
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

  /* Seul « Ajouter » agit (2026-09-20, « retour à l'accueil comme les
     autres désactivés ») ; la barre du bas et le bouton du téléphone
     ramènent à l'accueil. */
  const agir: Record<EntreeConfirmation, (() => void) | null> = {
    ajouter: () => setDemandeAjout((n) => n + 1),
    journal: null,
    concentration: null,
    evolution: null,
    accueil: null,
  };

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
      onClick={surLeFond(fond.onOuvrirBloc)}
    >
      <div className="page__colonne" onClick={surLeFond(fond.onOuvrirBloc)}>
        <EntetePage titre={textes.accueil.traitement[forme]} onAccueil={onAccueil} />

        <div className="confirmation">
          <img className="confirmation__coche" src={imageValidation} alt="" />
          <h2 className="confirmation__titre">
            {miseAJour ? textes.confirmation.titreMiseAJour[forme] : textes.confirmation.titre[forme]}
          </h2>
          <p className="confirmation__sousTitre">{textes.confirmation.sousTitre}</p>

          <button type="button" className="carte confirmation__prise" onClick={onModifier}>
            <div className="confirmation__ligne">
              {orale ? <IconeComprime /> : <IconeSeringue />}
              <span>{specialite?.nom}</span>
              <span className="confirmation__valeur">{dose}</span>
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
          </button>

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
