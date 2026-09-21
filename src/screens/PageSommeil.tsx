import { useState, type FormEvent } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { ChoixDate } from '../components/ChoixDate';
import { ChoixHeure } from '../components/ChoixHeure';
import { NoteEtoiles } from '../components/NoteEtoiles';
import { CadranHeure } from '../components/CadranHeure';
import { IndiceDefilement } from '../components/IndiceDefilement';
import { IconeChevronGauche, IconeCoche, IconeCroix, IconeHorloge, IconePlus, IconeSommeil } from '../components/Icones';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { dateLocale, formaterDateCourte } from '../domaine/dates';
import { NOTE_MAX } from '../domaine/prises';
import {
  HEURES_PAR_DEFAUT,
  LONGUE_DUREE_MIN,
  NATURES,
  QUALITE_PAR_DEFAUT,
  SOMMEILS_PAR_JOUR_MAX,
  dureeEcrite,
  dureeMinutes,
  peutAjouterSommeil,
  sommeilEnConflit,
  veille,
} from '../domaine/sommeils';
import { idSommeil, type SleepKind, type SleepLog } from '../donnees/v1';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
import { montrerEnEntier } from '../plateforme/navigateur';

/**
 * LA PAGE D'UN SOMMEIL (2026-09-21, « fais moi l'écran nouveau sommeil et
 * confirmation ») : le formulaire de la V1 (`SleepForm.tsx`,
 * `useSleepForm.ts`) dans la page d'un formulaire de la V2 — le bandeau
 * « Nouveau sommeil », la nature (Nuit / Sieste), deux colonnes
 * Endormissement / Réveil avec leur jour et leur heure, la durée déduite,
 * la note en étoiles (« notez votre nuit ou notez votre sieste »), les
 * notes, « Valider ».
 *
 * SES RÈGLES, celles de la SPEC (§ « Le sommeil »), dans ses mots : une
 * nuit part de la veille 23:00 → 07:00, une sieste du jour même 14:00 →
 * 15:00, la qualité de 3 ; changer de nature ne déplace les instants que
 * s'ils sont encore ceux proposés. Au clic sur Valider, trois jugements :
 * une durée nulle est REFUSÉE ; au-delà de douze heures strictes, une
 * QUESTION — le bouton dit « Confirmer mon choix », toute retouche la
 * désarme, le second clic écrit ; un recouvrement est REFUSÉ, en nommant la
 * plage. Le plafond de quinze par date de réveil refuse. Les deux heures
 * sont sur les minutes rondes (les roues n'en proposent pas d'autres).
 */
export function PageSommeil({
  sommeils,
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
  sommeils: readonly SleepLog[];
  forme: Forme | null;
  initiale?: SleepLog;
  onValider: (sommeil: SleepLog) => void;
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
  const aujourdhui = dateLocale(new Date());
  const [nature, setNature] = useState<SleepKind>(initiale?.kind ?? 'nuit');
  const [dateCoucher, setDateCoucher] = useState(initiale?.bedDate ?? veille(aujourdhui));
  const [heureCoucher, setHeureCoucher] = useState(initiale?.bedTime ?? HEURES_PAR_DEFAUT.nuit.coucher);
  const [dateReveil, setDateReveil] = useState(initiale?.date ?? aujourdhui);
  const [heureReveil, setHeureReveil] = useState(initiale?.time ?? HEURES_PAR_DEFAUT.nuit.reveil);
  const [qualite, setQualite] = useState(initiale?.quality ?? QUALITE_PAR_DEFAUT);
  const [notes, setNotes] = useState(initiale?.notes ?? '');
  const [notesOuvertes, setNotesOuvertes] = useState(Boolean(initiale?.notes));
  const [edite, setEdite] = useState<'dateCoucher' | 'heureCoucher' | 'dateReveil' | 'heureReveil' | null>(null);
  /* DEUX ÉTAPES (2026-09-21, « d'abord 2 gros boutons : nuit ou sieste ;
     ensuite la suite du formulaire, avec une très petite encoche de
     retour ») : la nature d'abord, seule ; puis le reste, avec une encoche
     qui ramène au choix. En modification, on arrive sur la suite. */
  const [etape, setEtape] = useState<'nature' | 'suite'>(modification ? 'suite' : 'nature');
  /* Le refus, dit sous le formulaire ; la question des douze heures, armée. */
  const [refus, setRefus] = useState<string | null>(null);
  const [questionArmee, setQuestionArmee] = useState(false);

  const plage = { bedDate: dateCoucher, bedTime: heureCoucher, date: dateReveil, time: heureReveil };
  const duree = dureeMinutes(plage);

  /* Toute retouche désarme la question et efface le refus. */
  const retouche = <T,>(poser: (v: T) => void) => (v: T) => {
    poser(v);
    setRefus(null);
    setQuestionArmee(false);
  };

  const changerNature = (n: SleepKind) => {
    const anciens = HEURES_PAR_DEFAUT[nature];
    if (heureCoucher === anciens.coucher && heureReveil === anciens.reveil) {
      setHeureCoucher(HEURES_PAR_DEFAUT[n].coucher);
      setHeureReveil(HEURES_PAR_DEFAUT[n].reveil);
      setDateCoucher(n === 'nuit' ? veille(dateReveil) : dateReveil);
    }
    retouche(setNature)(n);
  };

  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (duree <= 0) {
      setRefus(textes.sommeil.refusDureeNulle);
      return;
    }
    if (duree > LONGUE_DUREE_MIN && !questionArmee) {
      setRefus(textes.sommeil.questionLongue(nature, dureeEcrite(duree)));
      setQuestionArmee(true);
      return;
    }
    const conflit = sommeilEnConflit(sommeils, plage, initiale?.id);
    if (conflit) {
      const ecrite = `du ${formaterDateCourte(conflit.bedDate, langue)} ${conflit.bedTime} au ${formaterDateCourte(conflit.date, langue)} ${conflit.time}`;
      setRefus(textes.sommeil.refusRecouvrement(ecrite, modification));
      setQuestionArmee(false);
      return;
    }
    if (!peutAjouterSommeil(sommeils, dateReveil, initiale?.id)) {
      setRefus(textes.sommeil.refusPlafond(SOMMEILS_PAR_JOUR_MAX));
      setQuestionArmee(false);
      return;
    }
    onValider({
      id: initiale?.id ?? idSommeil(),
      date: dateReveil,
      time: heureReveil,
      bedDate: dateCoucher,
      bedTime: heureCoucher,
      kind: nature,
      quality: qualite,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    });
  };

  /* LE JOUR DE L'ENDORMISSEMENT EN MOTS (2026-09-21, « endormissement :
     mettre hier, aujourd'hui ou date, qd on clique ça ouvre le
     calendrier ») : « Hier », « Aujourd'hui », sinon la date. */
  const jourEcrit = (date: string, enMots: boolean) =>
    enMots && date === aujourdhui
      ? textes.sommeil.aujourdhui
      : enMots && date === veille(aujourdhui)
        ? textes.sommeil.hier
        : formaterDateCourte(date, langue);

  const colonne = (
    nom: string,
    cleDate: 'dateCoucher' | 'dateReveil',
    date: string,
    poserDate: (d: string) => void,
    cleHeure: 'heureCoucher' | 'heureReveil',
    heure: string,
    poserHeure: (h: string) => void,
    enMots = false,
  ) => (
    <div className="sommeil__colonne">
      {/* SON DESSIN (2026-09-21, « utilise ce design sauf rien en gras ; ne
          mets pas les pictos endormissement / réveil ») : une carte par
          bord, son nom et son jour dessous, le cadran, l'heure en pastille. */}
      <span className="sommeil__nom">{nom}</span>
      {edite === cleDate ? (
        <ChoixDate valeur={date} onChoix={poserDate} nom={nom} ouvertDAbord onFerme={() => setEdite(null)} />
      ) : (
        <button type="button" className="sommeil__jour" onClick={() => setEdite(cleDate)}>
          {jourEcrit(date, enMots)}
        </button>
      )}
      {/* LE CADRAN, au-dessus de l'heure (2026-09-21) : la boule se glisse,
          l'heure suit ; l'heure change, la boule suit. */}
      <CadranHeure valeur={heure} onValeur={poserHeure} nom={nom} />
      {edite === cleHeure ? (
        <ChoixHeure valeur={heure} onChoix={poserHeure} nom={nom} icone={<IconeHorloge />} ouvertDAbord onFerme={() => setEdite(null)} />
      ) : (
        <button type="button" className="sommeil__heure" onClick={() => setEdite(cleHeure)}>
          <IconeHorloge />
          <span>{heure}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.modules.sommeil} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            <IconeSommeil />
            <h2 className="prise__titre">{modification ? textes.sommeil.titreModification : textes.sommeil.titre}</h2>
            <button type="button" className="tiroir__fermer prise__fermer" aria-label={textes.fermer} onClick={onAccueil}>
              <IconeCroix />
            </button>
          </div>

          {etape === 'nature' ? (
            <div className="prise__corps">
              {/* LA NATURE D'ABORD : nuit ou sieste, deux gros boutons. */}
              <div className="sommeil__natures" role="group" aria-label={textes.accueil.modules.sommeil}>
                {NATURES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`prise__bouton sommeil__nature${nature === n ? ' prise__bouton--choisi' : ''}`}
                    onClick={() => {
                      changerNature(n);
                      setEtape('suite');
                    }}
                  >
                    {textes.sommeil.natures[n]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <div className="prise__corps">
            {/* L'ENCOCHE DE RETOUR, toute petite, et la nature choisie. */}
            <button type="button" className="sommeil__retour" onClick={() => setEtape('nature')} aria-label={textes.retour}>
              <IconeChevronGauche />
              <span>{textes.sommeil.natures[nature]}</span>
            </button>

            {/* DEUX INSTANTS COMPLETS, chacun sa date et son heure. */}
            <div className="sommeil__colonnes">
              {colonne(textes.sommeil.endormissement, 'dateCoucher', dateCoucher, retouche(setDateCoucher), 'heureCoucher', heureCoucher, retouche(setHeureCoucher), true)}
              {colonne(textes.sommeil.reveil, 'dateReveil', dateReveil, retouche(setDateReveil), 'heureReveil', heureReveil, retouche(setHeureReveil))}
            </div>

            {/* LA DURÉE, DÉDUITE — jamais saisie. */}
            <p className="sommeil__duree">
              {textes.sommeil.duree} <span>{dureeEcrite(duree)}</span>
            </p>

            {/* LA NOTE EN ÉTOILES (2026-09-21, « notez votre nuit ou notez
                votre sieste »). */}
            <p className="prise__etiquette">{textes.sommeil.qualite(nature)}</p>
            {/* Pas de mot sous les étoiles (2026-09-21, « pas de label aux
                étoiles ») : le nom de la valeur ne se dit qu'à qui écoute. */}
            <NoteEtoiles valeur={qualite} onValeur={retouche(setQualite)} nom={textes.sommeil.qualite(nature)} noms={textes.sommeil.qualites} />

            {notesOuvertes ? (
              <>
                <button type="button" className="prise__lien" onClick={() => setNotesOuvertes(false)}>
                  <IconeCroix />
                  <span>{textes.prise.masquerNotes}</span>
                </button>
                <textarea
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

            {refus ? <p className="regle regle--manquee prise__regle">{refus}</p> : null}
            <IndiceDefilement />
          </div>
          )}

          {etape === 'suite' ? (
          <div className="prise__pied">
            {modification ? (
              <button type="button" className="bouton bouton--second prise__valider" onClick={onAnnuler}>
                {textes.prise.annuler}
              </button>
            ) : null}
            <button type="submit" className="bouton prise__valider">
              <IconeCoche />
              <span>{questionArmee ? textes.sommeil.confirmerChoix : modification ? textes.sommeil.mettreAJour : textes.prise.valider}</span>
            </button>
          </div>
          ) : null}
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
