/**
 * UNE PESÉE (2026-09-21, « ajouter balance : idem que ajouter injection ») :
 * une date, une heure, un poids sous sa forme stockée (« 95.0 », voir
 * `reponses.ts`). Ce fichier ne connaît ni l'écran ni le navigateur.
 */

export interface Pesee {
  /** La date DE LA PESÉE — celle du formulaire, jamais celle où la ligne a
      été créée (« attention : la date du formulaire de poids, pas la date
      de creation de l'entrée de la table »). */
  date: string;
  heure: string;
  /** Le poids, forme stockée : un point, une décimale. */
  poids: string;
}

/**
 * LE POIDS PROPOSÉ D'AVANCE (2026-09-21, « poids par defaut à l'ouverture :
 * poids dont la date est la plus proche de la date d'aujourd'hui et
 * inferieure à la date d'aujourd'hui ; on ne regarde pas les dates
 * futures ») : celui de la pesée la plus récente qui n'est pas dans le
 * futur — aujourd'hui compris —, ou `null` s'il n'y en a aucune. Les dates
 * `AAAA-MM-JJ` se comparent comme des textes.
 */
export function poidsLePlusRecent(pesees: readonly Pesee[], aujourdhui: string): string | null {
  let retenue: Pesee | null = null;
  for (const pesee of pesees) {
    if (pesee.date > aujourdhui) continue;
    if (!retenue || pesee.date > retenue.date || (pesee.date === retenue.date && pesee.heure > retenue.heure)) {
      retenue = pesee;
    }
  }
  return retenue?.poids ?? null;
}

/** La pesée déjà consignée ce jour-là, s'il y en a une (SPEC : au plus une
    pesée par jour). */
export function peseeDuJour(pesees: readonly Pesee[], date: string): Pesee | undefined {
  return pesees.find((pesee) => pesee.date === date);
}

/** Le journal avec cette pesée : à la place de celle du même jour s'il y en
    avait une, sinon en plus — et toujours dans l'ordre des dates. */
export function avecLaPesee(pesees: readonly Pesee[], pesee: Pesee): Pesee[] {
  return [...pesees.filter((p) => p.date !== pesee.date), pesee].sort((a, b) =>
    a.date === b.date ? a.heure.localeCompare(b.heure) : a.date.localeCompare(b.date),
  );
}
