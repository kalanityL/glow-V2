import { useState, type FormEvent } from 'react';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { ChoixDate } from '../components/ChoixDate';
import { ChoixHeure } from '../components/ChoixHeure';
import { ReglePoids } from '../components/ReglePoids';
import { IconeBalance, IconeCalendrier, IconeCoche, IconeCroix, IconeHorloge } from '../components/Icones';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { dateLocale, formaterDateCourte } from '../domaine/dates';
import { heureLocale, heureRonde } from '../domaine/prises';
import { peseeDuJour, type Pesee } from '../domaine/pesees';
import type { UnitePoids } from '../domaine/unites';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';

/**
 * LA PAGE D'UNE PESÉE (2026-09-21, « ajouter balance : idem que ajouter
 * injection, utilise le system de regle crantée pour choisir le poids ») :
 * la page d'une prise, au poids — l'entête des pages, la barre du bas, une
 * carte : l'icône de la balance et « Nouvelle pesée » (les mots de la V1,
 * `WeighInForm.tsx`), la croix ; la date et l'heure côte à côte, éditées en
 * place ; LA RÈGLE CRANTÉE du poids (`ReglePoids`, celle du bloc du poids) ;
 * « Valider ». Rien en gras.
 *
 * LE POIDS PROPOSÉ D'AVANCE est calculé par l'appelant (`domaine/pesees.ts`,
 * `poidsLePlusRecent`) : la pesée la plus proche d'aujourd'hui qui n'est
 * pas dans le futur, sinon le poids du profil.
 *
 * UNE PESÉE PAR JOUR (SPEC) : valider sur un jour déjà pesé propose de
 * remplacer — la question se dit sous le formulaire, avec Non / Oui —,
 * rien ne s'écrit sans ce oui. En modification, « Annuler » et « Mettre à
 * jour » ; la pesée mise à jour remplace celle qu'on modifiait.
 *
 * Pas encore : les mensurations de la V1 (« + Ajouter des mensurations »).
 */
export function PagePesee({
  poidsPropose,
  unite,
  pesees,
  forme,
  initiale,
  onValider,
  onAnnuler,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  fond,
}: {
  /** Le poids proposé d'avance, forme stockée. */
  poidsPropose: string;
  unite: UnitePoids;
  /** Le journal, pour savoir si le jour est déjà pesé. */
  pesees: readonly Pesee[];
  forme: Forme | null;
  /** La pesée à modifier : le formulaire part d'elle. */
  initiale?: Pesee;
  onValider: (pesee: Pesee) => void;
  onAnnuler?: () => void;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const modification = initiale !== undefined;
  const maintenant = new Date();
  const [date, setDate] = useState(initiale?.date ?? dateLocale(maintenant));
  const [heure, setHeure] = useState(initiale?.heure ?? heureRonde(heureLocale(maintenant)));
  const [poids, setPoids] = useState(initiale?.poids ?? poidsPropose);
  const [editeDate, setEditeDate] = useState(false);
  const [editeHeure, setEditeHeure] = useState(false);
  /* Le jour déjà pesé : la question se dit, et attend son oui. */
  const [remplacer, setRemplacer] = useState(false);

  const consigner = () => onValider({ date, heure, poids });
  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    const dejaLa = peseeDuJour(pesees, date);
    if (dejaLa && dejaLa !== initiale && !(modification && initiale?.date === date)) {
      setRemplacer(true);
      return;
    }
    consigner();
  };

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
    >
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.modules.balance} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            <IconeBalance />
            <h2 className="prise__titre">{modification ? textes.pesee.titreModification : textes.pesee.titre}</h2>
            <button type="button" className="tiroir__fermer prise__fermer" aria-label={textes.fermer} onClick={onAccueil}>
              <IconeCroix />
            </button>
          </div>

          <div className="prise__moment">
            {editeDate ? (
              <ChoixDate
                valeur={date}
                onChoix={(d) => {
                  setDate(d);
                  setRemplacer(false);
                }}
                nom={textes.groupes.age}
                icone={<IconeCalendrier />}
                ouvertDAbord
                onFerme={() => setEditeDate(false)}
              />
            ) : (
              <button type="button" className="prise__quand" onClick={() => setEditeDate(true)}>
                <IconeCalendrier />
                <span>{formaterDateCourte(date, langue)}</span>
              </button>
            )}
            {editeHeure ? (
              <ChoixHeure
                valeur={heure}
                onChoix={setHeure}
                nom={textes.pesee.titre}
                icone={<IconeHorloge />}
                ouvertDAbord
                onFerme={() => setEditeHeure(false)}
              />
            ) : (
              <button type="button" className="prise__quand" onClick={() => setEditeHeure(true)}>
                <IconeHorloge />
                <span>{heure}</span>
              </button>
            )}
          </div>

          <ReglePoids
            valeur={poids}
            unite={unite}
            nom={textes.groupes.poids}
            onValeur={(stocke) => {
              setPoids(stocke);
              setRemplacer(false);
            }}
          />

          {remplacer ? (
            <div className="prise__proposition">
              <p className="regle regle--manquee prise__question">
                {textes.pesee.remplacer(formaterDateCourte(date, langue))}
              </p>
              <div className="boutons">
                <button type="button" className="bouton bouton--second" onClick={() => setRemplacer(false)}>
                  {textes.non}
                </button>
                <button type="button" className="bouton" onClick={consigner}>
                  {textes.oui}
                </button>
              </div>
            </div>
          ) : null}

          <div className="prise__pied">
            {modification ? (
              <button type="button" className="bouton bouton--second prise__valider" onClick={onAnnuler}>
                {textes.prise.annuler}
              </button>
            ) : null}
            <button type="submit" className="bouton prise__valider">
              <IconeCoche />
              <span>{modification ? textes.prise.mettreAJourPrise : textes.prise.valider}</span>
            </button>
          </div>
        </form>
      </div>

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={onOuvrirCompte}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
      />
    </div>
  );
}
