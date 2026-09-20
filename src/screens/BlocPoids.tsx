import { useCallback, useState } from 'react';
import { Bloc } from '../components/Bloc';
import { ReglePoids } from '../components/ReglePoids';
import { useTextes } from '../i18n/useTextes';
import type { UnitePoids } from '../domaine/unites';

/**
 * LE BLOC DU POIDS (2026-09-20, « mise à jour de poids : ouvre qqchose comme
 * ça ou on peut slider pour faire defiler le poids dans un sens ou l'autre
 * jusqu'au poids choisi ou bien directement modifier les chiffres et la barre
 * du bas se met à jour au bon endroit en temps réel », d'après son image) :
 * LA RÈGLE CRANTÉE (`ReglePoids`, sortie d'ici le 2026-09-21 pour servir
 * aussi à la pesée) dans un bloc à hauteur ajustée. Comme les autres blocs
 * (« bouton ok, meme systeme que d'habitude si on sort ou ferme avant de
 * valider ») : « OK » au pied, éteint tant que rien n'a changé ; fermer
 * sans avoir validé propose « Confirmer la mise à jour » / « Fermer », et
 * la confirmation affichée, un second clic sur la croix ferme sans
 * enregistrer.
 */
export function BlocPoids({
  titre,
  valeur,
  unite,
  onEnregistrer,
  onFermer,
}: {
  titre: string;
  /** Le poids enregistré, sous sa forme stockée (« 95.0 »). */
  valeur: string;
  unite: UnitePoids;
  onEnregistrer: (stocke: string) => void;
  onFermer: () => void;
}) {
  const textes = useTextes();
  const [brouillon, setBrouillon] = useState(valeur);
  const [sortie, setSortie] = useState(false);

  const differe = brouillon !== valeur;
  const enregistrer = () => {
    onEnregistrer(brouillon);
    onFermer();
  };
  const demanderFermeture = useCallback(() => {
    if (brouillon === valeur || sortie) {
      onFermer();
      return;
    }
    setSortie(true);
  }, [brouillon, valeur, sortie, onFermer]);

  const pied = sortie ? (
    <div className="boutons">
      <button type="button" className="bouton bouton--second" onClick={onFermer}>
        {textes.fermer}
      </button>
      <button type="button" className="bouton" onClick={enregistrer}>
        {textes.blocPoids.confirmer}
      </button>
    </div>
  ) : (
    <div className="boutons">
      <button type="button" className="bouton" disabled={!differe} aria-disabled={!differe} onClick={enregistrer}>
        {textes.blocPoids.enregistrer}
      </button>
    </div>
  );

  return (
    <Bloc titre={titre} onFermer={demanderFermeture} pied={pied} hauteur="ajustee">
      <ReglePoids
        valeur={brouillon}
        unite={unite}
        nom={titre}
        onValeur={(stocke) => {
          setSortie(false);
          setBrouillon(stocke);
        }}
      />
    </Bloc>
  );
}
