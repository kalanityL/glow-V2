import { useTextes } from './i18n/useTextes';
import { Onboarding } from './screens/Onboarding';
/* La mise en page d'abord, les jetons des thèmes ensuite : les feuilles de
   thème doivent pouvoir battre la structure, jamais l'inverse. */
import './themes/page.css';
import './themes/ciel/ciel.css';
import './themes/ciel-fonce/ciel-fonce.css';

/**
 * V2 — repartie de zéro.
 *
 * Pour l'instant : le cadre du téléphone, sa barre du bas avec le bouton
 * « retour », et entre les deux l'unique page, habillée par le thème actif
 * (voir `themes/themes.ts` : c'est là, et là seulement, qu'on en change).
 *
 * Le cadre et le bouton sont repris de la version Mixte, réécrits en CSS
 * ordinaire — ce dépôt n'a ni Tailwind ni bibliothèque d'icônes.
 */
export default function App() {
  const textes = useTextes();

  return (
    <div className="app-root">
      {/* Le contour du téléphone, dessiné en dur — bordure épaisse sombre et
          coins arrondis à toutes les largeurs — pour qu'on distingue ce qui
          est l'écran de ce qui ne l'est pas. */}
      <div className="phone-frame">
        {/* L'écran : rien d'autre que le contenu. La barre du bas n'en fait
            pas partie, elle figure le menu natif du téléphone, donc le bas de
            l'écran est juste au-dessus d'elle.

            Le `translateZ(0)` fait de cet écran le bloc conteneur des
            éléments `position: fixed` qu'il abritera : les popups s'y
            centreront, plutôt que dans la fenêtre du navigateur. */}
        <div className="phone-screen" id="phone-screen">
          <Onboarding />
        </div>

        {/* La barre du bas, hors écran : elle figure le menu natif du
            téléphone — d'où sa livrée sombre, assortie au contour — avec le
            bouton « retour », équivalent du bouton arrière. Sans historique,
            il ne fait rien et s'éteint à moitié. */}
        <footer className="phone-bar">
          <button
            type="button"
            className="phone-bar-back"
            title={textes.retour}
            aria-label={textes.retour}
            aria-disabled
            disabled
          >
            <ArrowLeft />
          </button>
        </footer>
      </div>
    </div>
  );
}

/** La flèche du bouton « retour », dessinée ici plutôt qu'importée. */
function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
