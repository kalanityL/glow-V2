import { useTextes } from '../../i18n/useTextes';
import { UNITES_DU_SYSTEME, type Systeme } from '../../domaine/unites';
import { ChampMesure } from './ChampMesure';

/**
 * ÉTAPE : LE POIDS — l'actuel, ou celui qu'on vise.
 *
 * Le même écran sert aux deux : seule la question change. Deux copies auraient
 * divergé au premier réglage du champ.
 */
export function EtapePoids({
  id,
  question,
  poids,
  onPoids,
  systeme,
}: {
  id: string;
  question: string;
  poids: string;
  onPoids: (poids: string) => void;
  systeme: Systeme;
}) {
  useTextes();

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChampMesure
        id={id}
        valeur={poids}
        onValeur={onPoids}
        unite={UNITES_DU_SYSTEME[systeme].poids}
        question={question}
      />
    </>
  );
}
