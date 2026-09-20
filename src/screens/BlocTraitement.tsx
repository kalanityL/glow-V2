import { useCallback, useState } from 'react';
import { Bloc } from '../components/Bloc';
import { useTextes } from '../i18n/useTextes';
import { traitementsDeLaForme, type Forme } from '../domaine/traitements';
import { ChoixUnique } from './onboarding/ChoixUnique';

/** Ce que le bloc édite : la forme, ou « aucun », et la spécialité. */
export interface ChoixTraitement {
  forme: Forme | 'aucun' | null;
  traitement: string | null;
}

/** « Aucun » seul sur sa ligne, pleine largeur ; comprimé et injection
    dessous, côte à côte (2026-09-20, « aucun : sur une ligne toute la largeur
    de ligne, comprimé/injection en dessous »). */
const AUCUN = ['aucun'] as const;
const FORMES_CHOIX = ['comprime', 'injection'] as const;

/**
 * LE BLOC « MON TRAITEMENT » (2026-09-20) : « qd on édite le traitement, un
 * bloc en reste page vitré avec titre de bloc "Mon traitement" avec 3 boutons
 * comprimé / injection /aucun et selon ce qu'on clique apparait en dessous
 * les boutons correspondants et bouton enregistrer si traitement avant était
 * aucun ; bouton mettre à jour si traitement avant n'était ni nul ni aucun.
 * Si on clique hors du bloc ou sur le bouton de fermeture du bloc et que ce
 * qui a été fait dans le bloc est différent de ce qui est actuellement mais
 * qu'on n'a pas enregistré : si on n'a cliqué que sur comprimé ou injection
 * sans rien choisir : 2 boutons : terminer la mise à jour / fermer ; si on a
 * cliqué sur aucun ou un nom de medicament : 2 boutons : confirmer la mise à
 * jour / fermer ».
 *
 * Les choix sont ceux de l'onboarding (`ChoixUnique`, le catalogue) : on ne
 * réécrit pas un sélecteur. « Terminer la mise à jour » ramène au bloc pour
 * finir ; « Confirmer la mise à jour » enregistre et ferme ; « Fermer » ferme
 * sans enregistrer.
 */
export function BlocTraitement({
  courant,
  onEnregistrer,
  onFermer,
}: {
  /** Le traitement enregistré, tel qu'il est au moment d'ouvrir le bloc. */
  courant: ChoixTraitement;
  onEnregistrer: (choix: ChoixTraitement) => void;
  onFermer: () => void;
}) {
  const textes = useTextes();
  const [choix, setChoix] = useState<ChoixTraitement>(courant);
  /* La sortie demandée sans avoir enregistré : à terminer, ou à confirmer. */
  const [sortie, setSortie] = useState<'terminer' | 'confirmer' | null>(null);

  const differe = choix.forme !== courant.forme || choix.traitement !== courant.traitement;
  const complet = choix.forme === 'aucun' || (choix.forme !== null && choix.traitement !== null);
  const enregistrer = () => {
    onEnregistrer(choix);
    onFermer();
  };

  const demanderFermeture = useCallback(() => {
    if (!differe) {
      onFermer();
      return;
    }
    setSortie(complet ? 'confirmer' : 'terminer');
  }, [differe, complet, onFermer]);

  const disponibles = choix.forme && choix.forme !== 'aucun' ? traitementsDeLaForme(choix.forme) : [];
  /* Changer de forme efface la spécialité, comme dans le parcours. */
  const choisirForme = (forme: Forme | 'aucun') => {
    setSortie(null);
    setChoix((avant) => ({ forme, traitement: forme === avant.forme ? avant.traitement : null }));
  };

  const pied =
    sortie === null ? (
      <div className="boutons">
        <button
          type="button"
          className="bouton"
          disabled={!complet || !differe}
          aria-disabled={!complet || !differe}
          onClick={enregistrer}
        >
          {courant.traitement ? textes.compte.traitement.mettreAJour : textes.compte.traitement.enregistrer}
        </button>
      </div>
    ) : (
      <div className="boutons">
        <button type="button" className="bouton bouton--second" onClick={onFermer}>
          {textes.fermer}
        </button>
        {sortie === 'terminer' ? (
          <button type="button" className="bouton" onClick={() => setSortie(null)}>
            {textes.compte.traitement.terminer}
          </button>
        ) : (
          <button type="button" className="bouton" onClick={enregistrer}>
            {textes.compte.traitement.confirmer}
          </button>
        )}
      </div>
    );

  return (
    <Bloc titre={textes.compte.traitement.titre} onFermer={demanderFermeture} pied={pied}>
      <ChoixUnique
        options={AUCUN}
        libelle={() => textes.compte.traitement.aucun}
        valeur={choix.forme === 'aucun' ? 'aucun' : null}
        onChoix={choisirForme}
        question={textes.groupes.forme}
        /* Seul sur sa ligne, `enLigne` le centre (« aucun : texte centré »). */
        enLigne
      />
      <ChoixUnique
        options={FORMES_CHOIX}
        libelle={(id) => textes.formes[id]}
        valeur={choix.forme === 'aucun' ? null : choix.forme}
        onChoix={choisirForme}
        question={textes.groupes.forme}
        enLigne
      />
      {disponibles.length > 0 ? (
        <ChoixUnique
          options={disponibles.map(({ id }) => id)}
          libelle={(id) => disponibles.find((candidat) => candidat.id === id)?.nom ?? id}
          valeur={choix.traitement}
          onChoix={(traitement) => {
            setSortie(null);
            setChoix((avant) => ({ ...avant, traitement }));
          }}
          question={textes.groupes.traitement}
          enGrille
        />
      ) : null}

    </Bloc>
  );
}
