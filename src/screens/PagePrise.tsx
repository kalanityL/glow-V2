import { useState, type FormEvent } from 'react';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import { surLeFond, type FondProps } from './Accueil';
import { IconeCalendrier, IconeCoche, IconeComprime, IconeCroix, IconeHorloge, IconePlus, IconeSeringue } from '../components/Icones';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { dateLocale, formaterDateCourte } from '../domaine/dates';
import { TRAITEMENTS, type Forme } from '../domaine/traitements';
import {
  MINUTES_RONDES,
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

/**
 * LA PAGE D'UNE PRISE (2026-09-20, « ajouter->injection : envoie vers une
 * page ultra simple avec uniquement le fomulaire d'ajout d'injection de la
 * v1 avec la meme mise en page, mais pas en bloc reste page vitré, en mode
 * page simple ») : une page ordinaire — l'entête des pages, la barre du
 * bas — dont le contenu n'est qu'une carte, LE FORMULAIRE DE LA V1
 * (`InjectionForm.tsx`, `useInjectionForm.ts`), mise en page comprise :
 * l'entête avec l'icône de la forme, le titre en capitales, la marque et la
 * croix ; la date et l'heure côte à côte, éditées en place ; la zone (pas
 * sous forme orale) ; la dose parmi les paliers de la spécialité, ou une
 * autre tapée ; « + Notes » ; « Valider ».
 *
 * Ce qu'il fait : ce que la SPEC dit d'une prise. La date d'aujourd'hui et
 * l'heure de maintenant ramenée à la minute ronde inférieure sont
 * proposées ; le premier palier aussi ; la zone d'avance. Une dose absente,
 * illisible ou nulle est REFUSÉE et la règle se dit sous le champ. Les
 * notes vides sont absentes. L'identifiant du traitement est écrit depuis
 * le profil.
 *
 * L'écran qui suit la validation n'existe pas encore (« je te donnerai
 * l'écran de validation ensuite ») : validée, la prise remonte à `App`.
 */
export function PagePrise({
  forme,
  traitement,
  onAccueil,
  onOuvrirCompte,
  onValider,
  onAjouter,
  fond,
}: {
  forme: Forme;
  /** L'identifiant du traitement répondu. */
  traitement: string;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onValider: (prise: Prise) => void;
  onAjouter: (module: ModuleId) => void;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const specialite = TRAITEMENTS.find((t) => t.id === traitement);
  const paliers = specialite?.paliersMg ?? [];
  const orale = forme === 'comprime';
  const separateur = textes.separateurDecimal;
  const mgEcrit = (mg: number) => String(mg).replace('.', separateur);

  const maintenant = new Date();
  const [date, setDate] = useState(dateLocale(maintenant));
  const [heure, setHeure] = useState(heureRonde(heureLocale(maintenant)));
  const [editeDate, setEditeDate] = useState(false);
  const [editeHeure, setEditeHeure] = useState(false);
  const [zone, setZone] = useState<Zone>(orale ? 'voie-orale' : ZONE_PAR_DEFAUT);
  const [palier, setPalier] = useState<number>(paliers[0] ?? 0);
  const [autreDose, setAutreDose] = useState(false);
  const [doseTapee, setDoseTapee] = useState('');
  const [refuse, setRefuse] = useState(false);
  const [notesOuvertes, setNotesOuvertes] = useState(false);
  const [notes, setNotes] = useState('');

  const [heureH, heureM] = heure.split(':');

  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    const dose = autreDose ? doseDepuisSaisie(doseTapee) : palier > 0 ? palier : null;
    if (dose === null) {
      setRefuse(true);
      return;
    }
    setRefuse(false);
    onValider({
      date,
      heure,
      doseMg: dose,
      zone,
      notes: notes.trim() ? notes.trim() : undefined,
      traitement,
    });
  };

  return (
    <div
      className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}
      onClick={surLeFond(fond.onOuvrirBloc)}
    >
      <div className="page__colonne" onClick={surLeFond(fond.onOuvrirBloc)}>
        <EntetePage titre={textes.accueil.traitement[forme]} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            {orale ? <IconeComprime /> : <IconeSeringue />}
            <h2 className="prise__titre">{textes.prise.titre[forme]}</h2>
            <span className="prise__marque">{specialite?.nom}</span>
            <button type="button" className="tiroir__fermer prise__fermer" aria-label={textes.fermer} onClick={onAccueil}>
              <IconeCroix />
            </button>
          </div>

          {/* LA DATE ET L'HEURE, éditées en place comme dans la V1 : la
              valeur est un bouton, elle devient un champ, elle se referme en
              la quittant ou sur Entrée et Échap. */}
          <div className="prise__moment">
            {editeDate ? (
              <span className="prise__edition">
                <input
                  type="date"
                  value={date}
                  autoFocus
                  aria-label={textes.groupes.age}
                  onChange={(e) => {
                    if (e.target.value) setDate(e.target.value);
                  }}
                  onBlur={() => setEditeDate(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') setEditeDate(false);
                  }}
                />
              </span>
            ) : (
              <button type="button" className="prise__quand" onClick={() => setEditeDate(true)}>
                <IconeCalendrier />
                <span>{formaterDateCourte(date, langue)}</span>
              </button>
            )}
            {editeHeure ? (
              <span
                className="prise__edition"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEditeHeure(false);
                }}
              >
                <select value={heureH} autoFocus onChange={(e) => setHeure(`${e.target.value}:${heureM}`)}>
                  {Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select
                  value={heureM}
                  onChange={(e) => {
                    setHeure(`${heureH}:${e.target.value}`);
                    setEditeHeure(false);
                  }}
                >
                  {MINUTES_RONDES.map((m) => String(m).padStart(2, '0')).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </span>
            ) : (
              <button type="button" className="prise__quand" onClick={() => setEditeHeure(true)}>
                <IconeHorloge />
                <span>{heure}</span>
              </button>
            )}
          </div>

          {/* LA ZONE — pas sous forme orale, où elle vaut « voie orale ». */}
          {!orale ? (
            <span className="prise__boite">
              <select className="prise__select" value={zone} onChange={(e) => setZone(e.target.value as Zone)}>
                {ZONES_INJECTION.map((z) => (
                  <option key={z} value={z}>
                    {textes.prise.zones[z]}
                  </option>
                ))}
              </select>
            </span>
          ) : null}

          {/* LA DOSE : les paliers de la spécialité, ou une autre tapée. */}
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
          ) : (
            <span className="prise__boite">
              <select
                className="prise__select"
                value={palier}
                onChange={(e) => {
                  setPalier(Number(e.target.value));
                  setRefuse(false);
                }}
              >
                {paliers.map((mg, i) => (
                  <option key={mg} value={mg}>
                    {textes.prise.palier(mgEcrit(mg), i === 0 ? 'initiation' : i === paliers.length - 1 ? 'max' : null)}
                  </option>
                ))}
              </select>
            </span>
          )}
          <button
            type="button"
            className="prise__lien"
            onClick={() => {
              setAutreDose(!autreDose);
              setRefuse(false);
            }}
          >
            {autreDose ? textes.prise.prereglages : textes.prise.autreDose}
          </button>
          {refuse ? <p className="regle regle--manquee prise__regle">{textes.prise.regleDose}</p> : null}

          {/* LES NOTES : un lien qui déplie deux lignes. Replier n'efface pas. */}
          {notesOuvertes ? (
            <>
              <button type="button" className="prise__lien" onClick={() => setNotesOuvertes(false)}>
                <IconeCroix />
                <span>{textes.prise.masquerNotes}</span>
              </button>
              <textarea
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

          <div className="prise__pied">
            <button type="submit" className="bouton prise__valider">
              <IconeCoche />
              <span>{textes.prise.valider}</span>
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
