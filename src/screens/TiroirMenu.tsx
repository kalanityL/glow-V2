import { useEffect, useRef } from 'react';
import {
  IconeAvis,
  IconeBadges,
  IconeConstellation,
  IconeCroix,
  IconeFaq,
  IconeModules,
  IconeNotifications,
  IconePalette,
  IconeProfil,
  IconeRapport,
  IconeRapports,
  IconeSondage,
} from '../components/Icones';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { surClicDehors } from '../plateforme/navigateur';
import {
  ENTREES_PAR_SECTION,
  SECTIONS_MENU,
  type EntreeMenuPrincipal,
} from '../app/menuPrincipal';

/**
 * LE MENU PRINCIPAL EN TIROIR (2026-09-19, « ouvre le menu en tiroir comme ça
 * avec une croix pour fermer », d'après son image) : un panneau qui monte
 * depuis la barre du bas, par-dessus le bas de l'accueil, et qui se ferme à
 * la croix, au clic à côté ou à Échap — LE MÊME MÉCANISME QUE LE PANNEAU DES
 * ROUES (`surClicDehors`), qui n'est pas un popup au sens des guidelines :
 * pas de voile sombre, pas de fenêtre, un panneau déroulant à l'endroit du
 * geste. Il a remplacé la page « Menu » du matin.
 *
 * SES SECTIONS SONT CELLES DE `menuPrincipal.ts`, en DEUX COLONNES comme sur
 * son image ; chaque entrée porte l'icône de la V1, nue et à l'encre, et son
 * nom — ni pastille, ni couleur, ni chevron, ni ligne entre les entrées d'un
 * groupe ; une longue ligne sous chaque titre de groupe (2026-09-19). La
 * troisième section titre par le mot-symbole dessiné, dans la police, la
 * couleur et la graisse du reste de la ligne, puis « et vous ». Derrière le
 * tiroir, LE RESTE DE LA PAGE EST VITRÉ, FLOU (« reste de la page vitré
 * flou ») : une vitre sans teinte, qui floute ce qu'elle couvre, et sur
 * laquelle un clic ferme le tiroir.
 *
 * AUCUNE ENTRÉE NE MÈNE ENCORE NULLE PART : des lignes, pas des boutons.
 */
export function TiroirMenu({ onFermer }: { onFermer: () => void }) {
  const textes = useTextes();
  const tiroir = useRef<HTMLDivElement>(null);

  /* Le clic à côté et Échap ferment — comme les roues. Le bouton « Menu » de
     la barre est hors du tiroir : son clic ferme aussi, par ce chemin. */
  useEffect(() => surClicDehors(() => tiroir.current, onFermer), [onFermer]);

  return (
    <>
      <div className="tiroir__vitre" aria-hidden="true" />
      <div className="tiroir" ref={tiroir} role="dialog" aria-label={textes.menuPrincipal.titre}>
      <div className="tiroir__poignee" aria-hidden="true" />
      <button type="button" className="tiroir__fermer" aria-label={textes.fermer} onClick={onFermer}>
        <IconeCroix />
      </button>

      <div className="tiroir__contenu">
        {SECTIONS_MENU.map((section) => (
          <section key={section} className="tiroir__section">
            <h2 className="tiroir__titre">
              {section === 'glowEtVous' ? (
                <>
                  <Wordmark enLigne />
                  <span>{textes.menuPrincipal.sections[section]}</span>
                </>
              ) : (
                textes.menuPrincipal.sections[section]
              )}
            </h2>
            <div className="tiroir__grille">
              {ENTREES_PAR_SECTION[section].map((entree) => (
                <div key={entree} className="tiroir__entree">
                  <span className="tiroir__icone">{ICONES_ENTREES[entree]}</span>
                  <span className="tiroir__nom">{textes.menuPrincipal.entrees[entree]}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      </div>
    </>
  );
}

/** L'icône de chaque entrée — celles de la V1 ; le type exige chacune. */
const ICONES_ENTREES: Record<EntreeMenuPrincipal, React.ReactNode> = {
  modules: <IconeModules />,
  notifications: <IconeNotifications />,
  theme: <IconePalette />,
  badges: <IconeBadges />,
  nouveauRapport: <IconeRapport />,
  rapports: <IconeRapports />,
  /* Le bonhomme du profil, et non la carte de paiement de la V1 (2026-09-19,
     « icone mon compte : icone mon profil »). */
  compte: <IconeProfil />,
  avis: <IconeAvis />,
  sondage: <IconeSondage />,
  faq: <IconeFaq />,
  ciel: <IconeConstellation />,
};
