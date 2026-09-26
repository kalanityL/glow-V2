import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { TiroirFiltre } from './TiroirFiltre';
import { IconeDuModule } from './iconesModules';
import { IconeAujourdhui, IconeChevronDroit, IconeCoche, IconeFiltrer, IconeGrille, IconeListe, IconePlus } from '../components/Icones';
import { IndiceDefilement } from '../components/IndiceDefilement';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { MODULES, MODULES_AJOUT_JOURNAL, type ModuleId } from '../app/modules';
import { noeudDuSport, slugActivite } from '../domaine/activites';
import {
  anneeMoisDe,
  dateDecalee,
  dateDecaleeDeMois,
  dateLocale,
  formaterDateLongue,
  formaterJourEtDate,
  grilleDuMois,
  jourDeLaSemaine,
  joursDe,
  jourRelatif,
} from '../domaine/dates';
import type { Langue } from '../i18n/langues';
/* L'ILLUSTRATION D'UNE JOURNÉE SANS RIEN (2026-09-26, « date sans entrée,
   ajouter l'icone ../images pour claude/ template/icone/calendrier nuage de
   cette façon (sans ajouter le + et avec nos textes deja presents) ») : son
   calendrier sur des nuages, détouré et embarqué comme les autres images. */
import illustrationJourneeVide from '../assets/images/modules/journee-vide.png';
import { amenerEnHaut, defilerHorizontalA, surFinDeDefilement } from '../plateforme/navigateur';
import {
  bornesDuJournal,
  dansLesBornes,
  entreesDuJournal,
  fenetreDuJournal,
  imageDeLEntree,
  joursAvecEntree,
  joursDuJournal,
  type EntreeJournal,
  type JourDuJournal,
} from '../domaine/journal';
import { dureeEcrite, dureeMinutes } from '../domaine/sommeils';
import { poidsDepuisKg, type UnitePoids } from '../domaine/unites';
import type { InjectionLog, SleepLog, SportLog, WeightLog } from '../donnees/v1';
import type { Forme } from '../domaine/traitements';

/**
 * LA PAGE JOURNAL (2026-09-26, « On va faire la page journal. tu as tous les
 * templates dans ../images pour claude/templates / journal ») : l'entrée
 * « Journal » de la barre du bas y mène. Tout ce qui est enregistré, remis
 * ensemble et rangé par journée (`domaine/journal.ts`).
 *
 * SES QUATRE TEMPLATES, relevés au pixel avant d'écrire (GUIDELINES : une
 * image de référence se mesure) :
 *   - `header-vue clendrier.png` : le calendrier, « ‹ Septembre 2026 › », la
 *     bascule Semaine / Mois, les jours pointés quand ils portent quelque
 *     chose, le jour choisi plein ;
 *   - `sous-header-vue semaine.png` : la semaine en sept cartes (86 × 80 px
 *     pour 714 de large, gouttière 10, marge 30 — soit 47 × 44 sur un écran
 *     de 390) ;
 *   - `journal mode liste.png` : les journées, leur titre, et les entrées —
 *     l'heure, la pastille de l'icône (78 px relevés, soit 43), le nom, le
 *     détail ;
 *   - `switch mode-grille-ligne.png` : le compte et les deux modes.
 * Les couleurs de ses images sont, à trois unités près, les jetons que les
 * thèmes portent déjà (pastille #eaf3fc contre `--ajout-pastille-fond`
 * #e7f0fc, carte blanche contre `--module-fond`) : la page est donc bâtie
 * AUX JETONS, pas aux valeurs relevées — « passe en bleu » veut dire
 * « l'accent du thème ». Ce qui est repris de l'image est la MISE EN PAGE.
 *
 * NOS ICÔNES, PAS LES SIENNES (2026-09-26, « utilise evidemment nos icones
 * pas celles des templates ») : chaque entrée porte l'icône de son module,
 * `IconeDuModule` — la même qu'à l'accueil et au tiroir du « + ». Et NOS
 * MOTS (VOCABULAIRE) : « Balance » là où son template écrit « Poids »,
 * « Menus » et non « Repas », « Marche » et non « Pas ».
 *
 * PAS DE RECHERCHE (2026-09-26, « pour l'instant ne fait pas la
 * fonctionnalité recherche du journal ») : la loupe de son template n'est
 * pas reprise ici — celle de l'entête des pages, qui existait avant, ne
 * bouge pas.
 *
 * LES ENTRÉES SONT DES BLOCS, PAS DES BOUTONS, et ne portent pas le chevron
 * de son template : aucune page de détail n'existe, et un chevron promettrait
 * une page qui n'est pas là (règle de l'accueil, 2026-09-16 : « rien n'y est
 * cliquable tant que les pages n'existent pas »).
 */
export function PageJournal({
  jourInitial,
  prises,
  pesees,
  sommeils,
  activites,
  unite,
  forme,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  ajoutTraitement,
  fond,
}: {
  /** LE JOUR SUR LEQUEL LE JOURNAL S'OUVRE (2026-09-26, « voir dans le
      journal envoie vers le jouranl à la date saisie pour l'item ») : la
      date de ce qu'une confirmation vient de consigner ; sans lui, le
      journal s'ouvre sur aujourd'hui. */
  jourInitial?: string;
  prises: readonly InjectionLog[];
  pesees: readonly WeightLog[];
  sommeils: readonly SleepLog[];
  activites: readonly SportLog[];
  /** L'unité d'affichage du poids ; le stockage reste en kilogrammes. */
  unite: UnitePoids;
  forme: Forme | null;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  /** Une case touchée : le module, et LE JOUR REGARDÉ — le formulaire
      s'ouvre à cette date (2026-09-26, l'écran d'un jour vide). */
  onAjouter: (module: ModuleId, date?: string) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const aujourdhui = dateLocale(new Date());

  /* LE JOUR CHOISI commande tout : le calendrier le marque, la fenêtre de
     lecture s'ouvre autour de lui, et la liste l'amène sous les yeux. Les
     flèches le déplacent — d'une semaine en vue Semaine, d'un mois en vue
     Mois —, si bien que le calendrier et la liste ne peuvent pas se
     contredire. */
  const [jour, setJour] = useState(jourInitial ?? aujourdhui);
  /* CE QUE LE CALENDRIER MONTRE, distinct du jour choisi (2026-09-26,
     « slide sur semaine ou mois : si on ne clique nulle part, la date
     selectionnée ne change pas ») : glisser et pousser les flèches
     promènent le regard, SEUL UN CLIC change la date. `placer` est un
     compteur : il ne bouge que lorsqu'il faut ramener le rail sous le
     regard — un glissement, lui, a déjà placé le rail tout seul. */
  const [vise, setVise] = useState<{ date: string; placer: number; ou: 'milieu' | 'debut' }>({
    date: jourInitial ?? aujourdhui,
    placer: 0,
    ou: 'milieu',
  });
  /* Porter le regard quelque part, et y ramener le rail — au milieu de la
     bande d'ordinaire, À SON DÉBUT quand on saute au premier d'un mois. */
  const regarder = (date: string, ou: 'milieu' | 'debut' = 'milieu') =>
    setVise((v) => ({ date, placer: v.placer + 1, ou }));
  const [vue, setVue] = useState<'semaine' | 'mois'>('semaine');
  /* LA LIGNE DES RÉGLAGES, REPLIÉE PAR DÉFAUT (2026-09-26, « a la place de
     26 semaine mois -> le texte "options" souligné ; quand on clique sur
     option, apparait une ligne avec 26 semaine mois et aussi ce qu'il y a
     sur la ligne filtrer, le tout sur la meme ligne ») : tout ce qui règle
     la lecture tient sur UNE ligne, sous le calendrier — l'ancienne ligne du
     filtre a disparu, elle n'existait que pour ça. */
  const [options, setOptions] = useState(false);
  const [mode, setMode] = useState<'liste' | 'grille'>('liste');
  /* Toutes les catégories retenues au départ : le journal s'ouvre entier. */
  const [retenus, setRetenus] = useState<readonly ModuleId[]>(MODULES);
  /* LES JOURNÉES VIDES DÉPLIÉES (2026-09-26, « Un petit bouton + sur un jour
     sans donnée pour voir, sous le jour en uestion, l'écran "journée sans
     donnée" insérée à l'intérieur du journal ») : chacune se déplie pour
     elle-même et le reste. */
  const [deplies, setDeplies] = useState<ReadonlySet<string>>(() => new Set<string>());
  const basculerDeplie = useCallback((date: string) => {
    setDeplies((ouvertes) => {
      const suite = new Set(ouvertes);
      if (suite.has(date)) suite.delete(date);
      else suite.add(date);
      return suite;
    });
  }, []);

  const entrees = useMemo(() => entreesDuJournal({ prises, pesees, sommeils, activites }), [prises, pesees, sommeils, activites]);
  const fenetre = useMemo(() => fenetreDuJournal(jour, aujourdhui), [jour, aujourdhui]);
  const jours = useMemo(() => joursDuJournal(entrees, fenetre, retenus), [entrees, fenetre, retenus]);
  const pointes = useMemo(() => joursAvecEntree(entrees, retenus), [entrees, retenus]);

  /* CE QU'IL FAUT AMENER SOUS LES YEUX après le prochain rendu : la journée
     choisie au calendrier, ou — après un « Voir plus » — la journée qui
     était à la limite, pour que la lecture reprenne où elle s'était
     arrêtée. Un compteur l'accompagne : rechoisir le même jour doit y
     ramener. */
  const corpsRef = useRef<HTMLDivElement>(null);
  const [aAmener, setAAmener] = useState<{ date: string; n: number }>({ date: jour, n: 0 });
  useEffect(() => {
    amenerEnHaut(corpsRef.current?.querySelector(`[data-journee="${aAmener.date}"]`) ?? null);
  }, [aAmener]);

  /* ALLER À UN JOUR : la fenêtre se rouvre autour de lui et il est amené
     sous les yeux. */
  const allerAuJour = (date: string) => {
    setJour(date);
    regarder(date);
    setAAmener((precedent) => ({ date, n: precedent.n + 1 }));
  };

  /* CHOISIR UN JOUR AU CALENDRIER : la liste s'y rend, ET S'IL NE PORTE RIEN
     IL S'OUVRE DÉPLIÉ (2026-09-26, « Si on clique sur un jour sasns donnée,
     on arrive sur ce jour par defaut deplié »).
     LE CALENDRIER, LUI, NE BOUGE PAS (le même jour, « si on selecte un date
     visible sur la ligne semaine actuellement affichée, la ligne de bouge
     pas ») : on ne peut cliquer que ce qu'on voit, donc la bande est déjà au
     bon endroit — la recentrer ferait sauter sous le doigt ce qu'on vient
     de viser. `ramener` n'est vrai que pour un geste qui vient d'ailleurs,
     l'icône d'aujourd'hui. */
  const choisirJour = (date: string, ramener = false) => {
    if (!pointes.has(date)) setDeplies((ouvertes) => new Set(ouvertes).add(date));
    setJour(date);
    setVise((v) => ({ date, placer: ramener ? v.placer + 1 : v.placer, ou: 'milieu' }));
    setAAmener((precedent) => ({ date, n: precedent.n + 1 }));
  };

  /* UN « VOIR PLUS » : LE JOUR COURANT SE DÉPLACE AU BOUT QU'ON VIENT
     D'ATTEINDRE (2026-09-26, « quand on clique sur "voir plus" dans le
     passé : le jour courant est décalé au nouveau jour le plus ancien ;
     dans le futur : le jour courant est décalé au 1er jour des nouveaux
     jour qui viennent d'etre charges ») — la fenêtre se rouvre autour de
     lui, six mois de plus apparaissent de ce côté, et la lecture reprend
     sur ce jour-là : rien ne saute. Un jour vide atteint ainsi ne se déplie
     pas de lui-même : on ne l'a pas choisi, on est arrivé dessus. */
  const etendre = (cote: 'avant' | 'apres') => allerAuJour(cote === 'avant' ? fenetre.debut : fenetre.fin);

  /* LE TIROIR DU FILTRE, en trois états comme ceux de la barre du bas : le
     panneau reste monté le temps de redescendre, puis se démonte. */
  const [filtre, setFiltre] = useState<'ferme' | 'ouvert' | 'fermeture'>('ferme');
  const boutonFiltre = useRef<HTMLButtonElement>(null);
  const leBoutonFiltre = useCallback(() => boutonFiltre.current, []);
  const fermerFiltre = useCallback(() => setFiltre((etat) => (etat === 'ouvert' ? 'fermeture' : etat)), []);
  const filtreFerme = useCallback(() => setFiltre('ferme'), []);
  /* Un filtre est mis dès qu'une catégorie est écartée — toutes cochées,
     c'est le journal entier, donc pas de filtre. */
  const filtreMis = retenus.length < MODULES.length;

  const { annee, mois } = anneeMoisDe(vise.date);

  /* SE DÉPLACER DANS LE CALENDRIER — d'une semaine en vue Semaine, d'un mois
     en vue Mois : par les deux flèches, ou EN LE FAISANT GLISSER (2026-09-26,
     « on peut slider dans les dates en mode semaine et aussi en mode mois »).
     LES BORNES S'APPLIQUENT COMME AU « VOIR PLUS » (le même jour, « Idem
     voir plus selon les memes regles qd on arrive à une borne ») : à dix ans
     en arrière ou un an en avant, la flèche s'éteint et le volet de ce côté
     n'existe pas. */
  const bornes = bornesDuJournal(aujourdhui);
  /* LES FLÈCHES PROMÈNENT LE REGARD, elles ne choisissent pas : elles ne
     touchent jamais à la date sélectionnée.
     CELLES DU NOM DU MOIS VONT D'UN MOIS À L'AUTRE, dans les deux vues
     (2026-09-26, « les chevrons autour du nom du mois font defiler d'un mois
     vers le suivant ») ET SE POSENT AU PREMIER DU MOIS EN VUE SEMAINE
     (« positionne au 1er du mois en debut de ligne si on est en affichage
     semaine ») : la bande s'ouvre alors sur le 1er, qui est son premier
     cran. */
  const moisVoisin = (pas: number) => {
    const cible = dateDecaleeDeMois(vise.date, pas);
    const premier = `${cible.slice(0, 8)}01`;
    return dansLesBornes(vue === 'semaine' ? premier : cible, aujourdhui);
  };
  const reculer = () => {
    const voulu = moisVoisin(-1);
    if (voulu !== vise.date) regarder(voulu, 'debut');
  };
  const avancer = () => {
    const voulu = moisVoisin(1);
    if (voulu !== vise.date) regarder(voulu, 'debut');
  };
  /* Les deux chevrons de la bande, eux, vont d'une semaine. */
  const deplacer = (pas: number) => {
    const voulu = dansLesBornes(vue === 'semaine' ? dateDecalee(vise.date, 7 * pas) : dateDecaleeDeMois(vise.date, pas), aujourdhui);
    if (voulu !== vise.date) regarder(voulu);
  };
  /* Au bout, la flèche s'éteint : le regard ne bougerait plus. */
  const peutReculer = vise.date > bornes.min;
  const peutAvancer = vise.date < bornes.max;

  /* LE GLISSEMENT SE FAIT PAR LE DÉFILEMENT DU NAVIGATEUR, comme la règle
     crantée du poids (2026-09-26, « je n'arrive toujours pas a slider lees
     dates (tu peux regarder ajouter un poids, on utilise le slider a cet
     endroit pour voir comment fonctionne le sliding ») : trois volets côte à
     côte — le précédent, le courant, le suivant —, une zone qui défile
     horizontalement et s'aimante sur l'un d'eux. Le navigateur fait tout le
     geste : au doigt, au trackpad, à la barre. Mes deux tentatives d'hier —
     un appui qu'on traîne, puis un `wheel` compté à la main — ne
     répondaient qu'à une partie des gestes ; elles sont retirées.

     Le défilement fini sur un volet voisin, la date se déplace ; le nouveau
     rendu ramène le volet courant au milieu. */
  const rail = useRef<HTMLDivElement>(null);
  /* Les volets présents : pas de voisin du côté où la borne est atteinte. */
  const volets = [...(peutReculer ? [-1] : []), 0, ...(peutAvancer ? [1] : [])];
  const rangCourant = volets.indexOf(0);

  /* EN VUE SEMAINE, LA PISTE EST CONTINUE ET SE GLISSE JOUR PAR JOUR
     (2026-09-26, « slide en mode semaine : slide fluide des jour en jour
     sans sacade, pas de passage de semaine en semaine ») : une suite de
     jours aimantée sur chacun, sept visibles à la fois, le jour regardé au
     milieu — le mécanisme de la règle crantée du poids, au jour près. La
     vue Mois, elle, garde ses trois volets (« slide de mois en mois :
     laisser comme tel »).

     LA PISTE EST ANCRÉE et ne se refait pas à chaque cran : elle tient
     quarante-cinq jours de part et d'autre de son ancre, et l'ancre ne se
     repose que lorsque le jour regardé s'en éloigne de plus de vingt-cinq —
     sans quoi le DOM changerait sous le doigt à chaque jour franchi. */
  const JOURS_VISIBLES = 7;
  const DEMI_PISTE = 45;
  const [ancre, setAncre] = useState(vise.date);
  useEffect(() => {
    const ecart = Math.abs(new Date(vise.date).getTime() - new Date(ancre).getTime()) / 86_400_000;
    if (ecart > 25) setAncre(vise.date);
  }, [vise.date, ancre]);
  const piste = useMemo(
    () => joursDe(dansLesBornes(dateDecalee(ancre, -DEMI_PISTE), aujourdhui), dansLesBornes(dateDecalee(ancre, DEMI_PISTE), aujourdhui)),
    [ancre, aujourdhui],
  );
  /* Le replacement du rail est programmé : il ne doit pas se lire comme un
     geste (sans quoi la date repartirait toute seule). */
  const placement = useRef(false);
  useEffect(() => {
    const zone = rail.current;
    if (!zone) return;
    placement.current = true;
    if (vue === 'semaine') {
      /* Le jour REGARDÉ au milieu des sept. LE PAS D'UN CRAN SE MESURE sur
         la piste elle-même (`scrollWidth / nombre de jours`) plutôt que de
         se déduire des largeurs écrites : marges et arrondis ne peuvent
         plus le fausser. */
      const rang = piste.indexOf(vise.date);
      const pasDuJour = zone.scrollWidth / piste.length;
      const decalage = vise.ou === 'debut' ? 0 : (JOURS_VISIBLES - 1) / 2;
      if (rang >= 0) defilerHorizontalA(zone, (rang - decalage) * pasDuJour, false);
    } else {
      defilerHorizontalA(zone, rangCourant * zone.clientWidth, false);
    }
    /* La marque se lève au prochain tour de boucle : le défilement programmé
       a alors fini de se produire. */
    const relacher = setTimeout(() => {
      placement.current = false;
    }, 120);
    return () => clearTimeout(relacher);
    /* Le rail ne se replace QUE sur demande (`vise.placer`), jamais au fil
       d'un glissement : sinon le doigt se battrait contre le replacement. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vise.placer, vue, rangCourant, piste]);
  useEffect(
    () =>
      surFinDeDefilement(rail.current, () => {
        const zone = rail.current;
        if (!zone || placement.current || zone.clientWidth === 0) return;
        /* LE GLISSEMENT NE CHANGE QUE LE REGARD, jamais la date choisie
           (2026-09-26, « si on ne clique nulle part, la date selectionnée ne
           change pas ») : on note où l'on est arrivé, sans replacer le rail
           — il est déjà au bon endroit, c'est le doigt qui l'y a mis. */
        if (vue === 'semaine') {
          const pasDuJour = zone.scrollWidth / piste.length;
          const rang = Math.round(zone.scrollLeft / pasDuJour + (JOURS_VISIBLES - 1) / 2);
          const date = piste[rang];
          if (date && date !== vise.date) setVise((v) => ({ ...v, date }));
          return;
        }
        const rang = Math.round(zone.scrollLeft / zone.clientWidth);
        const pas = volets[rang];
        if (pas !== undefined && pas !== 0) {
          const voulu = dansLesBornes(dateDecaleeDeMois(vise.date, pas), aujourdhui);
          if (voulu !== vise.date) regarder(voulu);
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vise.date, vue, rangCourant, piste],
  );

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.menu.journal} onAccueil={onAccueil} />

        <div className="carte journal">
          {/* LE CALENDRIER (son template « header-vue clendrier.png ») : le
              mois entre deux flèches, et la bascule des deux vues. */}
          <div className="journal__calendrier">
            <div className="journal__mois">
              <button type="button" className="journal__fleche" aria-label={textes.calendrier.moisPrecedent} disabled={!peutReculer} aria-disabled={!peutReculer} onClick={reculer}>
                <IconeChevronDroit />
              </button>
              <span className="journal__mois-nom">{`${textes.calendrier.mois[mois - 1]} ${annee}`}</span>
              <button type="button" className="journal__fleche journal__fleche--suivant" aria-label={textes.calendrier.moisSuivant} disabled={!peutAvancer} aria-disabled={!peutAvancer} onClick={avancer}>
                <IconeChevronDroit />
              </button>
              {/* « OPTIONS », SOULIGNÉ, À LA PLACE DES RÉGLAGES (2026-09-26,
                  « a la place de 26 semaine mois -> le texte "options"
                  souligné ») : replié, le calendrier n'a que son mois et ses
                  deux flèches. OUVERT, IL DIT « Masquer les options »
                  (2026-09-26, « option : remplacer croix de fermeture par
                  "masquer les options" ») — la croix a vécu une demi-heure. */}
              <button
                type="button"
                className={`journal__options${options ? ' journal__options--ouvertes' : ''}`}
                aria-expanded={options}
                onClick={() => setOptions((o) => !o)}
              >
                {options ? textes.journal.masquerOptions : textes.journal.options}
              </button>
            </div>

            {/* LA LIGNE DES RÉGLAGES, EN DEUXIÈME LIGNE (2026-09-26, « la
                ligne d'option vient se mettre en 2eme ligne ») : juste sous
                le mois, AVANT le calendrier — aujourd'hui, les deux vues,
                « Filtrer » et les deux modes, TOUS SUR LA MÊME LIGNE. Repliée,
                il n'y a rien de plus entre le mois et le calendrier, ni entre
                le calendrier et le journal. */}
            {options ? (
              <div className="journal__reglages">
                {/* AUJOURD'HUI (2026-09-26, son image `aujourdhui.png`) : le
                    quantième du jour courant, SUR DEUX CHIFFRES. Touchée, elle
                    ramène à aujourd'hui. */}
                <button
                  type="button"
                  className="journal__aujourdhui"
                  aria-label={textes.joursRelatifs.aujourdhui}
                  onClick={() => choisirJour(aujourdhui, true)}
                >
                  <IconeAujourdhui quantieme={aujourdhui.slice(8)} />
                </button>
                <div className="journal__vues" role="radiogroup" aria-label={textes.calendrier.mois[mois - 1]}>
                  {(['semaine', 'mois'] as const).map((laquelle) => (
                    <button
                      key={laquelle}
                      type="button"
                      role="radio"
                      aria-checked={vue === laquelle}
                      className={`journal__vue${vue === laquelle ? ' journal__vue--choisie' : ''}`}
                      onClick={() => setVue(laquelle)}
                    >
                      {textes.journal.vues[laquelle]}
                    </button>
                  ))}
                </div>
                {/* L'INDICATEUR : un filtre mis, le bouton prend la matière des
                    réponses choisies ET porte une pastille à la coche
                    (2026-09-26). Aucun filtre, pas de pastille. */}
                <button
                  ref={boutonFiltre}
                  type="button"
                  className={`journal__filtrer${filtreMis ? ' journal__filtrer--actif' : ''}`}
                  aria-expanded={filtre === 'ouvert'}
                  aria-label={filtreMis ? textes.journal.filtreMis(retenus.length, MODULES.length) : textes.journal.filtreAucun}
                  onClick={() => setFiltre((etat) => (etat === 'ouvert' ? 'fermeture' : 'ouvert'))}
                >
                  <IconeFiltrer />
                  <span>{textes.journal.filtrer}</span>
                  {filtreMis ? (
                    <span className="journal__filtre-compte" aria-hidden="true">
                      <IconeCoche />
                    </span>
                  ) : null}
                </button>
                <div className="journal__modes" role="radiogroup" aria-label={textes.journal.modes.liste}>
                  {(['liste', 'grille'] as const).map((lequel) => (
                    <button
                      key={lequel}
                      type="button"
                      role="radio"
                      aria-checked={mode === lequel}
                      aria-label={textes.journal.modes[lequel]}
                      className={`journal__mode${mode === lequel ? ' journal__mode--choisi' : ''}`}
                      onClick={() => setMode(lequel)}
                    >
                      {lequel === 'liste' ? <IconeListe /> : <IconeGrille />}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {vue === 'semaine' ? (
              /* LES DEUX CHEVRONS DE LA BANDE (2026-09-26, « sans rien
                 changer au positionnement des jours, ajoute à l'intérieur
                 des mini espaces blancs sur le côté, des mini chevrons avant
                 arriere encerclés qui font défilés d'une semaine à chaque
                 clic ») : posés PAR-DESSUS la piste, aux deux bouts — le
                 placement des cartes ne bouge pas d'un pixel. */
              <div className="journal__bande">
              <div className="journal__rail journal__rail--jours" ref={rail}>
                {piste.map((date) => (
                  <button
                    key={date}
                    type="button"
                    aria-current={date === jour ? 'date' : undefined}
                    className={`journal__jour-carte${date === jour ? ' journal__jour-carte--choisi' : ''}${date === aujourdhui ? ' journal__jour-carte--aujourdhui' : ''}`}
                    onClick={() => choisirJour(date)}
                  >
                    <span className="journal__jour-nom">{textes.calendrier.joursAbreges[jourDeLaSemaine(date)]}</span>
                    <span className="journal__jour-quantieme">{Number(date.slice(8))}</span>
                    {/* C'est le VIDE qui se marque (2026-09-26) : un tiret fin et pâle
                        sous le quantième quand la journée ne porte rien. */}
                    {pointes.has(date) ? null : <span className="journal__point" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="journal__glisser journal__glisser--avant"
                aria-label={textes.calendrier.moisPrecedent}
                disabled={!peutReculer}
                onClick={() => deplacer(-1)}
              >
                <IconeChevronDroit />
              </button>
              <button
                type="button"
                className="journal__glisser journal__glisser--apres"
                aria-label={textes.calendrier.moisSuivant}
                disabled={!peutAvancer}
                onClick={() => deplacer(1)}
              >
                <IconeChevronDroit />
              </button>
              </div>
            ) : (
              <div className="journal__rail" ref={rail}>
                {volets.map((pas) => {
                  const dateVolet = dateDecaleeDeMois(vise.date, pas);
                  const { annee: a, mois: m } = anneeMoisDe(dateVolet);
                  return (
                    <div className="journal__volet" key={pas} aria-hidden={pas !== 0}>
                      {/* LE MOIS : six semaines, lundi en premier, les jours
                          des mois voisins en pâle (`grilleDuMois`). */}
                      <div className="journal__grille-mois">
                        {textes.calendrier.jours.map((lettre, i) => (
                          <span key={i} className="journal__entete-jour" aria-hidden="true">
                            {lettre}
                          </span>
                        ))}
                        {grilleDuMois(a, m).map((case_) => (
                          <button
                            key={case_.date}
                            type="button"
                            tabIndex={pas === 0 ? undefined : -1}
                            aria-current={case_.date === jour ? 'date' : undefined}
                            className={`journal__case${case_.date === jour ? ' journal__case--choisie' : ''}${case_.date === aujourdhui ? ' journal__case--aujourdhui' : ''}${case_.dansLeMois ? '' : ' journal__case--voisine'}`}
                            onClick={() => choisirJour(case_.date)}
                          >
                            <span className="journal__case-quantieme">{case_.jour}</span>
                            {pointes.has(case_.date) ? null : <span className="journal__point" aria-hidden="true" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LE CORPS DÉFILE, le calendrier et le bandeau restent — la règle
              des formulaires (2026-09-21, « bandeau titre et bouton valider
              figés, c'est le reste qui scrolle »).

              IL DÉROULE TOUTE LA FENÊTRE, dans les deux sens (2026-09-26,
              « on doit pouvoir scroller sans fin dans un sens comme dans
              l'autre peu importe ou on se trouve ») : LE PASSÉ EN HAUT, LE
              FUTUR EN BAS (le même jour, « orientation du journal : le passé
              en haut le futur en bas » — l'ordre inverse a vécu la
              journée), les VIDES COMPRIS, et un « Voir plus » à chaque bout
              tant que les bornes ne sont pas atteintes. */}
          <div className="journal__corps" ref={corpsRef}>
            {/* Le passé est en haut : c'est lui que ce bouton charge. */}
            {fenetre.plusAvant ? (
              <button type="button" className="journal__plus" onClick={() => etendre('avant')}>
                {textes.journal.voirPlus}
              </button>
            ) : null}

            {jours.map((journee) => (
              <JourneeDuJournal
                key={journee.date}
                journee={journee}
                aujourdhui={aujourdhui}
                choisi={journee.date === jour}
                deplie={deplies.has(journee.date)}
                onDeplier={basculerDeplie}
                mode={mode}
                forme={forme}
                unite={unite}
                langue={langue}
                textes={textes}
                onAjouter={onAjouter}
              />
            ))}

            {/* Le futur est en bas. */}
            {fenetre.plusApres ? (
              <button type="button" className="journal__plus" onClick={() => etendre('apres')}>
                {textes.journal.voirPlus}
              </button>
            ) : null}
            <IndiceDefilement />
          </div>
        </div>
      </div>

      {filtre !== 'ferme' ? (
        <TiroirFiltre
          onFermer={fermerFiltre}
          onFermee={filtreFerme}
          enFermeture={filtre === 'fermeture'}
          bouton={leBoutonFiltre}
          forme={forme}
          retenus={retenus}
          onBasculer={(module) =>
            setRetenus((liste) => (liste.includes(module) ? liste.filter((m) => m !== module) : MODULES.filter((m) => m === module || liste.includes(m))))
          }
          onReinitialiser={() => setRetenus(MODULES)}
          onRetablir={setRetenus}
        />
      ) : null}

      <BarreDuBas
        active="journal"
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

/**
 * L'ICÔNE D'UNE ENTRÉE : celle de SON SPORT pour une séance (2026-09-26, son
 * image), celle de son module pour tout le reste. Le masque du sport est le
 * même que celui des tuiles de l'activité physique et de la confirmation ;
 * un sport qui n'est pas au catalogue retombe sur l'icône du module.
 */
function IconeDeLEntree({ entree, forme }: { entree: EntreeJournal; forme: Forme | null }) {
  if (entree.module === 'activite-physique') {
    const noeud = noeudDuSport(entree.activite.sport);
    if (noeud) {
      return (
        <span className={`journal__sport categorie--${noeud.categorie} categorie--sport-${slugActivite(noeud.noeud.nom)}`}>
          <span className="categorie__icone" aria-hidden="true" />
        </span>
      );
    }
  }
  return <IconeDuModule module={entree.module} forme={forme} />;
}

/** La vignette d'une entrée, quand la ligne porte une photo — aucune n'en
    porte aujourd'hui (voir `imageDeLEntree`), mais la place est tenue :
    c'est la même règle qu'en mode grille. */
function Vignette({ entree }: { entree: EntreeJournal }) {
  const image = imageDeLEntree(entree);
  return image ? <img className="journal__vignette" src={image} alt="" /> : null;
}

/** Le nom d'une entrée : celui de son module, la forme répondue pour le
    traitement — les mots de l'accueil, pas un second jeu. */
function nomDuModule(entree: EntreeJournal, forme: Forme | null, textes: ReturnType<typeof useTextes>): string {
  if (entree.module === 'traitement' && forme) return textes.accueil.traitement[forme];
  return textes.accueil.modules[entree.module];
}

/**
 * CE QU'UNE ENTRÉE DIT D'ELLE-MÊME, sous son nom (son template : « 0,25 mg ·
 * Abdomen droit », « Yoga · 45 min · Modérée ») : les données de la ligne,
 * dans les mots du dictionnaire. Une valeur absente se tait — jamais un zéro
 * ni un tiret à sa place.
 */
function detailDeLEntree(entree: EntreeJournal, unite: UnitePoids, textes: ReturnType<typeof useTextes>): string {
  if (entree.module === 'balance') {
    return `${poidsDepuisKg(entree.pesee.weight, unite).replace('.', textes.separateurDecimal)} ${textes.unites[unite]}`;
  }
  if (entree.module === 'traitement') {
    const dose = `${String(entree.prise.dose).replace('.', textes.separateurDecimal)} mg`;
    const zone = textes.prise.zones[entree.prise.site as keyof typeof textes.prise.zones];
    return zone ? `${dose} · ${zone}` : dose;
  }
  if (entree.module === 'sommeil') {
    return `${textes.sommeil.natures[entree.sommeil.kind]} · ${dureeEcrite(dureeMinutes(entree.sommeil))} · ${textes.journal.qualite(entree.sommeil.quality)}`;
  }
  /* Une séance : le sport réduit à ce qui précède sa première virgule, comme
     sur ses tuiles, puis la durée, puis la distance quand il y en a une —
     l'intensité sinon (c'est l'une ou l'autre qui a été saisie). */
  const sport = entree.activite.sport.split(',')[0];
  const duree = dureeEcrite(entree.activite.duration);
  const fin =
    entree.activite.distance !== undefined
      ? `${(entree.activite.distance / 1000).toFixed(2).replace('.', textes.separateurDecimal)} ${textes.activite.km}`
      : textes.activite.intensites[entree.activite.intensity];
  return `${sport} · ${duree} · ${fin}`;
}

/**
 * UNE JOURNÉE DU JOURNAL — son titre, et ce qu'elle porte.
 *
 * TOUTES LES JOURNÉES SONT LÀ, LES VIDES COMPRISES (2026-09-26, « jour sans
 * donnée : apparait dans le journal comme un jour avec données, simplement il
 * n'y a rien en dessous on passe directement au jour suivant ») : une journée
 * vide n'a que son titre. SON « + » DÉPLIE SON ÉCRAN D'AJOUT SOUS ELLE (« Un
 * petit bouton + sur un jour sans donnée pour voir, sous le jour en uestion,
 * l'écran "journée sans donnée" insérée à l'intérieur du journal »), là où
 * elle est, sans quitter le journal.
 *
 * MÉMOÏSÉE (GUIDELINES) : la fenêtre déroule jusqu'à plusieurs milliers de
 * journées ; sans ce `memo`, déplier une seule journée les re-rendrait
 * toutes.
 */
const JourneeDuJournal = memo(function JourneeDuJournal({
  journee,
  aujourdhui,
  choisi,
  deplie,
  onDeplier,
  mode,
  forme,
  unite,
  langue,
  textes,
  onAjouter,
}: {
  journee: JourDuJournal;
  aujourdhui: string;
  /** La journée choisie au calendrier : c'est elle qu'on amène sous les yeux. */
  choisi: boolean;
  deplie: boolean;
  onDeplier: (date: string) => void;
  mode: 'liste' | 'grille';
  forme: Forme | null;
  unite: UnitePoids;
  langue: Langue;
  textes: ReturnType<typeof useTextes>;
  onAjouter: (module: ModuleId, date?: string) => void;
}) {
  const mot = jourRelatif(journee.date, aujourdhui);
  const enToutesLettres = formaterJourEtDate(journee.date, textes.calendrier.joursEntiers, textes.calendrier.mois, langue);
  const vide = journee.entrees.length === 0;

  return (
    <section
      className={`journal__journee${choisi ? ' journal__journee--choisie' : ''}${vide ? ' journal__journee--vide' : ''}`}
      data-journee={journee.date}
    >
      {/* Le titre : LA DATE EN TOUTES LETTRES À GAUCHE, TOUJOURS, et le mot
          du jour à droite quand il en a un (2026-09-26, « les jours qui ont
          des noms (hier aujourd'hui etc..) inverse noms et jour ») — la
          place de chacun ne dépend plus du jour qu'on regarde. Une journée
          vide porte son « + », une journée pleine son compte. */}
      <h2 className="journal__titre-jour">
        <span className="journal__titre-mot">{enToutesLettres}</span>
        {mot ? <span className="journal__titre-date">{textes.joursRelatifs[mot]}</span> : null}
        {/* UNE JOURNÉE VIDE PORTE SON « + » ; UNE JOURNÉE PLEINE, LE NOMBRE
            DE SES ENTRÉES ENTRE PARENTHÈSES (2026-09-26, « les jours où il y
            a des entrées : à la place du "+", on met entre parentheses le
            nombre d'entrées ») — à la même place, au bout du titre. */}
        {vide ? (
          <button
            type="button"
            className={`journal__deplier${deplie ? ' journal__deplier--deplie' : ''}`}
            aria-expanded={deplie}
            aria-label={deplie ? textes.journal.replierJour : textes.journal.deplierJour}
            onClick={() => onDeplier(journee.date)}
          >
            <IconePlus />
          </button>
        ) : (
          <span className="journal__compte-jour">{`(${journee.entrees.length})`}</span>
        )}
      </h2>

      {vide ? null : mode === 'liste' ? (
        <ul className="journal__liste">
          {journee.entrees.map((entree) => (
            <li key={entree.id} className="journal__entree">
              <span className="journal__heure">{entree.heure}</span>
              {/* L'ICÔNE D'UNE SÉANCE EST CELLE DE SON SPORT (2026-09-26,
                  son image : un vélo, un volant de badminton), celle du
                  module pour tout le reste — NOS icônes dans les deux cas
                  (« garde nos icones ») : le masque des tuiles de l'activité
                  physique, et `IconeDuModule` ailleurs. */}
              <span className="journal__icone">
                <IconeDeLEntree entree={entree} forme={forme} />
              </span>
              <span className="journal__dit">
                <span className="journal__nom">{nomDuModule(entree, forme, textes)}</span>
                <span className="journal__detail">{detailDeLEntree(entree, unite, textes)}</span>
              </span>
              <Vignette entree={entree} />
              {/* Le chevron de son image. Il ne mène encore nulle part. */}
              <span className="journal__chevron" aria-hidden="true">
                <IconeChevronDroit />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        /* LE MODE GRILLE (2026-09-26, « pour le mode grille tu mets juste
           l'image de l'entrée si elle exite sinon l'icone ») : la tuile ne
           porte QUE ça — le nom du module se dit à qui écoute la page.
           Aucune ligne ne porte d'image aujourd'hui : c'est donc l'icône. */
        <div className="journal__tuiles">
          {journee.entrees.map((entree) => {
            const image = imageDeLEntree(entree);
            return (
              <span key={entree.id} className="journal__tuile" role="img" aria-label={nomDuModule(entree, forme, textes)}>
                {image ? (
                  <img className="journal__tuile-image" src={image} alt="" />
                ) : (
                  <span className="journal__tuile-icone" aria-hidden="true">
                    <IconeDuModule module={entree.module} forme={forme} />
                  </span>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* L'ÉCRAN D'UNE JOURNÉE SANS RIEN, DÉPLIÉ DANS LE JOURNAL : la phrase,
          « Ajoutez une entrée », et ses sept cases sur deux colonnes. NOS
          ICÔNES ET UNE COULEUR UNIE (2026-09-26, « couleur unie des icones et
          utiliser nos icones ») : `IconeDuModule` aux jetons `--ajout-*`.
          Chaque case ouvre son formulaire À CETTE DATE. */}
      {vide && deplie ? (
        <div className="journal__vide">
          {/* SON ILLUSTRATION À GAUCHE, LA PHRASE À DROITE (2026-09-26,
              « Aucune entrée au 28 novembre 2025.-> à côté du calendrier ») —
              SANS le « + » qu'elle avait ajouté sur son image et avec nos
              mots à nous. Ses couleurs sont celles du dessin, comme les
              icônes de la home : exception consignée. */}
          <div className="journal__vide-bandeau">
            <img className="journal__vide-image" src={illustrationJourneeVide} alt="" />
            <span className="journal__vide-phrase">{textes.journal.aucuneEntree}</span>
          </div>
          {/* « Ajoutez une entrée : » CENTRÉ SOUS LE BLOC (2026-09-26,
              « ajouter une entrée passe en centré sous le bloc calendrier
              plus phrase », « ajouter avec ":" »). */}
          <h3 className="journal__vide-titre">
            {textes.journal.ajoutezUneEntree(formaterDateLongue(journee.date, textes.calendrier.mois, langue))}
          </h3>
          <div className="journal__vide-cases">
            {/* PAS DE LABEL, QUATRE PAR LIGNE (2026-09-26, « pas de label,
                4 icones par ligne max »), MAIS LE CONTOUR ET L'ENCOCHE
                RESTENT (le même jour, « garde les contours et les
                encoches ») : la carte et son chevron, comme celles du
                tiroir du « + » — sans leur nom. SES LIBELLÉS — « une
                Injection », « un Poids »… — restent dits à qui écoute la
                page, comme les cercles de l'accueil, dont les noms ne se
                voient pas non plus. */}
            {MODULES_AJOUT_JOURNAL.map((module) => (
              <button
                key={module}
                type="button"
                className="journal__vide-case"
                aria-label={module === 'traitement' ? textes.journal.ajoutTraitement[forme ?? 'injection'] : textes.journal.ajouts[module]}
                onClick={() => onAjouter(module, journee.date)}
              >
                <span className="journal__icone">
                  <IconeDuModule module={module} forme={forme} />
                </span>
                <span className="journal__vide-chevron" aria-hidden="true">
                  <IconeChevronDroit />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
});
