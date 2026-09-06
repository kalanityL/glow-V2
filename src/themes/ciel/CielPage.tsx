import { Logomark } from '../../components/Logomark';
import { Wordmark } from '../../components/Wordmark';
import { useTextes } from '../../i18n/useTextes';

/**
 * LA PAGE DU THÈME CIEL — le premier thème de V2.
 *
 * Le dessin vient de l'écran d'accès réservé : le ciel dégradé, la carte de
 * verre, et l'entête qui porte la marque.
 *
 * DEUX ÉCARTS VOULUS, demandés le 2026-09-06 :
 *   - AUCUN FORMULAIRE — ni champs, ni bouton « Entrer » ;
 *   - les trois textes sont des « hello world », le temps que le thème
 *     s'installe. Ils viennent du dictionnaire, comme tout texte du projet :
 *     rien n'est écrit en dur dans un écran.
 * L'ENTÊTE, LUI, RESTE TEL QUEL : pastille et mot-symbole, sans retouche.
 */
export function CielPage() {
  const textes = useTextes();

  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__mark">
          <Logomark size={46} />
          <Wordmark />
        </div>

        <p className="eyebrow gate__eyebrow">{textes.ciel.surtitre}</p>
        <h1 className="gate__title">{textes.ciel.titre}</h1>
        <p className="gate__lede">{textes.ciel.chapeau}</p>
      </div>
    </div>
  );
}
