import { IndiceDefilement } from './IndiceDefilement';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Panneau } from './Panneau';
import { centrerDansSaListe } from '../plateforme/navigateur';

export interface OptionChoix {
  valeur: string;
  nom: string;
}

/**
 * UN CHOIX PARMI UNE LISTE — le `select` de l'application (2026-09-20,
 * « Style des selects heure et calendrier et TOUS les selects, toujours :
 * tout est stylé, accordé au theme, comme sur la v1 ») : une boîte qui dit
 * la valeur, un chevron ; touchée, elle déroule un panneau de la même
 * largeur, aux couleurs du thème, la valeur choisie marquée et amenée sous
 * les yeux. Jamais un `<select>` natif : son menu est celui du système,
 * gris, et il sort de l'écran.
 */
export function Choix({
  valeur,
  options,
  onChoix,
  nom,
  icone,
  classe,
  ouvertDAbord,
  onFerme,
}: {
  valeur: string;
  options: readonly OptionChoix[];
  onChoix: (valeur: string) => void;
  /** Le nom du choix, dit à qui écoute la page. */
  nom: string;
  /** Une icône à gauche de la valeur, dans la boîte. */
  icone?: ReactNode;
  classe?: string;
  /** Déroulé dès qu'il apparaît — le champ vient d'entrer en édition. */
  ouvertDAbord?: boolean;
  /** Le panneau s'est replié — choix fait, ou clic à côté. */
  onFerme?: () => void;
}) {
  const [ouvert, setOuvert] = useState(ouvertDAbord ?? false);
  const boite = useRef<HTMLButtonElement>(null);
  const fermer = useCallback(() => {
    setOuvert(false);
    onFerme?.();
  }, [onFerme]);

  const courante = options.find((option) => option.valeur === valeur);
  return (
    <>
      <button
        ref={boite}
        type="button"
        className={`choix${ouvert ? ' choix--ouvert' : ''}${classe ? ` ${classe}` : ''}`}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={nom}
        onClick={() => (ouvert ? fermer() : setOuvert(true))}
      >
        {icone}
        <span className="choix__valeur">{courante?.nom ?? valeur}</span>
        <span className="choix__chevron" aria-hidden="true" />
      </button>
      {ouvert ? (
        <Panneau ancre={boite} hauteur={280} onFermer={fermer}>
          <ul className="panneau__liste" role="listbox" aria-label={nom}>
            {options.map((option) => {
              const estChoisie = option.valeur === valeur;
              return (
                <li key={option.valeur} role="presentation">
                  <button
                    /* La valeur choisie est amenée sous les yeux dès qu'elle
                       existe — le panneau se monte après avoir été placé. */
                    ref={estChoisie ? centrerDansSaListe : undefined}
                    type="button"
                    role="option"
                    aria-selected={estChoisie}
                    className={`panneau__option${estChoisie ? ' panneau__option--choisie' : ''}`}
                    onClick={() => {
                      onChoix(option.valeur);
                      fermer();
                    }}
                  >
                    {option.nom}
                  </button>
                </li>
              );
            })}
            <IndiceDefilement />
          </ul>
        </Panneau>
      ) : null}
    </>
  );
}
