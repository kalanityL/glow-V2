/**
 * LE MOT-SYMBOLE GLP1LOW — L, P et 1 empilés en colonne entre le G et le LOW.
 *
 * ── Le dessin, et pourquoi chaque valeur est là ───────────────────────────
 *
 * Écart des colonnes : 1 px d'air entre le G et la colonne L/P/1, et entre
 * elle et LOW — en plus du demi-pixel que la colonne porte de chaque côté.
 *
 * G et LOW sont étirés en HAUTEUR SEULEMENT (`scaleY`, largeur intacte) pour
 * couvrir la colonne, plus haute qu'eux depuis son écart d'1 px : capitales
 * ~13,6 px pour un corps de 19, encre de la colonne ~17,2 px → 1,26. Centré,
 * le surplus se répartit également en haut et en bas. L'étirement SE VOIT, et
 * c'est voulu : c'est le dessin de la marque, ne pas le « corriger ».
 *
 * L'interligne de la colonne se calcule sur la taille de LA COLONNE, jamais sur
 * la base : un `line-height` en em se calcule sur la taille du span lui-même,
 * et le rapporter à la base écraserait les L/P/1 à moins de 2 px d'interligne.
 * L'écart de rang d'1 px garantit que le L et le P ne se touchent pas.
 *
 * ── Pourquoi tout est en em ───────────────────────────────────────────────
 *
 * Chaque valeur est rapportée à la base de 19 px du dessin d'origine puis
 * exprimée en em : le mot-symbole suit la taille que la feuille lui donne sans
 * que le dessin se déforme.
 *
 * ── La couleur, qui n'est PAS ici ─────────────────────────────────────────
 *
 * Aucune couleur n'est écrite dans ce fichier : le lockup hérite de l'encre du
 * texte qui l'entoure, la colonne L/P/1 prend celle du thème.
 */

/** La base du dessin d'origine, à laquelle tout se rapporte. */
const BASE_PX = 19;
/** Corps de la colonne L/P/1, en px sur la base. */
const LP1_PX = 6.5;
/** Interligne de la colonne, en px sur la base. */
const LP1_LEADING_PX = 5.3;
/** Air entre les colonnes, et de chaque côté de la colonne L/P/1. */
const GAP_PX = 1;
const LP1_SIDE_PX = 0.5;

interface WordmarkProps {
  /**
   * AU FIL D'UNE LIGNE — dans un bouton, dans une phrase. Le mot-symbole hérite
   * alors de la taille et de l'encre de ce qui l'entoure, et ne rend que son
   * lockup : une enveloppe en bloc casserait la ligne.
   */
  enLigne?: boolean;
}

export function Wordmark({ enLigne = false }: WordmarkProps) {
  const lockup = (
    <span
      className={enLigne ? 'wordmark wordmark--enligne' : 'wordmark__lockup'}
      style={{ columnGap: `${GAP_PX / BASE_PX}em` }}
    >
        <span className="wordmark__g">G</span>
        <span
          className="wordmark__lp1"
          style={{
            fontSize: `${LP1_PX / BASE_PX}em`,
            lineHeight: `${LP1_LEADING_PX / LP1_PX}em`,
            rowGap: `${GAP_PX / LP1_PX}em`,
            paddingInline: `${LP1_SIDE_PX / LP1_PX}em`,
          }}
        >
          <span>L</span>
          <span>P</span>
          <span>1</span>
        </span>
      <span className="wordmark__low">LOW</span>
    </span>
  );

  return enLigne ? lockup : <div className="wordmark">{lockup}</div>;
}
