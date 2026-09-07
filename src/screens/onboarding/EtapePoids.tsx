import { UNITES_DU_SYSTEME, type Systeme } from '../../domaine/unites';
import { SelecteurPoids } from './SelecteurPoids';

/**
 * ÉTAPE : LE POIDS — l'actuel, ou celui qu'on vise.
 *
 * Le même ÉCRAN sert aux deux : seule la question change. Deux copies auraient
 * divergé au premier réglage du sélecteur.
 *
 * MAIS PAS LA MÊME VALEUR : chaque emploi reçoit la sienne et son propre
 * `onPoids`, et l'écran n'en garde AUCUNE de son côté — il n'a pas d'état.
 * C'est ce qui garantit qu'un poids actuel ne se retrouve jamais dans le poids
 * visé (mise en garde du 2026-09-07). Ne rien mémoriser ici.
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
