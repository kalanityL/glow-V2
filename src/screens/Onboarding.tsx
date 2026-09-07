import { useState } from 'react';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { THEMES, THEME_PAR_DEFAUT, classeDuTheme, type ThemeId } from '../themes/themes';

/**
 * L'ONBOARDING — ÉCRAN 1 : LE CHOIX DU THÈME.
 *
 * Un cadre par thème, SANS SON NOM — on choisit ce qu'on voit —, le premier
 * sélectionné à l'ouverture. Toucher un cadre
 * HABILLE AUSSITÔT TOUTE LA PAGE : le thème choisi est posé sur la page
 * elle-même, donc l'entête, les textes, les cadres et le bouton changent
 * ensemble. On voit le thème qu'on choisit, pas une vignette de ce qu'il
 * serait.
 *
 * Chaque cadre porte EN PLUS sa propre classe de thème : il montre son fond et
 * son encre à lui, même quand ce n'est pas lui qui habille la page. C'est ce
 * qui permet de comparer les deux d'un coup d'œil.
 *
 * Le choix vit ici, en état de composant : rien n'est encore enregistré, il n'y
 * a pas de deuxième écran où l'emporter. Quand il y en aura un, cet état
 * remontera d'un cran — pas plus loin.
 */
export function Onboarding() {
  const textes = useTextes();
  const [theme, setTheme] = useState<ThemeId>(THEME_PAR_DEFAUT);

  return (
    <div className={`page ${classeDuTheme(theme)}`}>
      <div className="page__colonne">
        <div className="entete">
          <Logomark size={46} />
          <Wordmark />
        </div>

        <h1 className="titre">{textes.onboarding.theme.question}</h1>

        <div className="choix-themes">
          {THEMES.map((id) => (
            <button
              key={id}
              type="button"
              /* La classe du thème sur le cadre lui-même : il se montre tel
                 qu'il est. `aria-pressed` dit lequel est retenu, pour qui
                 n'a que la voix pour le savoir. */
              className={`carte-theme ${classeDuTheme(id)}${id === theme ? ' carte-theme--choisi' : ''}`}
              /* LE NOM DU THÈME N'EST PLUS ÉCRIT DANS LE CADRE (2026-09-07) :
                 on choisit ce qu'on voit, pas un nom. Il reste en `aria-label`
                 — un cadre sans texte n'est qu'un bouton muet pour qui écoute
                 la page, et il faut bien nommer ce qu'on lui propose. */
              aria-label={textes.themes[id]}
              aria-pressed={id === theme}
              onClick={() => setTheme(id)}
            />
          ))}
        </div>

        <button type="button" className="bouton">
          {textes.onboarding.suivant}
        </button>
      </div>
    </div>
  );
}
