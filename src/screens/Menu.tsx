import {
  IconeAvis,
  IconeBadges,
  IconeCompte,
  IconeConstellation,
  IconeFaq,
  IconeModules,
  IconeNotifications,
  IconePalette,
  IconeRapport,
  IconeRapports,
  IconeRetour,
  IconeSondage,
} from '../components/Icones';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import {
  ENTREES_PAR_SECTION,
  SECTIONS_MENU,
  type EntreeMenuPrincipal,
} from '../app/menuPrincipal';

/**
 * LE MENU PRINCIPAL (2026-09-19, « remplace le lien profil du menu par une
 * icone menu qui ouvre un menu […] garder le design actuel ») : la page
 * qu'ouvre l'entrée « Menu » de la barre du bas. LE DESIGN EST CELUI DE
 * « Mon profil » — la photo, l'entête (la marque, le retour dessous, le titre
 * à droite), les cartes ; une carte par section, une ligne iconée par entrée.
 * La section « GLP1LOW et vous » porte le mot-symbole dessiné dans son titre.
 *
 * AUCUNE ENTRÉE NE MÈNE ENCORE NULLE PART : des lignes, pas des boutons — le
 * jour où les pages existeront, chaque ligne en devient un.
 */
export function Menu({ onRevenir }: { onRevenir: () => void }) {
  const textes = useTextes();

  return (
    <div className={`page page--photo ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <div className="profil__entete">
          <div className="profil__marque">
            <Logomark />
            <Wordmark />
          </div>
          <h1 className="profil__titre">{textes.menuPrincipal.titre}</h1>
          <button
            type="button"
            className="rond rond--bouton profil__retour"
            aria-label={textes.retour}
            onClick={onRevenir}
          >
            <IconeRetour />
          </button>
        </div>

        <div className="page__defilant">
          {SECTIONS_MENU.map((section) => (
            <section key={section} className="carte">
              <h2 className="carte__titre">
                {section === 'glowEtVous' ? (
                  <>
                    <Wordmark enLigne />
                    <span>{textes.menuPrincipal.sections[section]}</span>
                  </>
                ) : (
                  textes.menuPrincipal.sections[section]
                )}
              </h2>
              {ENTREES_PAR_SECTION[section].map((entree) => (
                <div key={entree} className="ligne">
                  <span className="ligne__icone">{ICONES_ENTREES[entree]}</span>
                  <span className="ligne__texte">{textes.menuPrincipal.entrees[entree]}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
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
  compte: <IconeCompte />,
  avis: <IconeAvis />,
  sondage: <IconeSondage />,
  faq: <IconeFaq />,
  ciel: <IconeConstellation />,
};
