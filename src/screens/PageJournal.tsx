import { useCallback, useMemo, useRef, useState } from 'react';
import { BarreDuBas, type AjoutTraitement } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import type { FondProps } from './Accueil';
import { TiroirFiltre } from './TiroirFiltre';
import { IconeDuModule } from './iconesModules';
import { IconeChevronDroit, IconeFiltrer, IconeGrille, IconeListe } from '../components/Icones';
import { IndiceDefilement } from '../components/IndiceDefilement';
import { detecterLangue, useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { MODULES, MODULES_AJOUT_JOURNAL, type ModuleId } from '../app/modules';
import {
  anneeMoisDe,
  dateDecalee,
  dateLocale,
  formaterDateLongue,
  formaterJourEtDate,
  grilleDuMois,
  jourDeLaSemaine,
  jourRelatif,
  moisDecale,
  semaineDe,
} from '../domaine/dates';
import {
  compteDuJour,
  entreesDuJournal,
  imageDeLEntree,
  joursAvecEntree,
  joursDuJournal,
  type EntreeJournal,
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

  /* LE JOUR CHOISI commande tout : le calendrier le marque, la liste part de
     lui et remonte le temps. Les flèches le déplacent — d'une semaine en vue
     Semaine, d'un mois en vue Mois —, si bien que le calendrier et la liste
     ne peuvent pas se contredire. */
  const [jour, setJour] = useState(jourInitial ?? aujourdhui);
  const [vue, setVue] = useState<'semaine' | 'mois'>('semaine');
  const [mode, setMode] = useState<'liste' | 'grille'>('liste');
  /* Toutes les catégories retenues au départ : le journal s'ouvre entier. */
  const [retenus, setRetenus] = useState<readonly ModuleId[]>(MODULES);

  const entrees = useMemo(() => entreesDuJournal({ prises, pesees, sommeils, activites }), [prises, pesees, sommeils, activites]);
  const jours = useMemo(() => joursDuJournal(entrees, jour, retenus), [entrees, jour, retenus]);
  const pointes = useMemo(() => joursAvecEntree(entrees, retenus), [entrees, retenus]);
  const compte = compteDuJour(entrees, jour, retenus);
  /* Un filtre est mis dès qu'une catégorie est écartée — toutes cochées,
     c'est le journal entier, donc pas de filtre. */
  const filtreMis = retenus.length < MODULES.length;

  /* LE TIROIR DU FILTRE, en trois états comme ceux de la barre du bas : le
     panneau reste monté le temps de redescendre, puis se démonte. */
  const [filtre, setFiltre] = useState<'ferme' | 'ouvert' | 'fermeture'>('ferme');
  const boutonFiltre = useRef<HTMLButtonElement>(null);
  const leBoutonFiltre = useCallback(() => boutonFiltre.current, []);
  const fermerFiltre = useCallback(() => setFiltre((etat) => (etat === 'ouvert' ? 'fermeture' : etat)), []);
  const filtreFerme = useCallback(() => setFiltre('ferme'), []);

  const { annee, mois } = anneeMoisDe(jour);
  const reculer = () => setJour(vue === 'semaine' ? dateDecalee(jour, -7) : moisDuJour(jour, -1));
  const avancer = () => setJour(vue === 'semaine' ? dateDecalee(jour, 7) : moisDuJour(jour, 1));

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.accueil.menu.journal} onAccueil={onAccueil} />

        <div className="carte journal">
          {/* LE CALENDRIER (son template « header-vue clendrier.png ») : le
              mois entre deux flèches, et la bascule des deux vues. */}
          <div className="journal__calendrier">
            <div className="journal__mois">
              <button type="button" className="journal__fleche" aria-label={textes.calendrier.moisPrecedent} onClick={reculer}>
                <IconeChevronDroit />
              </button>
              <span className="journal__mois-nom">{`${textes.calendrier.mois[mois - 1]} ${annee}`}</span>
              <button type="button" className="journal__fleche journal__fleche--suivant" aria-label={textes.calendrier.moisSuivant} onClick={avancer}>
                <IconeChevronDroit />
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
            </div>

            {vue === 'semaine' ? (
              /* LA SEMAINE EN SEPT CARTES (« sous-header-vue semaine.png ») :
                 le jour abrégé au-dessus, le quantième dessous. */
              <div className="journal__semaine">
                {semaineDe(jour).map((date) => (
                  <button
                    key={date}
                    type="button"
                    aria-current={date === jour ? 'date' : undefined}
                    className={`journal__jour-carte${date === jour ? ' journal__jour-carte--choisi' : ''}`}
                    onClick={() => setJour(date)}
                  >
                    <span className="journal__jour-nom">{textes.calendrier.joursAbreges[jourDeLaSemaine(date)]}</span>
                    <span className="journal__jour-quantieme">{Number(date.slice(8))}</span>
                    {pointes.has(date) ? <span className="journal__point" aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
            ) : (
              /* LE MOIS : six semaines, lundi en premier, les jours des mois
                 voisins en pâle — la grille du projet (`grilleDuMois`). */
              <div className="journal__grille-mois">
                {textes.calendrier.jours.map((lettre, i) => (
                  <span key={i} className="journal__entete-jour" aria-hidden="true">
                    {lettre}
                  </span>
                ))}
                {grilleDuMois(annee, mois).map((case_) => (
                  <button
                    key={case_.date}
                    type="button"
                    aria-current={case_.date === jour ? 'date' : undefined}
                    className={`journal__case${case_.date === jour ? ' journal__case--choisie' : ''}${case_.dansLeMois ? '' : ' journal__case--voisine'}`}
                    onClick={() => setJour(case_.date)}
                  >
                    <span className="journal__case-quantieme">{case_.jour}</span>
                    {pointes.has(case_.date) ? <span className="journal__point" aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LE BANDEAU DE MODE (« switch mode-grille-ligne.png ») : ce que
              le jour choisi porte, le filtre, et les deux façons de lire.
              Il vaut pour toute la page — changer de mode sur une seule
              journée n'aurait pas de sens —, d'où sa place ici et non dans
              le titre de chaque journée. */}
          <div className="journal__barre">
            <span className="journal__compte">{textes.journal.entrees(compte)}</span>
            {/* L'INDICATEUR (2026-09-26, « ajouter un indicateur sur le
                bouton pour filtrer qui indique si un filtre es tmis ou
                non ») : un filtre mis, le bouton prend la matière des
                réponses choisies ET porte une pastille à l'accent avec le
                nombre de catégories retenues — le compte dit du même coup
                combien il en reste, ce que le seul point ne dirait pas.
                Aucun filtre, pas de pastille : l'absence est la réponse. */}
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
                  {retenus.length}
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

          {/* LE CORPS DÉFILE, le calendrier et le bandeau restent — la règle
              des formulaires (2026-09-21, « bandeau titre et bouton valider
              figés, c'est le reste qui scrolle »). */}
          <div className="journal__corps">
            {retenus.length === 0 ? (
              <p className="journal__rien">{textes.journal.aucuneCategorie}</p>
            ) : jours.length === 0 ? (
              /* L'ÉCRAN D'UN JOUR VIDE (2026-09-26, son image et sa dictée) :
                 la phrase avec la date regardée, « Ajoutez une entrée », et
                 SES SEPT CASES sur deux colonnes — l'icône dans sa pastille,
                 le nom, le chevron. NOS ICÔNES ET UNE COULEUR UNIE (« couleur
                 unie des icones et utiliser nos icones ») : `IconeDuModule`
                 aux jetons `--ajout-*`, pas les six teintes de son image. */
              <div className="journal__vide">
                <p className="journal__vide-phrase">
                  {textes.journal.aucuneEntreeLe(formaterDateLongue(jour, textes.calendrier.mois, langue))}
                </p>
                <h2 className="journal__vide-titre">{textes.journal.ajoutezUneEntree}</h2>
                <div className="journal__vide-cases">
                  {MODULES_AJOUT_JOURNAL.map((module) => (
                    <button key={module} type="button" className="journal__vide-case" onClick={() => onAjouter(module, jour)}>
                      <span className="journal__icone">
                        <IconeDuModule module={module} forme={forme} />
                      </span>
                      <span className="journal__vide-nom">
                        {module === 'traitement' && forme ? textes.accueil.traitement[forme] : textes.accueil.modules[module]}
                      </span>
                      <span className="journal__vide-chevron" aria-hidden="true">
                        <IconeChevronDroit />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              jours.map((journee) => {
                const mot = jourRelatif(journee.date, aujourdhui);
                const enToutesLettres = formaterJourEtDate(journee.date, textes.calendrier.joursEntiers, textes.calendrier.mois, langue);
                return (
                  <section key={journee.date} className="journal__journee">
                    {/* Le titre : le mot du jour à gauche quand il en a un
                        (« Aujourd'hui », « Hier »), la date en toutes lettres
                        à droite — sinon la date prend la gauche, et la droite
                        se tait. */}
                    <h2 className="journal__titre-jour">
                      <span className="journal__titre-mot">{mot ? textes.joursRelatifs[mot] : enToutesLettres}</span>
                      {mot ? <span className="journal__titre-date">{enToutesLettres}</span> : null}
                    </h2>
                    {mode === 'liste' ? (
                      <ul className="journal__liste">
                        {journee.entrees.map((entree) => (
                          <li key={entree.id} className="journal__entree">
                            <span className="journal__heure">{entree.heure}</span>
                            <span className="journal__icone">
                              <IconeDuModule module={entree.module} forme={forme} />
                            </span>
                            <span className="journal__dit">
                              <span className="journal__nom">{nomDuModule(entree, forme, textes)}</span>
                              <span className="journal__detail">{detailDeLEntree(entree, unite, textes)}</span>
                            </span>
                            <Vignette entree={entree} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      /* LE MODE GRILLE (2026-09-26, « pour le mode grille tu
                         mets juste l'image de l'entrée si elle exite sinon
                         l'icone ») : la tuile ne porte QUE ça — le nom du
                         module se dit à qui écoute la page. Aucune ligne ne
                         porte d'image aujourd'hui : c'est donc l'icône
                         partout. */
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
                  </section>
                );
              })
            )}
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

/** La vignette d'une entrée, quand la ligne porte une photo — aucune n'en
    porte aujourd'hui (voir `imageDeLEntree`), mais la place est tenue :
    c'est la même règle qu'en mode grille. */
function Vignette({ entree }: { entree: EntreeJournal }) {
  const image = imageDeLEntree(entree);
  return image ? <img className="journal__vignette" src={image} alt="" /> : null;
}

/** Le mois du jour choisi, décalé — le quantième ramené au dernier jour du
    mois d'arrivée (le 31 janvier reculé d'un mois donne le 28 février, pas
    le 3 mars). */
function moisDuJour(jour: string, delta: number): string {
  const { annee, mois } = anneeMoisDe(jour);
  const cible = moisDecale(annee, mois, delta);
  const dernier = new Date(cible.annee, cible.mois, 0).getDate();
  const quantieme = Math.min(Number(jour.slice(8)), dernier);
  return `${cible.annee}-${String(cible.mois).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
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
