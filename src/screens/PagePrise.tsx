import { MessageEnPlace } from '../components/MessageEnPlace';
import { useEffect, useState, type FormEvent } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { BlocTraitement } from './BlocTraitement';
import { ChoixDate } from '../components/ChoixDate';
import { ChoixHeure } from '../components/ChoixHeure';
import { IconeCalendrier, IconeCoche, IconeComprime, IconeCroix, IconeHorloge, IconePlus, IconeSeringue } from '../components/Icones';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { dateLocale, formaterDateCourte } from '../domaine/dates';
import { TRAITEMENTS, type Forme } from '../domaine/traitements';
import {
  NOTE_MAX,
  ZONES_INJECTION,
  ZONE_PAR_DEFAUT,
  doseDepuisSaisie,
  heureLocale,
  heureRonde,
  type Prise,
  type Zone,
} from '../domaine/prises';
import type { ModuleId } from '../app/modules';
import { montrerEnEntier } from '../plateforme/navigateur';
import type { useParcours } from '../app/useParcours';
import { idPrise } from '../donnees/v1';
import { brandDepuisTraitement } from '../donnees/conversions';
import { appliquerChoixTraitement, choixTraitementDe } from '../app/choixTraitement';
import { IndiceDefilement } from '../components/IndiceDefilement';

/**
 * LA PAGE D'UNE PRISE (2026-09-20, « ajouter->injection : envoie vers une
 * page ultra simple avec uniquement le fomulaire d'ajout d'injection de la
 * v1 avec la meme mise en page, mais pas en bloc reste page vitré, en mode
 * page simple ») : une page ordinaire — l'entête des pages, la barre du
 * bas — dont le contenu n'est qu'une carte, LE FORMULAIRE DE LA V1
 * (`InjectionForm.tsx`, `useInjectionForm.ts`), mise en page comprise :
 * l'entête avec l'icône de la forme, le titre en capitales et la croix ; LE
 * NOM DU TRAITEMENT sur sa ligne, entier, jamais coupé — touché, il
 * PROPOSE de mettre à jour le traitement, et « Oui » ouvre le bloc « Mon
 * traitement » ; fermé, on est de retour sur le formulaire, au traitement
 * mis à jour (2026-09-20). DANS L'ORDRE DU 2026-09-21 (« d'abord date et
 * heure ; puis nom du médicament et a la place du select, des boutons pour
 * chaque dosage avec un dosage preselectionné, et un bouton autre qui
 * permet de rentrer un dosage personnalisé ; plus besoin du lien autre
 * dose ; on ajoute le label zone d'injection avec 6 boutons ») : la date
 * et l'heure côte à côte, éditées en place, l'icône à gauche ; le nom du
 * traitement, puis UN BOUTON PAR PALIER, le premier choisi d'avance, et
 * « Autre » qui ouvre la saisie d'un dosage ; puis « Zone d'injection » et
 * six boutons — Abdomen G/D, Bras G/D, Cuisse G/D (pas sous forme orale) ;
 * « + Notes » ; « Valider ». RIEN EN GRAS. AUCUN `select` NATIF : la date
 * et l'heure déroulent leur panneau dessiné (`ChoixDate`, `ChoixHeure`).
 *
 * Ce qu'il fait : ce que la SPEC dit d'une prise. La date d'aujourd'hui et
 * l'heure de maintenant ramenée à la minute ronde inférieure sont
 * proposées ; le premier palier aussi ; la zone d'avance. Une dose absente,
 * illisible ou nulle est REFUSÉE et la règle se dit sous le champ. Les
 * notes vides sont absentes. L'identifiant du traitement est écrit depuis
 * le profil. Sans plus de traitement à la sortie du bloc, la page n'a plus
 * lieu d'être : retour à l'accueil.
 *
 * EN MODIFICATION (2026-09-20, « clic sur bloc récapitulatif : réouvre le
 * formulaire avec les données enregistrées par defaut, et bouton annuler et
 * mettre à jour ») : la prise à modifier remplit le formulaire — sa date,
 * son heure, sa zone, sa dose (un palier, ou « Autre dose » si elle n'en
 * est pas un), ses notes dépliées si elle en a — et le pied porte
 * « Annuler » et « Mettre à jour ». C'est le chemin du recueil complet de
 * la SPEC : une dose finie strictement positive, rien d'autre, et le
 * traitement réécrit depuis le profil.
 */
export function PagePrise({
  parcours,
  forme,
  traitement,
  onAccueil,
  onOuvrirCompte,
  onJournal,
  onValider,
  onAjouter,
  ajoutTraitement,
  fond,
  initiale,
  onAnnuler,
}: {
  parcours: ReturnType<typeof useParcours>;
  forme: Forme;
  /** L'identifiant du traitement répondu. */
  traitement: string;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  /** La page Journal, par la barre du bas (2026-09-26). */
  onJournal: () => void;
  onValider: (prise: Prise) => void;
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
  /** La prise à modifier : le formulaire part d'elle. Absente, c'est une
      nouvelle prise. */
  initiale?: Prise;
  /** « Annuler », en modification : on repart sans rien écrire. */
  onAnnuler?: () => void;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const specialite = TRAITEMENTS.find((t) => t.id === traitement);
  const paliers = specialite?.paliersMg ?? [];
  const orale = forme === 'comprime';
  const separateur = textes.separateurDecimal;
  const mgEcrit = (mg: number) => String(mg).replace('.', separateur);
  const modification = initiale !== undefined;
  const doseInitialeEstUnPalier = initiale ? paliers.includes(initiale.dose) : true;

  const maintenant = new Date();
  const [date, setDate] = useState(initiale?.date ?? dateLocale(maintenant));
  const [heure, setHeure] = useState(initiale?.time ?? heureRonde(heureLocale(maintenant)));
  const [editeDate, setEditeDate] = useState(false);
  const [editeHeure, setEditeHeure] = useState(false);
  const [zone, setZone] = useState<Zone>((initiale?.site as Zone | undefined) ?? (orale ? 'prise_orale' : ZONE_PAR_DEFAUT));
  const [palier, setPalier] = useState<number>(
    initiale && doseInitialeEstUnPalier ? initiale.dose : (paliers[0] ?? 0),
  );
  const [autreDose, setAutreDose] = useState(!doseInitialeEstUnPalier);
  const [doseTapee, setDoseTapee] = useState(initiale && !doseInitialeEstUnPalier ? mgEcrit(initiale.dose) : '');
  const [refuse, setRefuse] = useState(false);
  const [notesOuvertes, setNotesOuvertes] = useState(Boolean(initiale?.notes));
  const [notes, setNotes] = useState(initiale?.notes ?? '');
  /* La proposition sous le nom du traitement, puis le bloc lui-même. */
  const [proposition, setProposition] = useState(false);
  const [blocTraitement, setBlocTraitement] = useState(false);

  /* Le traitement mis à jour : le premier palier de la nouvelle spécialité,
     et la zone qui va avec la forme. */
  useEffect(() => {
    setPalier(paliers[0] ?? 0);
    setZone((avant) => (orale ? 'prise_orale' : avant === 'prise_orale' ? ZONE_PAR_DEFAUT : avant));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traitement, forme]);

  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    const dose = autreDose ? doseDepuisSaisie(doseTapee) : palier > 0 ? palier : null;
    if (dose === null) {
      setRefuse(true);
      return;
    }
    setRefuse(false);
    /* LA LIGNE DE LA V1 : son identifiant (gardé en modification), le
       traitement écrit depuis le profil, dans les mots de la V1. */
    onValider({
      id: initiale?.id ?? idPrise(),
      date,
      time: heure,
      dose,
      site: zone,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      brand: brandDepuisTraitement(traitement),
    });
  };

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
    >
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.traitement[forme]} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            {orale ? <IconeComprime /> : <IconeSeringue />}
            <h2 className="prise__titre">
              {modification ? textes.prise.titreModification[forme] : textes.prise.titre[forme]}
            </h2>
            <button type="button" className="tiroir__fermer prise__fermer" aria-label={textes.fermer} onClick={onAccueil}>
              <IconeCroix />
            </button>
          </div>

          {/* LE CORPS DÉFILE ENTRE L'ENTÊTE ET LE PIED, figés (2026-09-21,
              « bandeau titre et bouton valider figés, c'est le reste qui
              scrolle »). */}
          <div className="prise__corps">
            {/* LA DATE ET L'HEURE D'ABORD (2026-09-21), éditées en place comme
                dans la V1 : la valeur est un bouton ; touchée, elle devient une
                boîte, l'icône à gauche, et déroule son panneau. */}
            <div className="prise__moment">
              {editeDate ? (
                <ChoixDate
                  valeur={date}
                  onChoix={setDate}
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
                  nom={textes.prise.titre[forme]}
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

            {/* LE NOM DU TRAITEMENT, sur sa ligne, entier (2026-09-20, « il ne
                doit pas etre coupé ») ; touché, il propose la mise à jour. */}
            <button type="button" className="prise__marque" onClick={() => setProposition(!proposition)}>
              {specialite?.nom}
            </button>
            {proposition ? (
              <div className="prise__proposition">
                <MessageEnPlace classe="prise__question">{textes.prise.mettreAJour}</MessageEnPlace>
                <div className="boutons">
                  <button type="button" className="bouton bouton--second" onClick={() => setProposition(false)}>
                    {textes.non}
                  </button>
                  <button
                    type="button"
                    className="bouton"
                    onClick={() => {
                      setProposition(false);
                      setBlocTraitement(true);
                    }}
                  >
                    {textes.oui}
                  </button>
                </div>
              </div>
            ) : null}

            {/* UN BOUTON PAR PALIER, le premier choisi d'avance, et « Autre »
                qui ouvre la saisie d'un dosage (2026-09-21). */}
            <div className="prise__boutons" role="radiogroup" aria-label={textes.prise.autreDoseVide}>
              {paliers.map((mg) => {
                const choisi = !autreDose && palier === mg;
                return (
                  <button
                    key={mg}
                    type="button"
                    role="radio"
                    aria-checked={choisi}
                    className={`prise__bouton${choisi ? ' prise__bouton--choisi' : ''}`}
                    onClick={() => {
                      setAutreDose(false);
                      setPalier(mg);
                      setRefuse(false);
                    }}
                  >
                    {mgEcrit(mg)} mg
                  </button>
                );
              })}
              <button
                type="button"
                role="radio"
                aria-checked={autreDose}
                className={`prise__bouton${autreDose ? ' prise__bouton--choisi' : ''}`}
                onClick={() => {
                  setAutreDose(true);
                  setRefuse(false);
                }}
              >
                {textes.prise.autre}
              </button>
            </div>
            {autreDose ? (
              <input
                className="prise__dose"
                type="text"
                inputMode="decimal"
                placeholder={textes.prise.autreDoseVide}
                aria-label={textes.prise.autreDoseVide}
                value={doseTapee}
                autoFocus
                onChange={(e) => {
                  setDoseTapee(e.target.value);
                  if (doseDepuisSaisie(e.target.value) !== null) setRefuse(false);
                }}
              />
            ) : null}
            {refuse ? <MessageEnPlace classe="prise__regle">{textes.prise.regleDose}</MessageEnPlace> : null}

            {/* LA ZONE D'INJECTION : son intitulé et six boutons (2026-09-21) —
                pas sous forme orale, où elle vaut « voie orale ». */}
            {!orale ? (
              <>
                <p className="prise__etiquette">{textes.prise.zone}</p>
                <div className="prise__boutons prise__boutons--zones" role="radiogroup" aria-label={textes.prise.zone}>
                  {ZONES_INJECTION.map((z) => (
                    <button
                      key={z}
                      type="button"
                      role="radio"
                      aria-checked={zone === z}
                      className={`prise__bouton${zone === z ? ' prise__bouton--choisi' : ''}`}
                      onClick={() => setZone(z)}
                    >
                      {textes.prise.zonesCourtes[z]}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {/* LES NOTES : un lien qui déplie deux lignes. Replier n'efface pas. */}
            {notesOuvertes ? (
              <>
                <button type="button" className="prise__lien" onClick={() => setNotesOuvertes(false)}>
                  <IconeCroix />
                  <span>{textes.prise.masquerNotes}</span>
                </button>
                <textarea
                  /* Le champ entier sous les yeux dès qu'il s'ouvre (2026-09-21,
                     « quand on ouvre note, il faut que tout le champ soit
                     visible ») : le corps défile jusqu'à lui. */
                  ref={montrerEnEntier}
                  className="prise__notes"
                  rows={2}
                  maxLength={NOTE_MAX}
                  placeholder={textes.prise.notesVide}
                  aria-label={textes.prise.notes}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </>
            ) : (
              <button type="button" className="prise__lien" onClick={() => setNotesOuvertes(true)}>
                <IconePlus />
                <span>{textes.prise.notes}</span>
              </button>
            )}

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

      {blocTraitement ? (
        <BlocTraitement
          courant={choixTraitementDe(parcours.reponses)}
          onEnregistrer={(choix) => appliquerChoixTraitement(parcours, choix)}
          onFermer={() => setBlocTraitement(false)}
        />
      ) : null}

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={onOuvrirCompte}
        onJournal={onJournal}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
