import { LANGUES, type Langue } from '../../i18n/langues';
import { useTextes } from '../../i18n/useTextes';
import { SYSTEMES, type Systeme } from '../../domaine/unites';
import { ChoixUnique } from './ChoixUnique';

/**
 * ÉTAPE 1 : LA LANGUE ET LES UNITÉS, SUR LE MÊME ÉCRAN (2026-09-07).
 *
 * Les deux vont ensemble : la langue amène ses unités, et les voir côte à côte
 * montre ce que le choix de l'une fait à l'autre — toucher « English » fait
 * passer les unités à « inch · pound » SOUS LES YEUX, et non dans un écran
 * qu'on n'a pas encore atteint.
 *
 * C'EST UN DÉFAUT, PAS UNE RÈGLE : les unités se rechoisissent librement juste
 * après, sur le même écran. Reprendre la langue les repose sur celles de la
 * nouvelle langue — le dernier geste l'emporte, et c'est le comportement le
 * moins surprenant : on vient de dire dans quelle langue on lit.
 *
 * LA LANGUE N'EST PAS BRANCHÉE, et c'est voulu (« on ne le fera pas pour de
 * vrai […] c'est juste pour avoir la maquette ») : le choix est recueilli, mais
 * l'application continue de parler la langue qu'elle détecte. LES UNITÉS, ELLES,
 * SONT BIEN BRANCHÉES — le sélecteur de poids en dépend déjà.
 * Le jour où on branchera la langue : `useTextes` lira ce choix quand il
 * existe et retombera sur la détection sinon. Rien d'autre ne bougera, aucun
 * écran n'écrivant de texte.
 */
export function EtapeLangueUnites({
  langue,
  onLangue,
  systeme,
  onSysteme,
}: {
  langue: Langue;
  onLangue: (langue: Langue) => void;
  systeme: Systeme;
  onSysteme: (systeme: Systeme) => void;
}) {
  const textes = useTextes();

  return (
    <>
      <h1 className="titre">{textes.onboarding.langueUnites.question}</h1>

      {/* LES LANGUES SE NOMMENT DANS LEUR PROPRE LANGUE — « Français »,
          « English » — et non traduites : c'est l'usage, et le seul moyen que
          quelqu'un qui ne lit pas la langue affichée retrouve la sienne. */}
      <p className="libelle-groupe">{textes.groupes.langue}</p>
      <ChoixUnique
        options={LANGUES}
        libelle={(id) => textes.langues[id]}
        valeur={langue}
        onChoix={onLangue}
        question={textes.groupes.langue}
      />

      <p className="libelle-groupe">{textes.groupes.unites}</p>
      <ChoixUnique
        options={SYSTEMES}
        libelle={(id) => textes.systemes[id]}
        valeur={systeme}
        onChoix={onSysteme}
        question={textes.groupes.unites}
      />
    </>
  );
}
