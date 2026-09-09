import { useEffect, useRef } from 'react';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { remonterEnHaut } from '../plateforme/navigateur';
import type { useParcours } from '../app/useParcours';
import { EtapeLangueUnites } from './onboarding/EtapeLangueUnites';
import { EtapeTheme } from './onboarding/EtapeTheme';
import { EtapeObjectif } from './onboarding/EtapeObjectif';
import { EtapePoids } from './onboarding/EtapePoids';
import { EtapeTraitement } from './onboarding/EtapeTraitement';
import { EtapeQuelTraitement } from './onboarding/EtapeQuelTraitement';
import { Avatar } from '../components/Avatar';
import { EtapeAvatar } from './onboarding/EtapeAvatar';
import { EtapeProfil } from './onboarding/EtapeProfil';
import { Progression } from './onboarding/Progression';

/**
 * L'ONBOARDING — l'entête, l'étape courante, la rangée des boutons.
 *
 * Il ne DÉCIDE de rien : le parcours (les réponses, l'étape, les gestes)
 * arrive tout fait de `useParcours`, tenu par `App` parce que le bouton de la
 * barre du téléphone doit pouvoir y reculer. Cet écran ne fait que le montrer.
 */
export function Onboarding({ parcours }: { parcours: ReturnType<typeof useParcours> }) {
  const textes = useTextes();
  const defilant = useRef<HTMLDivElement>(null);
  const {
    reponses,
    etape,
    decompte,
    repondre,
    choisirLangue,
    repondreTraitementCommence,
    repondreForme,
    peutValider,
    peutRevenir,
    estDerniere,
    avancer,
    reculer,
  } = parcours;

  /* CHAQUE ÉCRAN S'OUVRE EN HAUT (2026-09-09) : la zone qui défile est la
     même d'une étape à l'autre, elle garderait donc sa position — on
     arriverait au milieu de la question suivante. Elle remonte à chaque
     changement d'étape, dans un sens comme dans l'autre. */
  useEffect(() => {
    remonterEnHaut(defilant.current);
  }, [etape]);

  return (
    <div className={`page ${classeDuTheme(reponses.theme)}`}>
      <div className="page__colonne">
        {/* Le décompte tient SUR LA LIGNE DE LA MARQUE, à droite (2026-09-08).
            Il n'apparaît qu'à partir de l'écran du traitement ; avant, la
            ligne ne porte que la marque. */}
        <div className="entete">
          <Logomark />
          <Wordmark />
          {decompte.montrer ? (
            <Progression passees={decompte.passees} total={decompte.total} />
          ) : null}
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

        {/* LE PORTRAIT DE L'AVATAR RESTE FIGÉ AU DÉFILEMENT (2026-09-09) : il
            est posé ICI, hors de la zone qui défile, entre l'entête et les
            réglages — on se voit changer pendant qu'on fait défiler les
            réglages. L'écran de l'avatar, lui, ne rend que les réglages. */}
        {etape === 'avatar' ? (
          <div className="avatar-portrait">
            <Avatar avatar={reponses.avatar} />
          </div>
        ) : null}

        {/* LA ZONE QUI DÉFILE (2026-09-09) : seul le contenu de l'étape défile.
            L'entête, le portrait et les boutons sont hors d'elle, et restent
            donc en place quoi qu'il arrive. */}
        <div className="page__defilant" ref={defilant}>
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
            /* Geste dédié : répondre « non » efface la forme et la spécialité. */
            onCommence={repondreTraitementCommence}
          />
        ) : null}

        {etape === 'quel-traitement' ? (
          <EtapeQuelTraitement
            forme={reponses.formeTraitement}
            /* Geste dédié : changer de forme efface la spécialité. */
            onForme={repondreForme}
            traitement={reponses.traitement}
            onTraitement={(traitement) => repondre('traitement', traitement)}
          />
        ) : null}

        {etape === 'avatar' ? (
          <EtapeAvatar avatar={reponses.avatar} onAvatar={(avatar) => repondre('avatar', avatar)} />
        ) : null}

        {etape === 'profil' ? (
          <EtapeProfil
            anneeNaissance={reponses.anneeNaissance}
            onAnneeNaissance={(annee) => repondre('anneeNaissance', annee)}
            tailleCm={reponses.tailleCm}
            onTailleCm={(cm) => repondre('tailleCm', cm)}
            anneeCourante={new Date().getFullYear()}
            prenom={reponses.prenom}
            onPrenom={(prenom) => repondre('prenom', prenom)}
            email={reponses.email}
            onEmail={(email) => repondre('email', email)}
            motDePasse={reponses.motDePasse}
            onMotDePasse={(motDePasse) => repondre('motDePasse', motDePasse)}
            systeme={reponses.systeme}
          />
        ) : null}

        </div>

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
            /* Sur le dernier écran, le bouton ne porte QUE le mot-symbole : son
               nom se dit alors ici, faute de texte à lire dedans. */
            aria-label={estDerniere ? textes.onboarding.entrer : undefined}
          >
            {estDerniere ? <Wordmark enLigne /> : textes.onboarding.suivant}
          </button>
        </div>
      </div>
    </div>
  );
}
