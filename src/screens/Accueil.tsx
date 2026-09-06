import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { THEME_ACTIF, classeDuTheme } from '../themes/themes';

/**
 * LA PAGE D'ACCUEIL — pour l'instant, la seule page de l'application.
 *
 * Son dessin vient de l'écran d'accès réservé : l'entête qui porte la marque,
 * puis trois textes. PAS DE FORMULAIRE — ni champs, ni bouton (demande du
 * 2026-09-06) — et les textes sont des « hello world », le temps que les
 * thèmes s'installent.
 *
 * L'écran ne pose que des classes : ni couleur, ni police, ni mesure. La mise
 * en page est dans `themes/page.css`, les couleurs dans la feuille du thème
 * actif. C'est ce qui permet d'en changer sans rouvrir ce fichier.
 */
export function Accueil() {
  const textes = useTextes();

  return (
    <div className={`page ${classeDuTheme(THEME_ACTIF)}`}>
      <div className="page__colonne">
        <div className="entete">
          <Logomark size={46} />
          <Wordmark />
        </div>

        <p className="surtitre">{textes.accueil.surtitre}</p>
        <h1 className="titre">{textes.accueil.titre}</h1>
        <p className="chapeau">{textes.accueil.chapeau}</p>
      </div>
    </div>
  );
}
