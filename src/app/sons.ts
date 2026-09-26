import { SONS, type SonId } from './sons-catalogue';

/**
 * LES SONS CHOISIS POUR CHAQUE EFFET (2026-09-21 au soir, après la
 * simulation des vingt clics : « son bulle pour le poids / son plastique :
 * ajoute le pour qd on tourne l'heure avec le cadran de l'horloge / garde
 * tous les autres sons disponibles on s'en servira dans les parametres » ;
 * puis le 2026-09-26, « utilise le bruitage de balance aussi pour les heures
 * de sommeils et la distances d'activité physique » — un seul clic pour les
 * trois).
 * Le catalogue entier reste embarqué (`sons-catalogue.ts`, engendré par
 * `scripts/rendre-sons.mjs`) : l'écran des effets sonores, dans son TODO,
 * choisira parmi eux. En attendant, ses deux choix sont ici.
 */

/** Le clic d'un cran de la règle du poids : « Bulle » (la roue de la
    fortune, du matin, reste au catalogue). */
export const SON_DU_POIDS: SonId = 'bulle';

/**
 * LE CLIC D'UN CRAN DU CADRAN D'UNE HEURE ET DE LA PISTE D'UNE DISTANCE :
 * LE MÊME QUE LA BALANCE (2026-09-26, « changement : utilise le bruitage de
 * balance aussi pour les heures de sommeils et la distances d'activité
 * physique ») — « Plastique », choisi le 2026-09-21 au soir, a vécu cinq
 * jours. Il reste au catalogue, comme les dix-huit autres.
 */
export const SON_DU_CADRAN: SonId = SON_DU_POIDS;

/** Le clic d'une étoile de la qualité du sommeil : « Cristal » (2026-09-21
    au soir, « ajouter son cristal à variation de qualité sommeil »). */
export const SON_DE_LA_NOTE: SonId = 'cristal';

/** LE GLING DE LA CONFIRMATION (2026-09-22, « joue 7 :petite cloche a
    chaque page de confirmation », après la simulation « quatre notes ») :
    « Petite cloche », quatre notes montantes d'une frappe enregistrée,
    joué à l'instant où toute page de confirmation d'enregistrement
    apparaît. */
export const SON_DE_LA_CONFIRMATION: SonId = 'petite-cloche';

export function morceauxDuSon(son: SonId): readonly string[] {
  return SONS[son];
}
