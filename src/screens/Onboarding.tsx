import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import type { useParcours } from '../app/useParcours';
import { EtapeLangueUnites } from './onboarding/EtapeLangueUnites';
import { EtapeTheme } from './onboarding/EtapeTheme';
import { EtapeObjectif } from './onboarding/EtapeObjectif';
import { EtapePoids } from './onboarding/EtapePoids';
import { EtapeTraitement } from './onboarding/EtapeTraitement';
import { EtapeActivite } from './onboarding/EtapeActivite';
import { EtapeSouhaitActivite } from './onboarding/EtapeSouhaitActivite';

/**
 * L'ONBOARDING — l'entête, l'étape courante, la rangée des boutons.
 *
 * Il ne DÉCIDE de rien : le parcours (les réponses, l'étape, les gestes)
 * arrive tout fait de `useParcours`, tenu par `App` parce que le bouton de la
 * barre du téléphone doit pouvoir y reculer. Cet écran ne fait que le montrer.
 */
export function Onboarding({ parcours }: { parcours: ReturnType<typeof useParcours> }) {
  const textes = useTextes();
  const {
    reponses,
    etape,
    repondre,
    choisirLangue,
    repondreTraitementCommence,
    repondreForme,
    peutValider,
    peutRevenir,
    avancer,
    reculer,
  } = parcours;

  return (
    <div className={`page ${classeDuTheme(reponses.theme)}`}>
      <div className="page__colonne">
        <div className="entete">
          <Logomark size={46} />
          <Wordmark />
        </div>

        {etape === 'langue-unites' ? (
          <EtapeLangueUnites
            langue={reponses.langue}
            /* Le geste dédié : la langue repose aussi les unités. */
            onLangue={choisirLangue}
            systeme={reponses.systeme}
            onSysteme={(systeme) => repondre('systeme', systeme)}
          />
        ) : null}

        {etape === 'theme' ? (
          <EtapeTheme theme={reponses.theme} onTheme={(theme) => repondre('theme', theme)} />
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
            poids={reponses.poids}
            onPoids={(choix) => repondre('poids', choix)}
            systeme={reponses.systeme}
          />
        ) : null}

        {etape === 'poids-cible' ? (
          <EtapePoids
            id="poids-cible"
            question={textes.onboarding.poidsCible.question}
            poids={reponses.poidsCible}
            onPoids={(choix) => repondre('poidsCible', choix)}
            systeme={reponses.systeme}
          />
        ) : null}

        {etape === 'traitement' ? (
          <EtapeTraitement
            commence={reponses.traitementCommence}
            /* Gestes dédiés : les trois réponses se défont ensemble. */
            onCommence={repondreTraitementCommence}
            forme={reponses.formeTraitement}
            onForme={repondreForme}
            traitement={reponses.traitement}
            onTraitement={(traitement) => repondre('traitement', traitement)}
          />
        ) : null}

        {etape === 'activite' ? (
          <EtapeActivite
            activite={reponses.activite}
            onActivite={(activite) => repondre('activite', activite)}
          />
        ) : null}

        {etape === 'souhait-quotidien' ? (
          <EtapeSouhaitActivite
            souhait={reponses.souhaitActivite}
            onSouhait={(souhait) => repondre('souhaitActivite', souhait)}
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
          {/* Éteint tant que l'étape ne laisse pas passer — aujourd'hui, une
              cascade de traitement incomplète. Éteint et non caché : il doit
              rester visible pour qu'on sache où l'on va. */}
          <button
            type="button"
            className="bouton"
            onClick={avancer}
            disabled={!peutValider}
            aria-disabled={!peutValider}
          >
            {textes.onboarding.suivant}
          </button>
        </div>
      </div>
    </div>
  );
}
