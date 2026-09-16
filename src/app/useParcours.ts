import { useState } from 'react';
import { SYSTEME_PAR_LANGUE } from '../domaine/unites';
import type { Langue } from '../i18n/langues';
import type { Forme } from '../domaine/traitements';
import {
  ETAPE_DEBUT_DECOMPTE,
  etapesVisibles,
  peutValider,
  type EtapeId,
} from '../screens/onboarding/parcours';
import { REPONSES_INITIALES, type Reponses } from '../screens/onboarding/reponses';

/**
 * LE PARCOURS : les réponses ET le rang de l'étape, ensemble.
 *
 * POURQUOI ENSEMBLE : depuis que « Quel poids visez-vous ? » ne se montre qu'à
 * qui veut perdre du poids (2026-09-07), la SUITE des étapes dépend des
 * RÉPONSES. Les tenir à deux endroits séparés, c'était laisser l'un décider
 * sans voir l'autre.
 *
 * POURQUOI ICI, et non dans l'écran d'onboarding : le bouton « retour » de la
 * barre est HORS de l'écran du téléphone — c'est le bouton natif simulé —, et
 * il doit pouvoir reculer dans le parcours.
 *
 * Le rang est un simple compteur sur la liste des étapes VISIBLES. Il est borné
 * à chaque lecture plutôt qu'au moment de la réponse : changer d'objectif peut
 * raccourcir la liste sous les pieds du rang, et mieux vaut qu'il retombe sur
 * la dernière étape que sur rien.
 */
export function useParcours() {
  const [reponses, setReponses] = useState<Reponses>(REPONSES_INITIALES);
  const [rang, setRang] = useState(0);
  /* ENTRÉ DANS L'APPLICATION (2026-09-16, « a la fin du formulaire on arrive à
     la home ») : vrai une fois le dernier écran validé. Le parcours reste en
     mémoire — les réponses ne sont pas enregistrées, voir GUIDELINES § 5 —
     mais l'onboarding ne se remontre plus : le bouton « retour » de la barre
     n'y ramène pas, comme un bouton natif ne rouvre pas un formulaire fini.

     VRAI DÈS LE CHARGEMENT, POUR L'INSTANT (2026-09-16, « pour l'instant met
     l'onboarding de coté et la home directement qd on charge la page ») :
     l'accueil s'ouvre directement, avec les réponses de départ (pas de
     prénom, l'avatar par défaut). Remettre `false` rend l'onboarding. */
  const [entre, setEntre] = useState(true);

  const visibles = etapesVisibles(reponses);
  const rangBorne = Math.min(rang, visibles.length - 1);
  const etape: EtapeId = visibles[rangBorne];

  /** Une réponse, et une seule, remplacée. */
  const repondre = <C extends keyof Reponses>(champ: C, valeur: Reponses[C]) =>
    setReponses((precedentes) => ({ ...precedentes, [champ]: valeur }));

  /**
   * LA LANGUE REPOSE LES UNITÉS SUR CELLES DE LA LANGUE (2026-09-07), et c'est
   * pour cela qu'elle a son propre geste : deux réponses changent d'un coup,
   * et les écrire l'une après l'autre laisserait un instant où le système ne
   * correspondrait plus à la langue.
   *
   * Le dernier geste l'emporte : rechoisir la langue efface un système qu'on
   * aurait réglé à la main juste avant. C'est le comportement le moins
   * surprenant — on vient de dire dans quelle langue on lit — et les unités se
   * rechoisissent sur le même écran, juste en dessous.
   */
  const choisirLangue = (langue: Langue) =>
    setReponses((precedentes) => ({
      ...precedentes,
      langue,
      systeme: SYSTEME_PAR_LANGUE[langue],
    }));

  /**
   * LES TROIS RÉPONSES DU TRAITEMENT SE DÉFONT ENSEMBLE.
   *
   * Répondre « non » efface la forme et la spécialité ; changer de forme efface
   * la spécialité. Sans cela, on garderait une réponse qui ne correspond plus à
   * la question — un comprimé choisi, puis la forme passée à « injection » — et
   * `peutValider` laisserait passer une cascade incohérente.
   */
  const repondreTraitementCommence = (commence: boolean) =>
    setReponses((precedentes) => ({
      ...precedentes,
      traitementCommence: commence,
      formeTraitement: commence ? precedentes.formeTraitement : null,
      traitement: commence ? precedentes.traitement : null,
    }));

  const repondreForme = (forme: Forme) =>
    setReponses((precedentes) => ({
      ...precedentes,
      formeTraitement: forme,
      traitement: forme === precedentes.formeTraitement ? precedentes.traitement : null,
    }));

  /* LE DÉCOMPTE. Il compte les étapes VISIBLES : sauter « Quel poids
     visez-vous ? » ou l'écran du traitement raccourcit le chemin, et les
     billes doivent le dire — sinon on promettrait des écrans qui ne viendront
     pas. L'étape courante compte parmi celles qui restent : elle n'est pas
     encore remplie. */
  const decompte = {
    passees: rangBorne,
    total: visibles.length,
    montrer: rangBorne >= visibles.indexOf(ETAPE_DEBUT_DECOMPTE),
  };

  return {
    reponses,
    etape,
    decompte,
    repondre,
    choisirLangue,
    repondreTraitementCommence,
    repondreForme,
    /* Vrai quand l'étape courante laisse passer : le bouton « Suivant » s'y
       éteint quand elle ne le laisse pas. */
    peutValider: peutValider(etape, reponses),
    peutRevenir: !entre && rangBorne > 0,
    /* Vrai sur le dernier écran : son bouton porte alors un autre mot. */
    estDerniere: rangBorne === visibles.length - 1,
    entre,
    /* Sur le dernier écran, avancer n'est plus changer d'étape : c'est entrer. */
    avancer: () =>
      rangBorne === visibles.length - 1 ? setEntre(true) : setRang(rangBorne + 1),
    reculer: () => {
      if (!entre) setRang(Math.max(rangBorne - 1, 0));
    },
  };
}
