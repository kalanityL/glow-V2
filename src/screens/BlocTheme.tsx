import { useCallback, useState } from 'react';
import { Bloc } from '../components/Bloc';
import { useTextes } from '../i18n/useTextes';
import { FONDS, type FondId } from '../app/fonds';

/**
 * LE BLOC « THÈME » (2026-09-20, « menu parametre couleur : un bloc reste page
 * vitré ; titre du bloc "Theme" ; fond du bloc : fond courant, meme
 * transparence que sur la home. un bouton de l'image de fond (meme taille que
 * le choix de couleur de fond de l'onboarding), un bouton avec l'image de fond
 * de ciel journée ensoleillé de la v1, et en dessous un bouton choisir. Qd on
 * clique sur un bouton, ça met à jour le fond de page provisoirement ; si on
 * clique sur choisir, ça met à jour l'image de fond de page de façon
 * pérenne ») : deux cadres, comme ceux du choix du thème de l'onboarding,
 * chacun peint de son fond ; toucher un cadre change le fond de la page
 * SOUS LES YEUX, sans l'enregistrer ; « Choisir » l'enregistre. FERMER SANS
 * AVOIR CHOISI, avec un autre fond sous les yeux (2026-09-20, « si on sort du
 * bloc theme sans valider, idem que pour mise à jour de traitement :
 * confirmer le nouveau fond ou fermer ») : deux sorties, « Confirmer le
 * nouveau fond » / « Fermer » ; fermer rend le fond enregistré.
 */
export function BlocTheme({
  courant,
  apercu,
  onApercu,
  onChoisir,
  onFermer,
}: {
  /** Le fond enregistré. */
  courant: FondId;
  /** Le fond montré sous les yeux, s'il diffère. */
  apercu: FondId | null;
  onApercu: (fond: FondId) => void;
  onChoisir: (fond: FondId) => void;
  onFermer: () => void;
}) {
  const textes = useTextes();
  const montre = apercu ?? courant;
  const differe = montre !== courant;
  /* La sortie demandée avec un autre fond sous les yeux : à confirmer. */
  const [sortie, setSortie] = useState(false);

  /* La confirmation affichée, un second clic sur la croix ferme sans
     retenir le fond (2026-09-20, « si on clic sur la croix qd le message de
     confirmation s'affiche, ca confirme la fermeture sans sauvegarde »). */
  const demanderFermeture = useCallback(() => {
    if (!differe || sortie) {
      onFermer();
      return;
    }
    setSortie(true);
  }, [differe, sortie, onFermer]);

  const pied = sortie ? (
    <div className="boutons">
      <button type="button" className="bouton bouton--second" onClick={onFermer}>
        {textes.fermer}
      </button>
      <button type="button" className="bouton" onClick={() => onChoisir(montre)}>
        {textes.blocTheme.confirmer}
      </button>
    </div>
  ) : (
    <div className="boutons">
      <button
        type="button"
        className="bouton"
        disabled={!differe}
        aria-disabled={!differe}
        onClick={() => onChoisir(montre)}
      >
        {textes.blocTheme.choisir}
      </button>
    </div>
  );

  return (
    <Bloc titre={textes.blocTheme.titre} onFermer={demanderFermeture} pied={pied}>
      <div className="choix-themes choix-themes--fonds" role="radiogroup" aria-label={textes.blocTheme.titre}>
        {FONDS.map((fond) => (
          <button
            key={fond}
            type="button"
            role="radio"
            className={`carte-theme carte-fond carte-fond--${fond}${montre === fond ? ' carte-theme--choisi' : ''}`}
            aria-label={textes.blocTheme.fonds[fond]}
            aria-checked={montre === fond}
            onClick={() => {
              setSortie(false);
              onApercu(fond);
            }}
          />
        ))}
      </div>
    </Bloc>
  );
}
