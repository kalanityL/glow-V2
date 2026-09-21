import { useState, type FormEvent } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
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
import { peseeDuJour } from '../domaine/pesees';
import { poidsDepuisKg, poidsEnKg, type UnitePoids } from '../domaine/unites';
import { idPesee, type WeightLog } from '../donnees/v1';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
import { IndiceDefilement } from '../components/IndiceDefilement';

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
 * rien ne s'écrit sans ce oui ; NON FERME LE FORMULAIRE SANS RIEN ÉCRIRE
 * (2026-09-21, « non -> ferme le formulaire sans enregistrer »). En modification, « Annuler » et « Mettre à
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
  ajoutTraitement,
  fond,
}: {
  /** Le poids proposé d'avance, forme stockée. */
  poidsPropose: string;
  unite: UnitePoids;
  /** Le journal, pour savoir si le jour est déjà pesé. */
  pesees: readonly WeightLog[];
  forme: Forme | null;
  /** La pesée à modifier : le formulaire part d'elle. */
  initiale?: WeightLog;
  onValider: (pesee: WeightLog) => void;
  onAnnuler?: () => void;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const modification = initiale !== undefined;
  const maintenant = new Date();
  const [date, setDate] = useState(initiale?.date ?? dateLocale(maintenant));
  const [heure, setHeure] = useState(initiale?.time ?? heureRonde(heureLocale(maintenant)));
  const [poids, setPoids] = useState(initiale ? poidsDepuisKg(initiale.weight, unite) : poidsPropose);
  const [editeDate, setEditeDate] = useState(false);
  const [editeHeure, setEditeHeure] = useState(false);
  /* Le jour déjà pesé : la question se dit, et attend son oui. */
  const [remplacer, setRemplacer] = useState(false);

  /* LA LIGNE DE LA V1 : son identifiant (gardé en modification), le poids
     en kilogrammes quelle que soit l'unité affichée, le drapeau de départ
     tel qu'il était. */
  const consigner = () =>
    onValider({
      id: initiale?.id ?? idPesee(),
      date,
      time: heure,
      weight: poidsEnKg(poids, unite),
      isStartingWeight: initiale?.isStartingWeight ?? false,
    });
  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    const dejaLa = peseeDuJour(pesees, date);
    if (dejaLa && dejaLa.id !== initiale?.id) {
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

          {/* LE CORPS DÉFILE ENTRE L'ENTÊTE ET LE PIED, figés (2026-09-21,
              « bandeau titre et bouton valider figés, c'est le reste qui
              scrolle »). */}
          <div className="prise__corps">
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
                  <button type="button" className="bouton bouton--second" onClick={onAccueil}>
                    {textes.non}
                  </button>
                  <button type="button" className="bouton" onClick={consigner}>
                    {textes.oui}
                  </button>
                </div>
              </div>
            ) : null}

            <IndiceDefilement />
          </div>

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
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
