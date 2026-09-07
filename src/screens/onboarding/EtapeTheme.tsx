import { useTextes } from '../../i18n/useTextes';
import { THEMES, classeDuTheme, type ThemeId } from '../../themes/themes';

interface EtapeThemeProps {
  theme: ThemeId;
  onTheme: (theme: ThemeId) => void;
}

/**
 * ÉTAPE 1 : LE CHOIX DU THÈME.
 *
 * Un cadre par thème, SANS SON NOM — on choisit ce qu'on voit. Toucher un cadre
 * habille aussitôt toute la page : le thème est posé sur la page elle-même,
 * donc l'entête, le titre, les cadres et le bouton changent ensemble.
 *
 * Chaque cadre porte EN PLUS sa propre classe de thème : il montre son fond à
 * lui même quand ce n'est pas lui qui habille la page, ce qui permet de
 * comparer les deux d'un coup d'œil.
 */
export function EtapeTheme({ theme, onTheme }: EtapeThemeProps) {
  const textes = useTextes();

  return (
    <>
      <h1 className="titre">{textes.onboarding.theme.question}</h1>

      <div className="choix-themes">
        {THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className={`carte-theme ${classeDuTheme(id)}${id === theme ? ' carte-theme--choisi' : ''}`}
            /* Le nom n'est plus écrit dans le cadre : il reste en `aria-label`,
               sans quoi ce ne serait qu'un bouton muet pour qui écoute la
               page. */
            aria-label={textes.themes[id]}
            aria-pressed={id === theme}
            onClick={() => onTheme(id)}
          />
        ))}
      </div>
    </>
  );
}
