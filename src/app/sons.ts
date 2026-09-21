import { SONS, type SonId } from './sons-catalogue';

/**
 * LES SONS CHOISIS POUR CHAQUE EFFET (2026-09-21 au soir, après la
 * simulation des vingt clics : « son bulle pour le poids / son plastique :
 * ajoute le pour qd on tourne l'heure avec le cadran de l'horloge / garde
 * tous les autres sons disponibles on s'en servira dans les parametres »).
 * Le catalogue entier reste embarqué (`sons-catalogue.ts`, engendré par
 * `scripts/rendre-sons.mjs`) : l'écran des effets sonores, dans son TODO,
 * choisira parmi eux. En attendant, ses deux choix sont ici.
 */

/** Le clic d'un cran de la règle du poids : « Bulle » (la roue de la
    fortune, du matin, reste au catalogue). */
export const SON_DU_POIDS: SonId = 'bulle';

/** Le clic d'un cran d'heure sur le cadran : « Plastique ». */
export const SON_DU_CADRAN: SonId = 'plastique';

/** Le clic d'une étoile de la qualité du sommeil : « Cristal » (2026-09-21
    au soir, « ajouter son cristal à variation de qualité sommeil »). */
export const SON_DE_LA_NOTE: SonId = 'cristal';

export function morceauxDuSon(son: SonId): readonly string[] {
  return SONS[son];
}
