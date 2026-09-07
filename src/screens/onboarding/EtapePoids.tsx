import { UNITES_DU_SYSTEME, type Systeme } from '../../domaine/unites';
import { SelecteurPoids } from './SelecteurPoids';

/**
 * ÉTAPE : LE POIDS — l'actuel, ou celui qu'on vise.
 *
 * Le même écran sert aux deux : seule la question change. Deux copies auraient
 * divergé au premier réglage du sélecteur.
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
  return (
    <>
      <h1 className="titre">{question}</h1>
      <SelecteurPoids
        id={id}
        valeur={poids}
        onValeur={onPoids}
        unite={UNITES_DU_SYSTEME[systeme].poids}
        question={question}
      />
    </>
  );
}
