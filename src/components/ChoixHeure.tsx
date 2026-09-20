import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Panneau } from './Panneau';
import { MINUTES_RONDES } from '../domaine/prises';
import { centrerDansSaListe } from '../plateforme/navigateur';

const HEURES = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'));
const MINUTES = MINUTES_RONDES.map((m) => String(m).padStart(2, '0'));

/**
 * LE CHOIX D'UNE HEURE — celui de la V1 (`TimeSelect.tsx`, décision du
 * 2026-08-08) : deux colonnes, les heures et LES MINUTES RONDES, dans un
 * panneau dessiné par l'application. Choisir une heure laisse le panneau
 * ouvert ; choisir une minute le referme. Une minute héritée qui n'est pas
 * ronde se voit, éteinte : le champ ne ment pas, mais ne la propose pas.
 */
export function ChoixHeure({
  valeur,
  onChoix,
  nom,
  icone,
  ouvertDAbord,
  onFerme,
}: {
  /** `HH:MM`. */
  valeur: string;
  onChoix: (heure: string) => void;
  nom: string;
  icone?: ReactNode;
  ouvertDAbord?: boolean;
  onFerme?: () => void;
}) {
  const [ouvert, setOuvert] = useState(ouvertDAbord ?? false);
  const boite = useRef<HTMLButtonElement>(null);
  const [heure, minute] = valeur.split(':');
  const fermer = useCallback(() => {
    setOuvert(false);
    onFerme?.();
  }, [onFerme]);

  const minutes = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort();

  return (
    <>
      <button
        ref={boite}
        type="button"
        className={`choix${ouvert ? ' choix--ouvert' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={nom}
        onClick={() => (ouvert ? fermer() : setOuvert(true))}
      >
        {icone}
        <span className="choix__valeur">{valeur}</span>
        <span className="choix__chevron" aria-hidden="true" />
      </button>
      {ouvert ? (
        <Panneau ancre={boite} hauteur={300} largeur={200} onFermer={fermer} classe="panneau--heures">
          <ul className="heures__colonne" role="listbox">
            {HEURES.map((h) => (
              <li key={h} role="presentation">
                <button
                  ref={h === heure ? centrerDansSaListe : undefined}
                  type="button"
                  role="option"
                  aria-selected={h === heure}
                  className={`panneau__option heures__valeur${h === heure ? ' panneau__option--choisie' : ''}`}
                  onClick={() => onChoix(`${h}:${minute}`)}
                >
                  {h}
                </button>
              </li>
            ))}
          </ul>
          <ul className="heures__colonne" role="listbox">
            {minutes.map((m) => (
              <li key={m} role="presentation">
                <button
                  ref={m === minute ? centrerDansSaListe : undefined}
                  type="button"
                  role="option"
                  aria-selected={m === minute}
                  disabled={!MINUTES.includes(m)}
                  className={`panneau__option heures__valeur${m === minute ? ' panneau__option--choisie' : ''}`}
                  onClick={() => {
                    onChoix(`${heure}:${m}`);
                    fermer();
                  }}
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        </Panneau>
      ) : null}
    </>
  );
}
