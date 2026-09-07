import { useState } from 'react';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { THEME_PAR_DEFAUT, classeDuTheme, type ThemeId } from '../themes/themes';
import { EtapeTheme } from './onboarding/EtapeTheme';
import { EtapeObjectif } from './onboarding/EtapeObjectif';
import { OBJECTIF_PAR_DEFAUT, type Objectif } from './onboarding/objectifs';

interface OnboardingProps {
  /** L'étape affichée, comptée à partir de zéro. */
  etape: number;
  /** Faux à la première étape : il n'y a rien derrière. */
  peutRevenir: boolean;
  /** Revenir à la précédente. */
  onPrecedent: () => void;
  /** Passer à la suivante. */
  onSuivant: () => void;
}

/** Le nombre d'étapes, lu par le parcours pour savoir où s'arrêter. */
export const NOMBRE_ETAPES = 2;

/**
 * L'ONBOARDING — l'entête, l'étape courante, le bouton « Suivant ».
 *
 * IL PORTE LES RÉPONSES, PAS LA NAVIGATION. Le rang de l'étape vit un cran
 * plus haut, dans `App` : le bouton « retour » est HORS de l'écran du
 * téléphone — c'est le bouton natif simulé — et il doit pouvoir reculer dans
 * le parcours. Descendre la navigation ici l'aurait mise hors de sa portée.
 *
 * Les réponses, elles, ne sortent pas d'ici tant que rien ne les attend
 * ailleurs. Elles ne sont pas encore enregistrées : un rechargement les perd.
 */
export function Onboarding({ etape, peutRevenir, onPrecedent, onSuivant }: OnboardingProps) {
  const textes = useTextes();
  const [theme, setTheme] = useState<ThemeId>(THEME_PAR_DEFAUT);
  const [objectif, setObjectif] = useState<Objectif>(OBJECTIF_PAR_DEFAUT);

  return (
    <div className={`page ${classeDuTheme(theme)}`}>
      <div className="page__colonne">
        <div className="entete">
          <Logomark size={46} />
          <Wordmark />
        </div>

        {etape === 0 ? <EtapeTheme theme={theme} onTheme={setTheme} /> : null}
        {etape === 1 ? <EtapeObjectif objectif={objectif} onObjectif={setObjectif} /> : null}

        {/* « PRÉCÉDENT » N'EXISTE PAS À LA PREMIÈRE ÉTAPE (2026-09-07) : il
            n'est pas éteint, il est absent — rien ne se propose de reculer là
            où il n'y a rien derrière. « Suivant » occupe alors toute la
            rangée. Le bouton de la barre du téléphone, lui, ne peut pas
            disparaître : c'est le bouton natif, il s'éteint à moitié. */}
        <div className="boutons">
          {peutRevenir ? (
            <button type="button" className="bouton bouton--second" onClick={onPrecedent}>
              {textes.onboarding.precedent}
            </button>
          ) : null}
          <button type="button" className="bouton" onClick={onSuivant}>
            {textes.onboarding.suivant}
          </button>
        </div>
      </div>
    </div>
  );
}
