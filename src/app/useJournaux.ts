import { useState } from 'react';
import type { InjectionLog, SleepLog, WeightLog } from '../donnees/v1';
import { lireBase } from './base';
import { consignerPesee, consignerPrise, consignerSommeil, migrerAnciensJournaux } from './journaux';

/**
 * LES JOURNAUX À L'ÉCRAN (2026-09-21) : les tables de la base de la V1,
 * relues au départ, réécrites dans la base à chaque geste — l'état de
 * l'écran est ce que la base vient d'écrire.
 */
export function useJournaux() {
  const [tables, setTables] = useState(() => {
    migrerAnciensJournaux();
    const base = lireBase();
    return { prises: base.injectionHistory, pesees: base.weightHistory, sommeils: base.sleepLogs ?? [] };
  });
  return {
    prises: tables.prises as readonly InjectionLog[],
    pesees: tables.pesees as readonly WeightLog[],
    sommeils: tables.sommeils as readonly SleepLog[],
    consignerSommeil: (sommeil: SleepLog): readonly SleepLog[] => {
      const base = consignerSommeil(sommeil);
      setTables({ prises: base.injectionHistory, pesees: base.weightHistory, sommeils: base.sleepLogs ?? [] });
      return base.sleepLogs ?? [];
    },
    consignerPrise: (prise: InjectionLog, remplace?: InjectionLog): readonly InjectionLog[] => {
      const base = consignerPrise(prise, remplace);
      setTables({ prises: base.injectionHistory, pesees: base.weightHistory, sommeils: base.sleepLogs ?? [] });
      return base.injectionHistory;
    },
    consignerPesee: (pesee: WeightLog, remplace?: WeightLog): readonly WeightLog[] => {
      const base = consignerPesee(pesee, remplace);
      setTables({ prises: base.injectionHistory, pesees: base.weightHistory, sommeils: base.sleepLogs ?? [] });
      return base.weightHistory;
    },
    /** Relire après une écriture venue d'ailleurs (le poids de départ). */
    relire: () => {
      const base = lireBase();
      setTables({ prises: base.injectionHistory, pesees: base.weightHistory, sommeils: base.sleepLogs ?? [] });
    },
  };
}
