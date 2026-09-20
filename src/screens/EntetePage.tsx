import { IconeNotifications, IconeRecherche } from '../components/Icones';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';

/**
 * L'ENTÊTE D'UNE PAGE (2026-09-20, « search et notif sur la meme ligne que
 * logo, titre de page ligne du dessous centré pas en gras ») : la marque en
 * petit à gauche, la recherche et la cloche à droite sur la même ligne — les
 * mêmes pastilles que l'accueil —, et le titre de la page centré sur la ligne
 * du dessous. Pas de flèche de retour : la barre du bas et le bouton du
 * téléphone ramènent.
 */
export function EntetePage({ titre }: { titre: string }) {
  return (
    <>
      <div className="entete entete--page">
        <Logomark />
        <Wordmark />
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
