import { useEffect, useState } from 'react';
import { CLE_JOURNAUX, JOURNAUX_VIDES, deserialiserJournaux, serialiserJournaux, type Journaux } from './journaux';
import { enregistrer, lireEnregistre } from '../plateforme/navigateur';

/**
 * LES JOURNAUX, RELUS AU DÉPART ET ÉCRITS À CHAQUE CHANGEMENT (2026-09-21) :
 * les prises et les pesées survivent au rechargement, comme les réponses
 * (`useParcours`). Ce qu'on rend est l'état et de quoi le changer.
 */
export function useJournaux() {
  const [journaux, setJournaux] = useState<Journaux>(
    () => deserialiserJournaux(lireEnregistre(CLE_JOURNAUX)) ?? JOURNAUX_VIDES,
  );
  useEffect(() => {
    enregistrer(CLE_JOURNAUX, serialiserJournaux(journaux));
  }, [journaux]);
  return {
    prises: journaux.prises,
    pesees: journaux.pesees,
    setPrises: (suite: (avant: Journaux['prises']) => Journaux['prises']) =>
      setJournaux((j) => ({ ...j, prises: suite(j.prises) })),
    setPesees: (suite: (avant: Journaux['pesees']) => Journaux['pesees']) =>
      setJournaux((j) => ({ ...j, pesees: suite(j.pesees) })),
  };
}
