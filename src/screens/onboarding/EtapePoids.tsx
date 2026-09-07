import { UNITES_DU_SYSTEME, type Systeme } from '../../domaine/unites';
import { poidsDepasse } from '../../domaine/mesures';
import { ChampMesure } from './ChampMesure';

/**
 * ÉTAPE : LE POIDS — l'actuel, ou celui qu'on vise.
 *
 * Le même écran sert aux deux : seules la question et le message de
 * dépassement changent. Deux copies auraient divergé au premier réglage du
 * champ.
 */
export function EtapePoids({
  id,
  question,
  messageDepassement,
  poids,
  onPoids,
  systeme,
}: {
  id: string;
  question: string;
  /** Ce qui se dit quand le poids dépasse le plafond de son unité. */
  messageDepassement: string;
  poids: string;
  onPoids: (poids: string) => void;
  systeme: Systeme;
}) {
  const unite = UNITES_DU_SYSTEME[systeme].poids;

  return (
    <>
      <h1 className="titre">{question}</h1>
      <ChampMesure
        id={id}
        valeur={poids}
        onValeur={onPoids}
        unite={unite}
        question={question}
        erreur={poidsDepasse(poids, unite) ? messageDepassement : undefined}
      />
    </>
  );
}
