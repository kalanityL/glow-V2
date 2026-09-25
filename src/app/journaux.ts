import type { AppData, InjectionLog, SleepLog, SportLog, WeightLog } from '../donnees/v1';
import { avecLeSommeil } from '../domaine/sommeils';
import { avecLActivite } from '../domaine/activites';
import { avecLaPrise } from '../domaine/prises';
import { avecLaPesee, garderLeDepart, sansLaPesee } from '../domaine/pesees';
import { effacerEnregistre, lireEnregistre } from '../plateforme/navigateur';
import { modifierBase } from './base';

/**
 * LES JOURNAUX — les tables `injectionHistory` et `weightHistory` de la base
 * de la V1 (2026-09-21, « tu effaces toutes les modifications qd je
 * reload ? », puis « tu reprends de la v1 la structure de la base de
 * données correspondante ») : chaque geste relit le document, change sa
 * table, réécrit le tout (`app/base.ts`).
 */

export function consignerPrise(prise: InjectionLog, remplace?: InjectionLog): AppData {
  return modifierBase((base) => ({
    ...base,
    injectionHistory: avecLaPrise(remplace ? base.injectionHistory.filter((p) => p.id !== remplace.id) : base.injectionHistory, prise),
  }));
}

export function consignerSommeil(sommeil: SleepLog): AppData {
  return modifierBase((base) => ({ ...base, sleepLogs: avecLeSommeil(base.sleepLogs ?? [], sommeil) }));
}

/** Une séance d'activité physique, dans `sportLogs` (2026-09-25). */
export function consignerActivite(activite: SportLog): AppData {
  return modifierBase((base) => ({ ...base, sportLogs: avecLActivite(base.sportLogs ?? [], activite) }));
}

export function consignerPesee(pesee: WeightLog, remplace?: WeightLog): AppData {
  return modifierBase((base) => ({
    ...base,
    weightHistory: avecLaPesee(remplace ? sansLaPesee(base.weightHistory, remplace.id) : base.weightHistory, pesee),
  }));
}

/** Les journaux d'avant le 2026-09-21 (`glp1low.journaux`), passés dans la
    base une fois, puis la clé effacée. */
const ANCIENNE_CLE_JOURNAUX = 'glp1low.journaux';
const ANCIENNE_ZONE: Record<string, string> = {
  'abdomen-gauche': 'abdomen_gauche',
  'abdomen-droit': 'abdomen_droit',
  'cuisse-gauche': 'cuisse_gauche',
  'cuisse-droite': 'cuisse_droite',
  'bras-gauche': 'bras_gauche',
  'bras-droit': 'bras_droit',
  'voie-orale': 'prise_orale',
};

export function migrerAnciensJournaux(): void {
  const ancien = lireEnregistre(ANCIENNE_CLE_JOURNAUX);
  if (!ancien) return;
  try {
    const lu = JSON.parse(ancien) as {
      version?: number;
      journaux?: { prises?: Array<Record<string, unknown>>; pesees?: Array<Record<string, unknown>> };
    };
    if (lu.version === 1 && lu.journaux) {
      let n = 0;
      modifierBase((base) => {
        let injectionHistory = base.injectionHistory;
        for (const p of lu.journaux?.prises ?? []) {
          if (typeof p.date !== 'string' || typeof p.heure !== 'string' || typeof p.doseMg !== 'number') continue;
          injectionHistory = avecLaPrise(injectionHistory, {
            id: `inj-${Date.now() + n++}`,
            date: p.date,
            time: p.heure,
            dose: p.doseMg,
            site: ANCIENNE_ZONE[String(p.zone)] ?? 'abdomen_gauche',
            ...(typeof p.notes === 'string' && p.notes ? { notes: p.notes } : {}),
            ...(typeof p.traitement === 'string' ? { brand: p.traitement } : {}),
          });
        }
        let weightHistory = base.weightHistory;
        for (const p of lu.journaux?.pesees ?? []) {
          if (typeof p.date !== 'string' || typeof p.heure !== 'string' || typeof p.poids !== 'string') continue;
          weightHistory = avecLaPesee(weightHistory, {
            id: `w-${Date.now() + n++}`,
            date: p.date,
            time: p.heure,
            weight: Number(p.poids),
            isStartingWeight: false,
          });
        }
        return { ...base, injectionHistory, weightHistory: garderLeDepart(weightHistory) };
      });
    }
  } catch {
    /* Illisible : rien à migrer. */
  }
  effacerEnregistre(ANCIENNE_CLE_JOURNAUX);
}
