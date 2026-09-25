import { useState, type FormEvent } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { ChoixDate } from '../components/ChoixDate';
import { ChoixHeure } from '../components/ChoixHeure';
import { IconeActivite, IconeCalendrier, IconeCoche, IconeCroix, IconeHorloge, IconeRecherche } from '../components/Icones';
import { MessageEnPlace } from '../components/MessageEnPlace';
import { chercherActivites } from '../domaine/recherche-activites';
import type { NoeudActivite } from '../domaine/activites-catalogue';
import type { ReactNode } from 'react';

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
import { CATEGORIES_ACTIVITE, slugActivite, type CategorieActivite } from '../domaine/activites';
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
 * PAS ENCORE : le choix d'une activité — les résultats et les tuiles sont
 * des blocs, pas des boutons —, la durée, l'intensité, la distance et la
 * note de la V1 (SPEC § 4.7), et l'enregistrement : « Valider » est
 * éteint, jamais caché.
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
                      />
                    ))}
                  </div>
                )}
              </>
            ) : null}

            {categorieOuverte ? (
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
