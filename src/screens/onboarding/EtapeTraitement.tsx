import { useTextes } from '../../i18n/useTextes';
import { FORMES, traitementsDeLaForme, type Forme } from '../../domaine/traitements';
import { ChoixUnique } from './ChoixUnique';

interface EtapeTraitementProps {
  commence: boolean | null;
  onCommence: (commence: boolean) => void;
  forme: Forme | null;
  onForme: (forme: Forme) => void;
  traitement: string | null;
  onTraitement: (traitement: string) => void;
}

/** Les deux réponses de la première question, comme identifiants. */
const OUI_NON = ['oui', 'non'] as const;

/**
 * ÉTAPE : LE TRAITEMENT.
 *
 * TROIS QUESTIONS QUI S'OUVRENT L'UNE APRÈS L'AUTRE, sur le même écran
 * (2026-09-07) : a-t-on commencé ; si oui, injection ou comprimé ; puis, selon
 * la forme, la spécialité.
 *
 * POURQUOI EN CASCADE ET NON TROIS ÉCRANS : les deux dernières ne se posent
 * qu'à qui a commencé, et la troisième dépend de la deuxième. Les montrer à
 * mesure évite de faire tourner trois pages à qui répond « non », et laisse
 * voir d'un coup d'œil ce qu'on vient de dire.
 *
 * RIEN N'EST COCHÉ D'AVANCE : ni « oui » ni « non », et les deux questions
 * suivantes n'existent pas tant qu'on n'a pas dit « oui ». Le bouton
 * « Suivant » reste éteint tant que la cascade n'est pas complète — c'est
 * `peutValider` dans `parcours.ts` qui en décide, pas cet écran.
 */
export function EtapeTraitement({
  commence,
  onCommence,
  forme,
  onForme,
  traitement,
  onTraitement,
}: EtapeTraitementProps) {
  const textes = useTextes();
  const question = textes.onboarding.traitement.question;
  const disponibles = forme ? traitementsDeLaForme(forme) : [];

  return (
    <>
      <h1 className="titre">{question}</h1>

      <ChoixUnique
        options={OUI_NON}
        libelle={(id) => (id === 'oui' ? textes.oui : textes.non)}
        valeur={commence === null ? null : commence ? 'oui' : 'non'}
        onChoix={(id) => onCommence(id === 'oui')}
        question={question}
        enLigne
      />

      {commence ? (
        <>
          <p className="libelle-groupe">{textes.groupes.forme}</p>
          <ChoixUnique
            options={FORMES}
            libelle={(id) => textes.formes[id]}
            valeur={forme}
            onChoix={onForme}
            question={textes.groupes.forme}
            enLigne
          />
        </>
      ) : null}

      {commence && forme ? (
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
          />
        </>
      ) : null}
    </>
  );
}
