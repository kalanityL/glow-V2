import {
  IconeAvis,
  IconeBadges,
  IconeConstellation,
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
import { Tiroir } from '../components/Tiroir';
import {
  ENTREES_PAR_SECTION,
  SECTIONS_MENU,
  type EntreeMenuPrincipal,
} from '../app/menuPrincipal';

/**
 * LE MENU PRINCIPAL EN TIROIR (2026-09-19, « ouvre le menu en tiroir comme ça
 * avec une croix pour fermer », d'après son image) : le cadre commun des
 * tiroirs (`components/Tiroir.tsx` — la vitre, le panneau qui monte et
 * redescend, la croix, la fermeture au clic à côté) et, dedans, les
 * sections du menu. Il a remplacé la page « Menu » du matin.
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
 * AUCUNE ENTRÉE NE MÈNE ENCORE NULLE PART, sauf « Mon compte », dont la page
 * existe : des lignes, pas des boutons.
 */
export function TiroirMenu({
  onFermer,
  onFermee,
  enFermeture,
  onOuvrirCompte,
  bouton,
}: {
  onFermer: () => void;
  onFermee: () => void;
  enFermeture: boolean;
  /** « Mon compte » ouvre la page du compte (2026-09-19). */
  onOuvrirCompte: () => void;
  bouton: () => Element | null;
}) {
  const textes = useTextes();

  return (
    <Tiroir
      nom={textes.menuPrincipal.titre}
      onFermer={onFermer}
      onFermee={onFermee}
      enFermeture={enFermeture}
      bouton={bouton}
    >
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
            {ENTREES_PAR_SECTION[section].map((entree) =>
              entree === 'compte' ? (
                /* LA SEULE ENTRÉE QUI MÈNE QUELQUE PART : « Mon compte », la
                   page existe (2026-09-19). Les autres attendent la leur. */
                <button
                  key={entree}
                  type="button"
                  className="tiroir__entree tiroir__entree--bouton"
                  onClick={onOuvrirCompte}
                >
                  <span className="tiroir__icone">{ICONES_ENTREES[entree]}</span>
                  <span className="tiroir__nom">{textes.menuPrincipal.entrees[entree]}</span>
                </button>
              ) : (
                <div key={entree} className="tiroir__entree">
                  <span className="tiroir__icone">{ICONES_ENTREES[entree]}</span>
                  <span className="tiroir__nom">{textes.menuPrincipal.entrees[entree]}</span>
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </Tiroir>
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
  compte: <IconeProfil />,
  avis: <IconeAvis />,
  sondage: <IconeSondage />,
  faq: <IconeFaq />,
  ciel: <IconeConstellation />,
};
