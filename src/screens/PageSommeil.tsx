import { MessageEnPlace } from '../components/MessageEnPlace';
import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
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
import { dateDecalee, dateLocale, formaterDateCourte, jourRelatif } from '../domaine/dates';
import { NOTE_MAX } from '../domaine/prises';
import {
  HEURES_PAR_DEFAUT,
  LONGUE_DUREE_MIN,
  NATURES,
  SOMMEILS_PAR_JOUR_MAX,
  dureeEcrite,
  dureeMinutes,
  jaugeDuSommeil,
  noteParDefaut,
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
  onJournal,
  dateProposee,
  onAjouter,
  ajoutTraitement,
  fond,
}: {
  sommeils: readonly SleepLog[];
  forme: Forme | null;
  initiale?: SleepLog;
  /** Le sommeil consigné ; `fini` dit si l'écran de confirmation suit — ou
      si la page continue, vers la note (2026-09-21). */
  onValider: (sommeil: SleepLog, fini: boolean) => void;
  onAnnuler?: () => void;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  /** La page Journal, par la barre du bas (2026-09-26). */
  onJournal: () => void;
  /** LE JOUR PROPOSÉ D'AVANCE (2026-09-26) : la date regardée au journal
      quand on ajoute depuis l'écran d'un jour vide ; sans elle, aujourd'hui. */
  dateProposee?: string;
  onAjouter: (module: ModuleId, date?: string) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const modification = initiale !== undefined;
  const aujourdhui = dateLocale(new Date());
  const [nature, setNature] = useState<SleepKind>(initiale?.kind ?? 'nuit');
  /* AUCUNE NATURE CHOISIE D'AVANCE (2026-09-21 au soir, « nouveau sommeil :
     pas de selection par defaut nuit/sieste ») : au premier écran d'un
     nouveau sommeil, aucun des deux boutons n'est marqué tant qu'on n'en a
     pas touché un ; la nuit reste la valeur de départ de la suite. En
     modification, la nature du sommeil est marquée. */
  const [natureChoisie, setNatureChoisie] = useState(initiale !== undefined);
  /* La date proposée est celle du réveil — la date de la ligne (V1) ; le
     coucher part de sa veille, comme il part de la veille d'aujourd'hui. */
  const jourPropose = dateProposee ?? aujourdhui;
  const [dateCoucher, setDateCoucher] = useState(initiale?.bedDate ?? veille(jourPropose));
  const [heureCoucher, setHeureCoucher] = useState(initiale?.bedTime ?? HEURES_PAR_DEFAUT.nuit.coucher);
  const [dateReveil, setDateReveil] = useState(initiale?.date ?? jourPropose);
  const [heureReveil, setHeureReveil] = useState(initiale?.time ?? HEURES_PAR_DEFAUT.nuit.reveil);
  /* LA NOTE PROPOSÉE D'AVANCE : celle du dernier sommeil de même nature
     (2026-09-21) ; changer de nature au premier écran la repose. */
  const [qualite, setQualite] = useState(initiale?.quality ?? noteParDefaut(sommeils, initiale?.kind ?? 'nuit', aujourdhui, HEURES_PAR_DEFAUT.nuit.reveil));
  const [notes, setNotes] = useState(initiale?.notes ?? '');
  const [notesOuvertes, setNotesOuvertes] = useState(Boolean(initiale?.notes));
  const [edite, setEdite] = useState<'dateCoucher' | 'heureCoucher' | 'dateReveil' | 'heureReveil' | null>(null);
  /* DEUX ÉTAPES (2026-09-21, « d'abord 2 gros boutons : nuit ou sieste ;
     ensuite la suite du formulaire, avec une très petite encoche de
     retour ») : la nature d'abord, seule ; puis le reste, avec une encoche
     qui ramène au choix. En modification, on arrive sur la suite. */
  const [etape, setEtape] = useState<'nature' | 'suite' | 'note'>(modification ? 'suite' : 'nature');
  /* UN OU DEUX ÉCRANS APRÈS LA NATURE (2026-09-21, « le reste : si ça tient
     sur une page sans scroll, sur une page. Sinon on coupe après la barre de
     progression et Valider envoie sur l'écran suivant où on donne une note
     et où on peut ajouter une note ») : la suite est rendue entière une
     fois, mesurée avant la peinture ; si elle déborde, la note et les notes
     passent au troisième écran. Validé, le second écran ENREGISTRE le
     sommeil avec la note d'avance et sans commentaire ; le troisième le met
     à jour — fermé avant, le sommeil a quand même sa note. */
  const corps = useRef<HTMLDivElement>(null);
  const [enDeuxEcrans, setEnDeuxEcrans] = useState<boolean | null>(null);
  useLayoutEffect(() => {
    if (etape !== 'suite' || enDeuxEcrans !== null) return;
    const zone = corps.current;
    if (zone) setEnDeuxEcrans(zone.scrollHeight > zone.clientHeight + 1);
  }, [etape, enDeuxEcrans]);
  /* L'identifiant du sommeil déjà consigné par le second écran. */
  const [idConsigne, setIdConsigne] = useState<string | null>(initiale?.id ?? null);
  /* Le refus, dit sous le formulaire ; la question des douze heures, armée. */
  const [refus, setRefus] = useState<string | null>(null);
  const [questionArmee, setQuestionArmee] = useState(false);

  const plage = { bedDate: dateCoucher, bedTime: heureCoucher, date: dateReveil, time: heureReveil };
  const duree = dureeMinutes(plage);
  /* LA JAUGE suit la durée en temps réel : elle se remplit jusqu'à la durée
     pleine, puis son bleu s'intensifie jusqu'à la durée haute. */
  const jauge = jaugeDuSommeil(nature, duree);

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
    if (!modification) setQualite(noteParDefaut(sommeils, n, dateReveil, heureReveil));
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
    const conflit = sommeilEnConflit(sommeils, plage, idConsigne ?? undefined);
    if (conflit) {
      const ecrite = `du ${formaterDateCourte(conflit.bedDate, langue)} ${conflit.bedTime} au ${formaterDateCourte(conflit.date, langue)} ${conflit.time}`;
      setRefus(textes.sommeil.refusRecouvrement(ecrite, modification));
      setQuestionArmee(false);
      return;
    }
    if (!peutAjouterSommeil(sommeils, dateReveil, idConsigne ?? undefined)) {
      setRefus(textes.sommeil.refusPlafond(SOMMEILS_PAR_JOUR_MAX));
      setQuestionArmee(false);
      return;
    }
    const id = idConsigne ?? idSommeil();
    const sommeil: SleepLog = {
      id,
      date: dateReveil,
      time: heureReveil,
      bedDate: dateCoucher,
      bedTime: heureCoucher,
      kind: nature,
      quality: qualite,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };
    /* En deux écrans, le second consigne avec la note d'avance et passe la
       main au troisième ; le troisième met à jour et finit. */
    const continuer = etape === 'suite' && enDeuxEcrans === true;
    setIdConsigne(id);
    onValider(sommeil, !continuer);
    if (continuer) setEtape('note');
  };

  /* LE JOUR EN MOTS, POUR LES DEUX BORDS (2026-09-21, « endormissement :
     mettre hier, aujourd'hui ou date », puis « la règle pour aujourd'hui /
     hier reste : si date choisie est hier ou aujourd'hui, mettre hier ou
     aujourd'hui ») : « Hier », « Aujourd'hui », sinon la date. */
  const jourEcrit = (date: string) => {
    /* D'avant-hier à après-demain en mots, sinon la date (2026-09-21 au
       soir, « hier / avant hier / aujourd'hui / demain / apres demain /
       sinon la date »). */
    const mot = jourRelatif(date, aujourdhui);
    return mot ? textes.joursRelatifs[mot] : formaterDateCourte(date, langue);
  };

  const colonne = (
    nom: string,
    cleDate: 'dateCoucher' | 'dateReveil',
    date: string,
    poserDate: (d: string) => void,
    cleHeure: 'heureCoucher' | 'heureReveil',
    heure: string,
    poserHeure: (h: string) => void,
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
          {jourEcrit(date)}
        </button>
      )}
      {/* LE CADRAN, au-dessus de l'heure (2026-09-21) : la boule se glisse,
          l'heure suit ; l'heure change, la boule suit. */}
      {/* Passer minuit sur le cadran change le jour du bord (2026-09-21 au
          soir) : le calendrier suit la boule. */}
      <CadranHeure valeur={heure} onValeur={poserHeure} onJour={(jours) => poserDate(dateDecalee(date, jours))} nom={nom} />
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

  /* LA NOTE EN ÉTOILES (2026-09-21, « notez votre nuit ou notez votre
     sieste » ; pas de mot dessous) et les notes : sur la suite quand tout
     tient, sinon sur le troisième écran. */
  const noteEtNotes = (
    <>
      <p className="prise__etiquette">{textes.sommeil.qualite(nature)}</p>
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
    </>
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
                    className={`prise__bouton sommeil__nature${natureChoisie && nature === n ? ' prise__bouton--choisi' : ''}`}
                    onClick={() => {
                      changerNature(n);
                      setNatureChoisie(true);
                      setEtape('suite');
                    }}
                  >
                    {textes.sommeil.natures[n]}
                  </button>
                ))}
              </div>
            </div>
          ) : etape === 'suite' ? (
          <div className="prise__corps" ref={corps}>
            {/* L'ENCOCHE DE RETOUR, toute petite, et la nature choisie. */}
            <button type="button" className="sommeil__retour" onClick={() => setEtape('nature')} aria-label={textes.retour}>
              <IconeChevronGauche />
              <span>{textes.sommeil.natures[nature]}</span>
            </button>

            {/* DEUX INSTANTS COMPLETS, chacun sa date et son heure. */}
            <div className="sommeil__colonnes">
              {colonne(textes.sommeil.endormissement, 'dateCoucher', dateCoucher, retouche(setDateCoucher), 'heureCoucher', heureCoucher, retouche(setHeureCoucher))}
              {colonne(textes.sommeil.reveil, 'dateReveil', dateReveil, retouche(setDateReveil), 'heureReveil', heureReveil, retouche(setHeureReveil))}
            </div>

            {/* LA DURÉE, DÉDUITE — jamais saisie. */}
            {/* « Durée : 8 h 05 » (2026-09-21 au soir, « 8 h 05 de sommeil->
                Durée : xx ») : le mot, puis la durée à largeur fixe. */}
            <p className="sommeil__duree">
              {textes.sommeil.dureeAvant} <span>{dureeEcrite(duree)}</span>
            </p>
            <div
              className="sommeil__jauge"
              role="progressbar"
              aria-label={textes.sommeil.duree(dureeEcrite(duree))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(jauge.remplissage * 100)}
              style={{ '--remplissage': jauge.remplissage, '--intensite': jauge.intensite } as CSSProperties}
            >
              <span className="sommeil__jauge-plein" />
            </div>

            {enDeuxEcrans !== true ? noteEtNotes : null}

            {refus ? <MessageEnPlace classe="prise__regle">{refus}</MessageEnPlace> : null}
            <IndiceDefilement />
          </div>
          ) : (
          <div className="prise__corps">
            {/* LE TROISIÈME ÉCRAN : la note et les notes, sur un sommeil déjà
                consigné. En tête, LE FIL D'ARIANE (2026-09-21, « Sieste ·
                hier/aujourd'hui date endormissement + heure · hier/aujourd'hui
                date réveil + heure »). */}
            {/* Sur une ligne, sans la nature (2026-09-21) : « 10/09/2026 23:45 ·
                11/09/2026 07:00 », puis « nuit de 7 h 15 ». */}
            <p className="sommeil__fil">
              <span>
                {jourEcrit(dateCoucher)} {heureCoucher}
              </span>
              <span className="sommeil__fil-point" aria-hidden="true">·</span>
              <span>
                {jourEcrit(dateReveil)} {heureReveil}
              </span>
            </p>
            <p className="sommeil__duree sommeil__duree--phrase">{textes.sommeil.natureDe(nature, dureeEcrite(duree))}</p>
            {noteEtNotes}
            <IndiceDefilement />
          </div>
          )}

          {etape !== 'nature' ? (
          <div className="prise__pied">
            {modification ? (
              <button type="button" className="bouton bouton--second prise__valider" onClick={onAnnuler}>
                {textes.prise.annuler}
              </button>
            ) : null}
            <button type="submit" className="bouton prise__valider">
              <IconeCoche />
              {/* Le troisième écran dit « Valider », pas « Mettre à jour » (2026-09-21). */}
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
        onJournal={onJournal}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
