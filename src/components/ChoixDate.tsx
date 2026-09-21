import { IndiceDefilement } from './IndiceDefilement';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Panneau } from './Panneau';
import { IconeChevronDroit, IconeChevronGauche } from './Icones';
import { useTextes, detecterLangue } from '../i18n/useTextes';
import { anneeMoisDe, dateLocale, formaterDateCourte, grilleDuMois, moisDecale } from '../domaine/dates';

/**
 * LE CHOIX D'UNE DATE — le calendrier de la V1 (`DateSelect.tsx`), dessiné
 * par l'application : le mois et l'année entre deux flèches, les jours en
 * court à partir du lundi, six semaines de jours ; aujourd'hui cerné, le
 * jour choisi plein. Choisir un jour referme. Jamais le sélecteur natif :
 * il sort de l'écran et n'est pas au thème.
 */
export function ChoixDate({
  valeur,
  onChoix,
  nom,
  icone,
  ouvertDAbord,
  onFerme,
}: {
  /** `AAAA-MM-JJ`. */
  valeur: string;
  onChoix: (date: string) => void;
  nom: string;
  icone?: ReactNode;
  ouvertDAbord?: boolean;
  onFerme?: () => void;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const [ouvert, setOuvert] = useState(ouvertDAbord ?? false);
  const [vue, setVue] = useState(() => anneeMoisDe(valeur));
  const boite = useRef<HTMLButtonElement>(null);
  const aujourdhui = dateLocale(new Date());
  const fermer = useCallback(() => {
    setOuvert(false);
    onFerme?.();
  }, [onFerme]);
  const ouvrir = () => {
    setVue(anneeMoisDe(valeur));
    setOuvert(true);
  };

  return (
    <>
      <button
        ref={boite}
        type="button"
        className={`choix${ouvert ? ' choix--ouvert' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={ouvert}
        aria-label={nom}
        onClick={() => (ouvert ? fermer() : ouvrir())}
      >
        {icone}
        <span className="choix__valeur">{formaterDateCourte(valeur, langue)}</span>
        <span className="choix__chevron" aria-hidden="true" />
      </button>
      {ouvert ? (
        <Panneau ancre={boite} hauteur={340} largeur={300} onFermer={fermer} classe="panneau--calendrier">
          <div className="calendrier">
            <div className="calendrier__entete">
              <button
                type="button"
                className="calendrier__fleche"
                aria-label={textes.calendrier.moisPrecedent}
                onClick={() => setVue(moisDecale(vue.annee, vue.mois, -1))}
              >
                <IconeChevronGauche />
              </button>
              <span className="calendrier__mois">
                {textes.calendrier.mois[vue.mois - 1]} {vue.annee}
              </span>
              <button
                type="button"
                className="calendrier__fleche"
                aria-label={textes.calendrier.moisSuivant}
                onClick={() => setVue(moisDecale(vue.annee, vue.mois, 1))}
              >
                <IconeChevronDroit />
              </button>
            </div>
            <div className="calendrier__grille" role="grid">
              {textes.calendrier.jours.map((jour, i) => (
                <span key={i} className="calendrier__nomJour" aria-hidden="true">
                  {jour}
                </span>
              ))}
              {grilleDuMois(vue.annee, vue.mois).map((c) => (
                <button
                  key={c.date}
                  type="button"
                  className={`calendrier__jour${c.dansLeMois ? '' : ' calendrier__jour--voisin'}${
                    c.date === aujourdhui ? ' calendrier__jour--aujourdhui' : ''
                  }${c.date === valeur ? ' calendrier__jour--choisi' : ''}`}
                  aria-label={formaterDateCourte(c.date, langue)}
                  aria-pressed={c.date === valeur}
                  onClick={() => {
                    onChoix(c.date);
                    fermer();
                  }}
                >
                  {c.jour}
                </button>
              ))}
            </div>
            <IndiceDefilement />
          </div>
        </Panneau>
      ) : null}
    </>
  );
}
