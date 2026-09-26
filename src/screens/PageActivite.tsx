import { useState, type FormEvent } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { ChoixDate } from '../components/ChoixDate';
import { ChoixHeure } from '../components/ChoixHeure';
import {
  IconeActivite,
  IconeCalendrier,
  IconeCoche,
  IconeCroix,
  IconeHorloge,
  IconeIntensiteDouce,
  IconeIntensiteIntensive,
  IconeIntensiteModeree,
  IconeRecherche,
} from '../components/Icones';
import { MessageEnPlace } from '../components/MessageEnPlace';
import { CadranDistance } from '../components/CadranDistance';
import { chercherActivites } from '../domaine/recherche-activites';
import type { NoeudActivite } from '../domaine/activites-catalogue';
import type { ReactElement, ReactNode } from 'react';

const ICONES_INTENSITE: Record<Intensite, () => ReactElement> = {
  douce: IconeIntensiteDouce,
  moderee: IconeIntensiteModeree,
  intensive: IconeIntensiteIntensive,
};

/** Le nom d'une tuile de résultat : celui du nœud ; pour une activité seule
    faite nœud, dont le nom est l'intitulé entier du Compendium (« Lutte,
    en compétition (un combat = 5 minutes) »), ce qui précède la première
    virgule — le mot qui compte, à la taille d'une tuile. */
function nomCourt(noeud: NoeudActivite): string {
  const seule = noeud.sous.length === 0 && noeud.activites.length === 1 && noeud.activites[0].nom === noeud.nom;
  return seule ? noeud.nom.split(',')[0] : noeud.nom;
}

/** Une tuile : l'icône (le masque de sa classe) et le nom ; un bouton quand
    elle mène quelque part, un bloc sinon. */
function Tuile({ classes, nom, onClick }: { classes: string; nom: ReactNode; onClick?: () => void }) {
  const contenu = (
    <>
      <span className="categorie__pastille">
        <span className="categorie__icone" aria-hidden="true" />
      </span>
      <span className="categorie__nom">{nom}</span>
    </>
  );
  return onClick ? (
    <button type="button" className={`categorie categorie--bouton ${classes}`} onClick={onClick}>
      {contenu}
    </button>
  ) : (
    <div className={`categorie ${classes}`}>{contenu}</div>
  );
}
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { dateLocale, formaterDateCourte } from '../domaine/dates';
import { heureLocale, heureRonde } from '../domaine/prises';
import {
  AVEC_DISTANCE,
  CATEGORIES_ACTIVITE,
  DISTANCE_PAR_DEFAUT_KM,
  DUREES_PROPOSEES,
  ESCALIER,
  INTENSITES,
  kmDepuisSaisie,
  minutesDepuisSaisie,
  noeudDuSport,
  slugActivite,
  sportsRecents,
  type CategorieActivite,
  type Intensite,
} from '../domaine/activites';
import { idActivite, type SportLog } from '../donnees/v1';
import { ChampEnLigne } from '../components/ChampEnLigne';
import { CATALOGUE_ACTIVITES } from '../domaine/activites-catalogue';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';
import { IndiceDefilement } from '../components/IndiceDefilement';

/**
 * LA PAGE D'UNE ACTIVITÉ PHYSIQUE (2026-09-25, son image « Ajouter une
 * activité » : « on va créer la page ajouter une activité physique (pas de
 * couleur vert, reprends juste l'idée, remplace le vert par notre bleu de
 * pastille bleu) […] pour la recherche laisse la blank ») — UN FORMULAIRE,
 * COMME CELUI D'UNE PRISE (le même soir, « nouvelle activité physique est
 * un formulaire, comme nouvelle injection ») : la case « Activité
 * Physique » du tiroir du « + » y mène. L'entête des pages, la barre du
 * bas, et la carte du formulaire : le bandeau avec l'icône du module,
 * « Nouvelle activité physique » et la croix ; le corps, qui défile entre
 * le bandeau et le pied — la date et l'heure côte à côte, éditées en place,
 * puis LE CHAMP DE RECHERCHE (le même soir, son image : « voilà le design
 * du champ recherche ») et ses résultats — des nœuds de NIVEAU 1
 * seulement, un mot trouvé plus bas faisant remonter le nœud qui le porte
 * (`domaine/recherche-activites.ts`), EN TUILES COMME LES CATÉGORIES
 * (« resultat de recherche : Meme mise en page que categorie ») — L'ICÔNE
 * DU SPORT (« les icones doivent etre celle du sport » : ses planches,
 * découpées en masques nommés par le slug du nœud, `activites-icones.css`
 * engendrée ; à défaut, celle de la catégorie) et le nom, une activité
 * seule réduite à ce qui précède sa première virgule —, le nombre à côté
 * du titre ; puis « Catégories » — et UNE CATÉGORIE TOUCHÉE (le même soir,
 * « si on clique sur une catégorie, on voit le nom de la catégorie en fil
 * d'arianne et on affiche les icones des sports (niveau 1) contenus dans
 * la catégorie ») met à sa place le fil « Catégories › Roues », dont
 * « Catégories » ramène, et les tuiles de ses nœuds de niveau 1 ; puis
 * « Catégories » et ses neuf
 * tuiles (la pastille bleue du tiroir du « + » avec l'icône de la
 * catégorie, ses planches en masques que le thème peint, le nom dessous) ;
 * « Valider » au pied. RIEN DE VERT ; le champ suit la charte des
 * formulaires (sobre, le focus à peine plus sombre), pas le bleu de
 * l'image.
 *
 * UN SPORT TOUCHÉ (résultat ou tuile d'une catégorie) : le fil sur trois
 * crans, la durée (15, 30, 45 min, 1 h, ou « Autre » et ses minutes),
 * l'intensité en trois pictos sans mot — ou, pour les sports où elle a un
 * sens, par onglet, une distance sur la piste (un tour par kilomètre, la
 * distance d'avance du sport) ou tapée au chiffre ; pour l'escalier, les
 * marches ou les étages, par onglet.
 *
 * VALIDER (2026-09-25 au soir, « page de confirmation meme concept que les
 * autres pages de confirmation ») écrit la séance dans `sportLogs`, la
 * table de la V1, et mène à la confirmation ; sa carte rouvre le
 * formulaire en modification (« Annuler » / « Mettre à jour »). Éteint
 * tant qu'aucun sport n'est choisi. PAS ENCORE : la note de la V1.
 */
export function PageActivite({
  forme,
  sportsRecents: nomsRecents,
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
  forme: Forme | null;
  /** Les sports récents, du dernier consigné au premier (2026-09-26). */
  sportsRecents: readonly string[];
  /** La séance à modifier : le formulaire part d'elle (la carte de la
      confirmation, 2026-09-25). */
  initiale?: SportLog;
  onValider: (activite: SportLog) => void;
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
  const maintenant = new Date();
  const modification = initiale !== undefined;
  /* LA SÉANCE À MODIFIER : son sport retrouvé dans l'arbre par son nom, sa
     durée parmi les quatre ou « Autre », son intensité, sa distance (en
     mètres dans la base) qui ouvre l'onglet Distance. */
  const depart = initiale ? noeudDuSport(initiale.sport) : null;
  const dureeConnue = initiale ? (DUREES_PROPOSEES as readonly number[]).includes(initiale.duration) : true;
  const [date, setDate] = useState(initiale?.date ?? dateProposee ?? dateLocale(maintenant));
  const [heure, setHeure] = useState(initiale?.time ?? heureRonde(heureLocale(maintenant)));
  const [editeDate, setEditeDate] = useState(false);
  const [editeHeure, setEditeHeure] = useState(false);
  const [requete, setRequete] = useState('');
  const resultats = chercherActivites(requete);
  const cherche = requete.trim() !== '';
  /* LA CATÉGORIE OUVERTE (2026-09-25, « si on clique sur une catégorie, on
     voit le nom de la catégorie en fil d'arianne et on affiche les icones
     des sports (niveau 1) contenus dans la catégorie ») : à sa place, le
     fil « Catégories › Roues » — « Catégories » ramène — et les tuiles de
     ses nœuds de niveau 1. */
  const [categorieOuverte, setCategorieOuverte] = useState<CategorieActivite | null>(null);
  /* LE SPORT CHOISI (2026-09-25, « une fois qu'on clique sur un sport : on
     peut choisir le temps avec des choix 15 min 30 min 45 min 1h ou autre
     qui si on clique ouvre un champs pou rmettre la quantité en minute.
     Ensuite on peut choisir l'intensité avec des pictos qui exprime
     l'intensité (3 niveaux) sans label OU BIEN, si le sport s'y prete,
     entrer une distance ») : le fil « Catégories › Roues › Vélo », la
     durée, puis l'intensité — ou la distance, qui l'éteint (la règle de la
     V1 : la distance remplie, l'intensité n'est plus prise en compte). */
  const [sportChoisi, setSportChoisi] = useState<{
    categorie: CategorieActivite;
    noeud: NoeudActivite;
  } | null>(depart);
  const [duree, setDuree] = useState<(typeof DUREES_PROPOSEES)[number] | 'autre'>(
    initiale && dureeConnue ? (initiale.duration as (typeof DUREES_PROPOSEES)[number]) : initiale ? 'autre' : 30,
  );
  const [dureeTapee, setDureeTapee] = useState(initiale && !dureeConnue ? String(initiale.duration) : '');
  const [intensite, setIntensite] = useState<Intensite>(initiale?.intensity ?? 'moderee');
  /* La durée « Autre » refusée : la règle se dit. */
  const [dureeRefusee, setDureeRefusee] = useState(false);
  /* INTENSITÉ OU DISTANCE, PAR ONGLET (2026-09-25 au soir, « dans le cas où
     on peut mettre soit l'un soit l'autre, systeme d'onglet : un onglet
     intensite un onglet distance ») : l'onglet ouvert dit ce qui compte ;
     la distance part de celle du sport (« distance par defaut ») et se
     règle au cadran, un tour par kilomètre. */
  const [onglet, setOnglet] = useState<'intensite' | 'distance' | 'marches' | 'etages'>(
    initiale?.distance !== undefined ? 'distance' : depart?.noeud.nom === ESCALIER ? 'marches' : 'intensite',
  );
  const [distanceKm, setDistanceKm] = useState(
    initiale?.distance !== undefined ? initiale.distance / 1000 : depart ? (DISTANCE_PAR_DEFAUT_KM[depart.noeud.nom] ?? 0) : 0,
  );
  /* L'ESCALIER (2026-09-25 au soir, « escalier : durée / nombre de marche /
     nombre d'étages ») : à la place de l'intensité et de la distance, deux
     onglets, Marches et Étages, chacun sa saisie. */
  const [marches, setMarches] = useState('');
  const [etages, setEtages] = useState('');
  const choisirSport = (categorie: CategorieActivite, noeud: NoeudActivite) => {
    setSportChoisi({ categorie, noeud });
    setCategorieOuverte(categorie);
    setRequete('');
    setOnglet(noeud.nom === ESCALIER ? 'marches' : 'intensite');
    setDistanceKm(DISTANCE_PAR_DEFAUT_KM[noeud.nom] ?? 0);
  };
  /* VALIDER : la durée choisie ou tapée (refusée si ce n'est pas un nombre
     de minutes), la distance en mètres quand l'onglet Distance est ouvert
     et qu'elle n'est pas nulle, l'intensité toujours (la V1 la garde même
     avec une distance). LA LIGNE DE LA V1 : son identifiant gardé en
     modification, ses notes aussi. Les marches et les étages de l'escalier
     n'ont pas de place dans la ligne de la V1 : ils ne s'écrivent pas
     (TODO-CLAUDE, à arbitrer). */
  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (!sportChoisi) return;
    const minutes = duree === 'autre' ? minutesDepuisSaisie(dureeTapee) : duree;
    if (minutes === null) {
      setDureeRefusee(true);
      return;
    }
    const distance = onglet === 'distance' && distanceKm > 0 ? Math.round(distanceKm * 1000) : undefined;
    onValider({
      id: initiale?.id ?? idActivite(),
      date,
      time: heure,
      sport: sportChoisi.noeud.nom,
      intensity: intensite,
      duration: minutes,
      ...(distance !== undefined ? { distance } : {}),
      ...(initiale?.notes !== undefined ? { notes: initiale.notes } : {}),
    });
  };
  /* LES RÉCENTS (2026-09-26, « sous catégorie, ajouter : récents », « les
     sports récents, pas les categories récentes », puis « met recent avant
     categories, 4 par ligne, 4 max ») : les sports des dernières séances,
     AVANT les catégories, quatre par rangée, en tuiles qui choisissent le
     sport ; rien sans séance. */
  const recents = sportsRecents(nomsRecents);
  const escalier = sportChoisi?.noeud.nom === ESCALIER;
  const avecDistance = sportChoisi !== null && AVEC_DISTANCE.has(sportChoisi.noeud.nom);
  const onglets: readonly ('intensite' | 'distance' | 'marches' | 'etages')[] = escalier
    ? ['marches', 'etages']
    : avecDistance
      ? ['intensite', 'distance']
      : [];
  /* « 5,25 » : toujours deux décimales, la virgule de la langue — une largeur
     qui ne bouge pas d'un cran à l'autre (2026-09-25 au soir, « distance :
     fixer la largeur des unités dizaines etc.. pour que ça ne saute pas qd
     modifie »). */
  const ecrireKm = (km: number) => (Math.round(km * 100) / 100).toFixed(2).replace('.', textes.separateurDecimal);

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.modules['activite-physique']} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            <IconeActivite />
            <h2 className="prise__titre">{modification ? textes.activite.titreModification : textes.activite.titre}</h2>
            <button type="button" className="tiroir__fermer prise__fermer" aria-label={textes.fermer} onClick={onAccueil}>
              <IconeCroix />
            </button>
          </div>

          <div className="prise__corps">
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
                  nom={textes.activite.titre}
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

            {/* LE CHAMP DE RECHERCHE S'EFFACE UNE FOIS LE SPORT CHOISI (2026-09-26,
                « une fois qu'on a choisi l'activité, le champ de recherche
                d'activité disparait ») : le fil ramène aux catégories, où il
                revient. */}
            {sportChoisi ? null : (
              <label className="recherche">
                <IconeRecherche />
                <input
                  className="recherche__champ"
                  type="search"
                  value={requete}
                  onChange={(e) => setRequete(e.target.value)}
                  placeholder={textes.activite.rechercher}
                  aria-label={textes.activite.rechercher}
                  autoComplete="off"
                />
                {cherche ? (
                  <button type="button" className="recherche__effacer" aria-label={textes.activite.effacerRecherche} onClick={() => setRequete('')}>
                    <IconeCroix />
                  </button>
                ) : null}
              </label>
            )}

            {cherche ? (
              <>
                <p className="prise__etiquette">
                  {textes.activite.resultats} <span className="recherche__nombre">({resultats.length})</span>
                </p>
                {resultats.length === 0 ? (
                  <MessageEnPlace classe="prise__question">{textes.activite.aucunResultat}</MessageEnPlace>
                ) : (
                  <div className="categories categories--4">
                    {resultats.map((r) => (
                      <Tuile
                        key={`${r.categorie}-${r.noeud.nom}`}
                        classes={`categorie--${r.categorie} categorie--sport-${slugActivite(r.noeud.nom)}`}
                        nom={nomCourt(r.noeud)}
                        onClick={() => choisirSport(r.categorie, r.noeud)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : null}

            {sportChoisi ? (
              <>
                <nav className="activite__fil" aria-label={textes.activite.categories}>
                  <button
                    type="button"
                    className="activite__fil-retour"
                    onClick={() => {
                      setSportChoisi(null);
                      setCategorieOuverte(null);
                    }}
                  >
                    {textes.activite.categories}
                  </button>
                  <span className="activite__fil-sep" aria-hidden="true">
                    ›
                  </span>
                  <button type="button" className="activite__fil-retour" onClick={() => setSportChoisi(null)}>
                    {textes.activite.categorie[sportChoisi.categorie]}
                  </button>
                  <span className="activite__fil-sep" aria-hidden="true">
                    ›
                  </span>
                  <span className="activite__fil-courant">{nomCourt(sportChoisi.noeud)}</span>
                </nav>

                {/* LA DURÉE : quatre choix et « Autre », qui ouvre la saisie en minutes. */}
                <p className="prise__etiquette">{textes.activite.duree}</p>
                <div className="prise__boutons" role="radiogroup" aria-label={textes.activite.duree}>
                  {DUREES_PROPOSEES.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      role="radio"
                      aria-checked={duree === minutes}
                      className={`prise__bouton${duree === minutes ? ' prise__bouton--choisi' : ''}`}
                      onClick={() => setDuree(minutes)}
                    >
                      {textes.activite.durees[String(minutes) as '15' | '30' | '45' | '60']}
                    </button>
                  ))}
                  {/* « Autre » s'efface et la saisie des minutes prend sa place
                      (2026-09-25 au soir, « si on clique sur "autre" : le champ
                      autre disparait et le champ ou on rentre les minutes prend
                      sa place »). */}
                  {duree === 'autre' ? (
                    <input
                      className="prise__dose prise__dose--bouton"
                      type="text"
                      inputMode="numeric"
                      placeholder={textes.activite.minutes}
                      aria-label={textes.activite.dureeMinutes}
                      value={dureeTapee}
                      autoFocus
                      onChange={(e) => {
                        setDureeTapee(e.target.value);
                        if (minutesDepuisSaisie(e.target.value) !== null) setDureeRefusee(false);
                      }}
                    />
                  ) : (
                    <button type="button" role="radio" aria-checked={false} className="prise__bouton" onClick={() => setDuree('autre')}>
                      {textes.activite.autreDuree}
                    </button>
                  )}
                </div>
                {dureeRefusee ? <MessageEnPlace classe="prise__regle">{textes.activite.regleDuree}</MessageEnPlace> : null}

                {/* L'INTENSITÉ — ou, par onglet, LA DISTANCE pour les sports où elle a
                    un sens ; pour l'escalier, les marches ou les étages. */}
                {onglets.length > 0 ? (
                  <div className="activite__onglets" role="tablist">
                    {onglets.map((o) => (
                      <button
                        key={o}
                        type="button"
                        role="tab"
                        aria-selected={onglet === o}
                        className={`activite__onglet${onglet === o ? ' activite__onglet--actif' : ''}`}
                        onClick={() => setOnglet(o)}
                      >
                        {textes.activite.onglets[o]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="prise__etiquette">{textes.activite.intensite}</p>
                )}
                {onglet === 'marches' || onglet === 'etages' ? (
                  <input
                    className="prise__dose"
                    type="text"
                    inputMode="numeric"
                    placeholder={onglet === 'marches' ? textes.activite.nombreDeMarches : textes.activite.nombreDEtages}
                    aria-label={onglet === 'marches' ? textes.activite.nombreDeMarches : textes.activite.nombreDEtages}
                    value={onglet === 'marches' ? marches : etages}
                    onChange={(e) => (onglet === 'marches' ? setMarches : setEtages)(e.target.value)}
                  />
                ) : onglet === 'intensite' || !avecDistance ? (
                  <div className="intensites" role="radiogroup" aria-label={textes.activite.intensite}>
                    {INTENSITES.map((niveau) => {
                      const Icone = ICONES_INTENSITE[niveau];
                      const choisi = intensite === niveau;
                      return (
                        <button
                          key={niveau}
                          type="button"
                          role="radio"
                          aria-checked={choisi}
                          aria-label={textes.activite.intensites[niveau]}
                          className={`prise__bouton intensite${choisi ? ' prise__bouton--choisi' : ''}`}
                          onClick={() => setIntensite(niveau)}
                        >
                          <Icone />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="distance">
                    <CadranDistance
                      km={distanceKm}
                      onKm={setDistanceKm}
                      nom={textes.activite.distanceKm}
                      ecrire={(k) => `${ecrireKm(k)} ${textes.activite.km}`}
                    />
                    {/* La valeur en cases : la dizaine est une case même vide (un
                        zéro invisible), les chiffres sont tabulaires — rien ne
                        saute en passant 10 km. ET ELLE S'ÉDITE SUR PLACE (2026-09-25
                        au soir, « on peut aussi modifier directement la valeur
                        numérique des kilometre plutot que de bouger le curseur »),
                        comme le chiffre du poids : touchée, un champ ; virgule ou
                        point ; refusée, la règle se dit. */}
                    <div className="distance__valeur">
                      <ChampEnLigne
                        valeur={ecrireKm(distanceKm)}
                        valeurAffichee={
                          <>
                            <span
                              className={distanceKm < 10 ? 'distance__chiffre distance__chiffre--vide' : 'distance__chiffre'}
                              aria-hidden={distanceKm < 10}
                            >
                              {distanceKm < 10 ? '0' : ecrireKm(distanceKm).slice(0, -4)}
                            </span>
                            <span className="distance__chiffre">{ecrireKm(distanceKm).slice(-4)}</span>
                          </>
                        }
                        onValeur={(saisie) => {
                          const km = kmDepuisSaisie(saisie);
                          if (km !== null) setDistanceKm(km);
                        }}
                        normaliser={(saisie) => {
                          const km = kmDepuisSaisie(saisie);
                          return km === null ? null : ecrireKm(km);
                        }}
                        regle={textes.activite.regleDistance}
                        nom={textes.activite.distanceKm}
                        unite={textes.activite.km}
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : categorieOuverte ? (
              <>
                <nav className="activite__fil" aria-label={textes.activite.categories}>
                  <button type="button" className="activite__fil-retour" onClick={() => setCategorieOuverte(null)}>
                    {textes.activite.categories}
                  </button>
                  <span className="activite__fil-sep" aria-hidden="true">
                    ›
                  </span>
                  <span className="activite__fil-courant">{textes.activite.categorie[categorieOuverte]}</span>
                </nav>
                <div className="categories categories--4">
                  {CATALOGUE_ACTIVITES[categorieOuverte].map((noeud) => (
                    <Tuile
                      key={noeud.nom}
                      classes={`categorie--${categorieOuverte} categorie--sport-${slugActivite(noeud.nom)}`}
                      nom={nomCourt(noeud)}
                      onClick={() => choisirSport(categorieOuverte, noeud)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {recents.length > 0 ? (
                  <>
                    <p className="prise__etiquette">{textes.activite.recents}</p>
                    <div className="categories categories--4">
                      {recents.map((r) => (
                        <Tuile
                          key={r.noeud.nom}
                          classes={`categorie--${r.categorie} categorie--sport-${slugActivite(r.noeud.nom)}`}
                          nom={nomCourt(r.noeud)}
                          onClick={() => choisirSport(r.categorie, r.noeud)}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
                <p className="prise__etiquette">{textes.activite.categories}</p>
                <div className="categories categories--3">
                  {CATEGORIES_ACTIVITE.map((categorie) => (
                    <Tuile
                      key={categorie}
                      classes={`categorie--${categorie}`}
                      nom={textes.activite.categorie[categorie]}
                      onClick={() => setCategorieOuverte(categorie)}
                    />
                  ))}
                </div>
              </>
            )}

            <IndiceDefilement />
          </div>

          <div className="prise__pied">
            {modification ? (
              <button type="button" className="bouton bouton--second prise__valider" onClick={onAnnuler}>
                {textes.prise.annuler}
              </button>
            ) : null}
            {/* Éteint, jamais caché, tant qu'aucun sport n'est choisi. */}
            <button type="submit" className="bouton prise__valider" disabled={!sportChoisi} aria-disabled={!sportChoisi}>
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
        onJournal={onJournal}
        forme={forme}
        fond={fond}
        onAjouter={onAjouter}
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
