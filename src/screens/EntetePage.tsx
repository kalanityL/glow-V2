import { IconeNotifications, IconeRecherche } from '../components/Icones';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';

/**
 * L'ENTÊTE D'UNE PAGE (2026-09-20, « search et notif sur la meme ligne que
 * logo, titre de page ligne du dessous centré pas en gras ») : la marque en
 * petit à gauche, la recherche et la cloche à droite sur la même ligne — les
 * mêmes pastilles que l'accueil —, et le titre de la page centré sur la ligne
 * du dessous. Pas de flèche de retour : la barre du bas et le bouton du
 * téléphone ramènent — ET LA MARQUE (2026-09-20, « clic sur logo ou glp1low
 * n'importe où sur le header qui contient ces deux zones on revient à
 * l'accueil ») : la pastille et le mot-symbole sont un seul bouton, qui
 * ramène à l'accueil.
 */
export function EntetePage({ titre, onAccueil }: { titre: string; onAccueil: () => void }) {
  const textes = useTextes();
  return (
    <>
      <div className="entete entete--page">
        <button
          type="button"
          className="entete__marque-bouton"
          aria-label={textes.accueil.menu.accueil}
          onClick={onAccueil}
        >
          <Logomark />
          <Wordmark />
        </button>
        <div className="entete__outils">
          <span className="rond">
            <IconeRecherche />
          </span>
          <span className="rond">
            <IconeNotifications />
          </span>
        </div>
      </div>
      <h1 className="page__titre">{titre}</h1>
    </>
  );
}
