import type { ModuleId } from '../app/modules';
import type { InjectionLog, SleepLog, SportLog, WeightLog } from '../donnees/v1';

/**
 * LE JOURNAL (2026-09-26, « On va faire la page journal ») : toutes les
 * lignes des tables de la base de la V1 remises ensemble et rangées par
 * jour — une seule suite, quel que soit le module qui les a écrites.
 *
 * CE FICHIER NE PRODUIT AUCUN TEXTE : il rend des entrées typées, la ligne
 * d'origine attachée ; c'est l'écran qui écrit les mots avec le
 * dictionnaire. Le module de chaque entrée est un `ModuleId` — le même
 * identifiant que l'accueil et le tiroir du « + », donc la même icône
 * (`IconeDuModule`) et le même nom.
 *
 * Quatre tables sont écrites aujourd'hui (les prises, les pesées, les
 * sommeils, les séances) ; les quatre autres modules — les repas, les
 * effets secondaires, la marche, le temps pour soi — n'ont pas encore de
 * formulaire : ils ont leur case dans le filtre et aucune entrée. Le jour
 * où leur table arrive, elle s'ajoute ici et nulle part ailleurs.
 */

/** Une entrée du journal : sa place dans le temps, et la ligne qui la porte. */
export type EntreeJournal =
  | { id: string; module: 'traitement'; date: string; heure: string; prise: InjectionLog }
  | { id: string; module: 'balance'; date: string; heure: string; pesee: WeightLog }
  | { id: string; module: 'sommeil'; date: string; heure: string; sommeil: SleepLog }
  | { id: string; module: 'activite-physique'; date: string; heure: string; activite: SportLog };

/** Les tables que le journal relit — celles que la V2 écrit. */
export interface TablesDuJournal {
  prises: readonly InjectionLog[];
  pesees: readonly WeightLog[];
  sommeils: readonly SleepLog[];
  activites: readonly SportLog[];
}

/** Une journée et ce qu'elle porte, l'ordre de lecture déjà fait. */
export interface JourDuJournal {
  date: string;
  entrees: readonly EntreeJournal[];
}

/**
 * Toutes les entrées des quatre tables, sans ordre garanti — c'est
 * `joursDuJournal` qui range. Une pesée de la V1 peut n'avoir pas d'heure
 * (`time` est facultatif) : elle se range alors au début de sa journée.
 */
export function entreesDuJournal(tables: TablesDuJournal): EntreeJournal[] {
  return [
    ...tables.prises.map((prise): EntreeJournal => ({ id: prise.id, module: 'traitement', date: prise.date, heure: prise.time, prise })),
    ...tables.pesees.map((pesee): EntreeJournal => ({ id: pesee.id, module: 'balance', date: pesee.date, heure: pesee.time ?? '', pesee })),
    /* La date d'un sommeil est celle du RÉVEIL (V1) : c'est ce jour-là qu'il
       se lit dans le journal, et son heure est celle du réveil. */
    ...tables.sommeils.map((sommeil): EntreeJournal => ({ id: sommeil.id, module: 'sommeil', date: sommeil.date, heure: sommeil.time, sommeil })),
    ...tables.activites.map((activite): EntreeJournal => ({ id: activite.id, module: 'activite-physique', date: activite.date, heure: activite.time, activite })),
  ];
}

/**
 * LES JOURNÉES DU JOURNAL, telles que la page les déroule (son template
 * « journal mode liste.png ») : on part du jour choisi et on remonte le
 * temps — les journées de la plus récente à la plus ancienne, et DANS une
 * journée les entrées dans l'ordre des heures, du matin au soir.
 *
 * `depuis` est le jour choisi au calendrier : rien de plus récent n'est
 * montré (une entrée datée de demain attend son jour). `modules` retient
 * les catégories cochées au filtre ; vide, aucune entrée ne passe — c'est
 * le filtre qui décide de rendre toutes les cases cochées au départ.
 * Une journée sans entrée ne fait pas de titre.
 */
export function joursDuJournal(
  entrees: readonly EntreeJournal[],
  depuis: string,
  modules: readonly ModuleId[],
): JourDuJournal[] {
  const retenus = new Set(modules);
  const parJour = new Map<string, EntreeJournal[]>();
  for (const entree of entrees) {
    if (entree.date > depuis || !retenus.has(entree.module)) continue;
    const jour = parJour.get(entree.date);
    if (jour) jour.push(entree);
    else parJour.set(entree.date, [entree]);
  }
  return [...parJour.keys()]
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({
      date,
      /* À heure égale, l'ordre reste celui des tables : deux lignes du même
         instant ne doivent pas s'échanger d'un rendu à l'autre. */
      entrees: (parJour.get(date) ?? []).slice().sort((a, b) => (a.heure < b.heure ? -1 : a.heure > b.heure ? 1 : 0)),
    }));
}

/**
 * LES JOURS QUI PORTENT QUELQUE CHOSE, pour les pointer au calendrier (son
 * template « header-vue clendrier.png » : un point sous les jours qui ont
 * une entrée). Le filtre compte : une catégorie décochée ne pointe plus.
 */
export function joursAvecEntree(entrees: readonly EntreeJournal[], modules: readonly ModuleId[]): Set<string> {
  const retenus = new Set(modules);
  const jours = new Set<string>();
  for (const entree of entrees) if (retenus.has(entree.module)) jours.add(entree.date);
  return jours;
}

/** Ce qu'une journée porte, filtre compris — le compte du bandeau de mode. */
export function compteDuJour(entrees: readonly EntreeJournal[], date: string, modules: readonly ModuleId[]): number {
  const retenus = new Set(modules);
  return entrees.filter((entree) => entree.date === date && retenus.has(entree.module)).length;
}

/**
 * L'IMAGE D'UNE ENTRÉE, pour le mode grille (2026-09-26, « pour le mode
 * grille tu mets juste l'image de l'entrée si elle exite sinon l'icone ») :
 * la photo attachée à la ligne, quand il y en a une.
 *
 * AUCUNE LIGNE N'EN PORTE AUJOURD'HUI : ni la base de la V1 (`WeightLog`,
 * `InjectionLog`, `SleepLog`, `SportLog` n'ont pas de champ de photo), ni
 * donc la V2 — la grille montre l'icône du module partout, ce que sa règle
 * dit. Le champ est lu sur la ligne telle qu'elle est en base, et non sur
 * notre type : le jour où une table en portera une (les repas de la V1 sont
 * les premiers candidats), la grille la montrera sans qu'on y revienne.
 */
export function imageDeLEntree(entree: EntreeJournal): string | undefined {
  const ligne: unknown = entree.module === 'traitement' ? entree.prise : entree.module === 'balance' ? entree.pesee : entree.module === 'sommeil' ? entree.sommeil : entree.activite;
  const photo = (ligne as { photoUrl?: unknown }).photoUrl;
  return typeof photo === 'string' && photo ? photo : undefined;
}
