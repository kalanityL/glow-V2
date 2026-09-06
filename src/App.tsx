/**
 * V2 — repartie de zéro.
 *
 * Pour l'instant : le cadre du téléphone, sa barre du bas avec le bouton
 * « retour », et un écran blanc entre les deux. Aucune page, aucune
 * fonctionnalité, aucun thème, aucun template.
 *
 * Le cadre et le bouton sont repris de la version Mixte, réécrits en CSS
 * ordinaire — ce dépôt n'a ni Tailwind ni bibliothèque d'icônes.
 */
export default function App() {
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
        <div className="phone-screen" id="phone-screen" />

        {/* La barre du bas, hors écran : elle figure le menu natif du
            téléphone — d'où sa livrée sombre, assortie au contour — avec le
            bouton « retour », équivalent du bouton arrière. Sans historique,
            il ne fait rien et s'éteint à moitié. */}
        <footer className="phone-bar">
          <button
            type="button"
            className="phone-bar-back"
            title="Retour"
            aria-label="Retour"
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
