import { useTextes } from '../../i18n/useTextes';
import { FORMES, traitementsDeLaForme, type Forme } from '../../domaine/traitements';
import { ChoixUnique } from './ChoixUnique';

interface EtapeQuelTraitementProps {
  forme: Forme | null;
  onForme: (forme: Forme) => void;
  traitement: string | null;
  onTraitement: (traitement: string) => void;
}

/**
 * ÉTAPE : QUEL TRAITEMENT — la forme, puis la spécialité.
 *
 * ELLE NE SE MONTRE QU'À QUI A COMMENCÉ (voir `parcours.ts`) : c'est la suite
 * de « Avez-vous commencé votre traitement GLP-1 ? ».
 *
 * LA LISTE DES SPÉCIALITÉS EST À DEUX PAR LIGNE (demande du 2026-09-07) : ce
 * sont des noms d'un mot, et treize réponses pleine largeur ne tenaient pas
 * dans un écran. La forme, elle, garde ses deux réponses côte à côte.
 *
 * ON NE PEUT PAS AVANCER SANS AVOIR CHOISI un traitement : dire qu'on a
 * commencé sans dire quoi ne renseigne rien. C'est `peutValider` dans
 * `parcours.ts` qui l'impose, pas cet écran.
 */
export function EtapeQuelTraitement({
  forme,
  onForme,
  traitement,
  onTraitement,
}: EtapeQuelTraitementProps) {
  const textes = useTextes();
  const question = textes.onboarding.quelTraitement.question;
  const disponibles = forme ? traitementsDeLaForme(forme) : [];

  return (
    <>
      <h1 className="titre">{question}</h1>

      <p className="libelle-groupe">{textes.groupes.forme}</p>
      <ChoixUnique
        options={FORMES}
        libelle={(id) => textes.formes[id]}
        valeur={forme}
        onChoix={onForme}
        question={textes.groupes.forme}
        enLigne
      />

      {forme ? (
        <>
          <p className="libelle-groupe">{textes.groupes.traitement}</p>
          {/* Les noms de spécialités ne passent pas par le dictionnaire : ce
              sont des marques, elles s'écrivent pareil dans toutes les
              langues. */}
          <ChoixUnique
            options={disponibles.map(({ id }) => id)}
            libelle={(id) => disponibles.find((candidat) => candidat.id === id)?.nom ?? id}
            valeur={traitement}
            onChoix={onTraitement}
            question={textes.groupes.traitement}
            enGrille
          />
        </>
      ) : null}
    </>
  );
}
