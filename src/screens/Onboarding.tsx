import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import type { useParcours } from '../app/useParcours';
import { EtapeTheme } from './onboarding/EtapeTheme';
import { EtapeSysteme } from './onboarding/EtapeSysteme';
import { EtapeObjectif } from './onboarding/EtapeObjectif';
import { EtapePoids } from './onboarding/EtapePoids';
import { EtapeActivite } from './onboarding/EtapeActivite';

/**
 * L'ONBOARDING — l'entête, l'étape courante, la rangée des boutons.
 *
 * Il ne DÉCIDE de rien : le parcours (les réponses, l'étape, les gestes)
 * arrive tout fait de `useParcours`, tenu par `App` parce que le bouton de la
 * barre du téléphone doit pouvoir y reculer. Cet écran ne fait que le montrer.
 */
export function Onboarding({ parcours }: { parcours: ReturnType<typeof useParcours> }) {
  const textes = useTextes();
  const { reponses, etape, repondre, repondrePoids, peutRevenir, avancer, reculer } = parcours;

  return (
    <div className={`page ${classeDuTheme(reponses.theme)}`}>
      <div className="page__colonne">
        <div className="entete">
          <Logomark size={46} />
          <Wordmark />
        </div>

        {etape === 'theme' ? (
          <EtapeTheme theme={reponses.theme} onTheme={(theme) => repondre('theme', theme)} />
        ) : null}

        {etape === 'systeme' ? (
          <EtapeSysteme
            systeme={reponses.systeme}
            onSysteme={(systeme) => repondre('systeme', systeme)}
          />
        ) : null}

        {etape === 'objectif' ? (
          <EtapeObjectif
            objectif={reponses.objectif}
            onObjectif={(objectif) => repondre('objectif', objectif)}
          />
        ) : null}

        {etape === 'poids' ? (
          <EtapePoids
            id="poids-actuel"
            question={textes.onboarding.poids.question}
            messageDepassement={textes.onboarding.poids.depassement}
            poids={reponses.poids}
            onPoids={(saisie) => repondrePoids('poids', saisie)}
            systeme={reponses.systeme}
          />
        ) : null}

        {etape === 'poids-cible' ? (
          <EtapePoids
            id="poids-cible"
            question={textes.onboarding.poidsCible.question}
            messageDepassement={textes.onboarding.poidsCible.depassement}
            poids={reponses.poidsCible}
            onPoids={(saisie) => repondrePoids('poidsCible', saisie)}
            systeme={reponses.systeme}
          />
        ) : null}

        {etape === 'activite' ? (
          <EtapeActivite
            activite={reponses.activite}
            onActivite={(activite) => repondre('activite', activite)}
          />
        ) : null}

        {/* « PRÉCÉDENT » N'EXISTE PAS À LA PREMIÈRE ÉTAPE : il n'est pas éteint,
            il est absent — rien ne se propose de reculer là où il n'y a rien
            derrière. « Suivant » occupe alors toute la rangée. Le bouton de la
            barre du téléphone, lui, ne peut pas disparaître : c'est le bouton
            natif, il s'éteint à moitié. */}
        <div className="boutons">
          {peutRevenir ? (
            <button type="button" className="bouton bouton--second" onClick={reculer}>
              {textes.onboarding.precedent}
            </button>
          ) : null}
          <button type="button" className="bouton" onClick={avancer}>
            {textes.onboarding.suivant}
          </button>
        </div>
      </div>
    </div>
  );
}
