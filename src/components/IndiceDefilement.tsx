import { useEffect, useRef, useState } from 'react';
import { IconeChevronBas } from './Icones';
import { defilerDUnePage, surDefilementDisponible } from '../plateforme/navigateur';

/**
 * L'INDICE DE DÉFILEMENT (2026-09-21, d'après son image — la pastille
 * ronde à flèche de l'écran de choix de compte de Google — : « quand un
 * scroll est disponible n'importe ou sur le site, le signaler avec un petit
 * picto de ce genre là, adapte le style au theme de la v2, sobre et
 * discret ») : posé EN DERNIER ENFANT de tout ce qui défile, il colle au
 * bas de la zone visible (`position: sticky`) tant qu'il reste du contenu
 * dessous, et s'efface au bout. Il ne prend pas de place ; SA PASTILLE SE
 * TOUCHE (2026-09-21, « clic sur le bouton doit faire scroller ») : elle
 * fait défiler la zone d'une page de ce qu'elle montre. Il trouve sa zone
 * tout seul : son parent.
 */
export function IndiceDefilement() {
  const indice = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => surDefilementDisponible(indice.current?.parentElement ?? null, setVisible), []);
  return (
    <span ref={indice} className={`indice-defilement${visible ? ' indice-defilement--visible' : ''}`} aria-hidden="true">
      <button
        type="button"
        tabIndex={-1}
        className="indice-defilement__pastille"
        onClick={() => defilerDUnePage(indice.current?.parentElement ?? null)}
      >
        <IconeChevronBas />
      </button>
    </span>
  );
}
