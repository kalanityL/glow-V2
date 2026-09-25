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
import { AVEC_DISTANCE, CATEGORIES_ACTIVITE, DISTANCE_PAR_DEFAUT_KM, DUREES_PROPOSEES, INTENSITES, slugActivite, type CategorieActivite, type Intensite } from '../domaine/activites';
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
 * sens, une distance en km, qui éteint l'intensité.
 *
 * PAS ENCORE : la note de la V1, et l'enregistrement dans `sportHistory`
 * (SPEC § 4.7) : « Valider » est éteint, jamais caché.
 */
export function PageActivite({
  forme,
  onAccueil,
  onOuvrirCompte,
  onAjouter,
  ajoutTraitement,
  fond,
}: {
  forme: Forme | null;
  onAccueil: () => void;
  onOuvrirCompte: () => void;
  onAjouter: (module: ModuleId) => void;
  ajoutTraitement?: AjoutTraitement | null;
  fond: FondProps;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const maintenant = new Date();
  const [date, setDate] = useState(dateLocale(maintenant));
  const [heure, setHeure] = useState(heureRonde(heureLocale(maintenant)));
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
  const [sportChoisi, setSportChoisi] = useState<{ categorie: CategorieActivite; noeud: NoeudActivite } | null>(null);
  const [duree, setDuree] = useState<(typeof DUREES_PROPOSEES)[number] | 'autre'>(30);
  const [dureeTapee, setDureeTapee] = useState('');
  const [intensite, setIntensite] = useState<Intensite>('moderee');
  const [distance, setDistance] = useState('');
  const distanceEntree = distance.trim() !== '';
  const choisirSport = (categorie: CategorieActivite, noeud: NoeudActivite) => {
    setSportChoisi({ categorie, noeud });
    setCategorieOuverte(categorie);
    setRequete('');
    setDistance('');
  };
  /* Rien à consigner encore : le formulaire ne s'envoie pas. */
  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
  };

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.modules['activite-physique']} onAccueil={onAccueil} />

        <form className="carte prise" onSubmit={valider} noValidate>
          <div className="prise__entete">
            <IconeActivite />
            <h2 className="prise__titre">{textes.activite.titre}</h2>
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
                  <button
                    type="button"
                    role="radio"
                    aria-checked={duree === 'autre'}
                    className={`prise__bouton${duree === 'autre' ? ' prise__bouton--choisi' : ''}`}
                    onClick={() => setDuree('autre')}
                  >
                    {textes.activite.autreDuree}
                  </button>
                </div>
                {duree === 'autre' ? (
                  <input
                    className="prise__dose"
                    type="text"
                    inputMode="numeric"
                    placeholder={textes.activite.dureeMinutes}
                    aria-label={textes.activite.dureeMinutes}
                    value={dureeTapee}
                    autoFocus
                    onChange={(e) => setDureeTapee(e.target.value)}
                  />
                ) : null}

                {/* L'INTENSITÉ : trois pictos, sans mot ; éteinte quand une distance est entrée. */}
                <p className="prise__etiquette">{textes.activite.intensite}</p>
                <div className="intensites" role="radiogroup" aria-label={textes.activite.intensite}>
                  {INTENSITES.map((niveau) => {
                    const Icone = ICONES_INTENSITE[niveau];
                    const choisi = !distanceEntree && intensite === niveau;
                    return (
                      <button
                        key={niveau}
                        type="button"
                        role="radio"
                        aria-checked={choisi}
                        aria-label={textes.activite.intensites[niveau]}
                        className={`prise__bouton intensite${choisi ? ' prise__bouton--choisi' : ''}`}
                        disabled={distanceEntree}
                        onClick={() => setIntensite(niveau)}
                      >
                        <Icone />
                      </button>
                    );
                  })}
                </div>

                {/* OU LA DISTANCE, pour les sports où elle a un sens. */}
                {AVEC_DISTANCE.has(sportChoisi.noeud.nom) ? (
                  <>
                    <p className="prise__etiquette">{textes.activite.ouDistance}</p>
                    <input
                      className="prise__dose"
                      type="text"
                      inputMode="decimal"
                      placeholder={`${DISTANCE_PAR_DEFAUT_KM[sportChoisi.noeud.nom]} ${textes.activite.distanceKm}`}
                      aria-label={textes.activite.distanceKm}
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </>
                ) : null}
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
            <button type="submit" className="bouton prise__valider" disabled aria-disabled="true">
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
        ajoutTraitement={ajoutTraitement}
      />
    </div>
  );
}
