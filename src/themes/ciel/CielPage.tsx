import { Logomark } from '../../components/Logomark';
import { Wordmark } from '../../components/Wordmark';

/**
 * LA PAGE DU THÈME CIEL — le premier thème de V2.
 *
 * Le dessin vient de l'écran d'accès réservé : le ciel dégradé, la carte de
 * verre, et l'entête qui porte la marque.
 *
 * DEUX ÉCARTS VOULUS, demandés le 2026-09-06 :
 *   - AUCUN FORMULAIRE — ni champs, ni bouton « Entrer » ;
 *   - les trois textes sont des « hello world », le temps que le thème
 *     s'installe.
 * L'ENTÊTE, LUI, RESTE TEL QUEL : pastille et mot-symbole, sans retouche.
 */
export function CielPage() {
  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__mark">
          <Logomark size={46} />
          <Wordmark />
        </div>

        <p className="eyebrow gate__eyebrow">hello world</p>
        <h1 className="gate__title">hello world</h1>
        <p className="gate__lede">hello world</p>
      </div>
    </div>
  );
}
