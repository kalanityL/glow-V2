import { useEffect, useState } from 'react';
import { useParcours } from './app/useParcours';
import { useJournaux } from './app/useJournaux';
import { appliquerChoixTraitement, choixTraitementDe } from './app/choixTraitement';
import type { AjoutTraitement } from './screens/BarreDuBas';
import { useTextes } from './i18n/useTextes';
import { Onboarding } from './screens/Onboarding';
import { Accueil } from './screens/Accueil';
import { Compte } from './screens/Compte';
import { PagePrise } from './screens/PagePrise';
import { PageConfirmation, ENTREES_PESEE, ENTREES_PRISE, ENTREES_SOMMEIL } from './screens/PageConfirmation';
import { PagePesee } from './screens/PagePesee';
import { PageSommeil } from './screens/PageSommeil';
import { IconeBalance, IconeCalendrier, IconeCoche, IconeComprime, IconeHorloge, IconeLieu, IconeSeringue, IconeSommeil } from './components/Icones';
import { TRAITEMENTS } from './domaine/traitements';
import { UNITES_DU_SYSTEME, poidsDepuisKg } from './domaine/unites';
import { dateLocale, formaterDateCourte, formaterDateLongue } from './domaine/dates';
import { peseeDuJour, poidsLePlusRecent } from './domaine/pesees';
import { detecterLangue } from './i18n/useTextes';
import type { ModuleId } from './app/modules';
import type { InjectionLog, SleepLog, WeightLog } from './donnees/v1';
import { dureeEcrite, dureeMinutes } from './domaine/sommeils';
import { traitementDepuisBrand } from './donnees/conversions';
import type { FondId } from './app/fonds';
import { cheminDeLaPage } from './plateforme/navigateur';
import { Verrou } from './screens/Verrou';
/* La mise en page d'abord, les jetons des thèmes ensuite : les feuilles de
   thème doivent pouvoir battre la structure, jamais l'inverse. */
import './themes/page.css';
import './themes/dessins.css';
import './themes/ciel/ciel.css';
import './themes/ciel-fonce/ciel-fonce.css';
import './themes/blanc/blanc.css';
import './themes/degrade-doux/degrade-doux.css';
/* La palette de chaque fond — engendrée par `scripts/palette-fonds.py`
   depuis les images —, après les thèmes : elle rebranche leurs jetons. */
import './themes/fonds-palette.css';

/**
 * V2 — repartie de zéro.
 *
 * Le cadre du téléphone, sa barre du bas avec le bouton « retour », et entre
 * les deux une page : l'onboarding, puis, une fois son dernier écran validé,
 * l'accueil (2026-09-16).
 *
 * Le cadre et le bouton sont repris de la version Mixte, réécrits en CSS
 * ordinaire — ce dépôt n'a ni Tailwind ni bibliothèque d'icônes.
 */
export default function App({ verrou = false }: { /** Le verrou de connexion, armé par `main.tsx` en production (2026-09-21). */ verrou?: boolean }) {
  const textes = useTextes();

  /* LE PARCOURS VIT ICI, et non dans l'onboarding : le bouton « retour » de la
     barre est hors de l'écran du téléphone — il figure le bouton natif — et
     doit pouvoir y reculer. */
  const parcours = useParcours();

  /* LA PAGE OUVERTE PAR-DESSUS L'ACCUEIL (2026-09-19) : « Mon compte »,
     ouverte par le portrait ou par le tiroir du menu. Le bouton « retour » de la barre y ramène à l'accueil —
     c'est pour cela que la page vit ici, à côté du parcours, et non dans
     l'accueil. (Le menu principal, lui, est un tiroir de l'accueil.) */
  const [page, setPage] = useState<'accueil' | 'compte' | 'prise' | 'confirmation' | 'pesee' | 'confirmation-pesee' | 'sommeil' | 'confirmation-sommeil'>(
    'accueil',
  );

  /* LA PAGE D'UNE PRISE (2026-09-20, « ajouter->injection : envoie vers une
     page ultra simple avec uniquement le formulaire d'ajout d'injection de
     la v1 ») : la case « Traitement » du tiroir du « + » y mène, quand un
     traitement est répondu. */
  /* LES JOURNAUX SUR L'APPAREIL (2026-09-21, « les poids et injections
     saisies disparaissent ?? ») : relus au départ, écrits à chaque
     changement (`useJournaux`) — ils ne vivent plus en mémoire seulement. */
  const journaux = useJournaux();
  const { pesees } = journaux;
  /* Le poids de départ édité dans « Mon compte » réécrit la pesée marquée :
     les journaux se relisent. */
  useEffect(() => {
    journaux.relire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcours.reponses.poids]);
  /* La dernière ligne consignée, pour la confirmation et sa modification. */
  const [dernierePrise, setDernierePrise] = useState<InjectionLog | null>(null);
  /* LA MODIFICATION DE LA DERNIÈRE PRISE (2026-09-20, « clic sur bloc
     récapitulatif : réouvre le formulaire avec les données enregistrées
     par defaut ») : le formulaire part d'elle, « Mettre à jour » la
     remplace, et la confirmation le dit. */
  const [modification, setModification] = useState(false);
  const [miseAJour, setMiseAJour] = useState(false);
  /* SANS TRAITEMENT, LE « + » OUVRE D'ABORD LE BLOC « MON TRAITEMENT »
     (2026-09-21, « ajouter traitement si traitement aucun : ouvre le
     formulaire de traitement, si un traitement est choisi on arrive ensuite
     au formulaire nouveau comprimé / injection ») ; un traitement complet
     enregistré, la page de la prise s'ouvre. */
  const [blocTraitementOuvert, setBlocTraitementOuvert] = useState(false);
  const ajoutTraitement: AjoutTraitement | null = blocTraitementOuvert
    ? {
        courant: choixTraitementDe(parcours.reponses),
        onEnregistrer: (choix) => {
          appliquerChoixTraitement(parcours, choix);
          if (choix.forme && choix.forme !== 'aucun' && choix.traitement) {
            setModification(false);
            setPage('prise');
          }
        },
        onFermer: () => setBlocTraitementOuvert(false),
      }
    : null;
  const ajouter = (module: ModuleId) => {
    if (module === 'traitement') {
      if (parcours.reponses.formeTraitement && parcours.reponses.traitement) {
        setModification(false);
        setPage('prise');
      } else {
        setBlocTraitementOuvert(true);
      }
    }
    if (module === 'balance') {
      setModification(false);
      setPage('pesee');
    }
    if (module === 'sommeil') {
      setModification(false);
      setPage('sommeil');
    }
  };

  /* LES PESÉES (2026-09-21, « ajouter balance : idem que ajouter
     injection ») : le poids proposé d'avance est celui de la pesée la plus
     proche d'aujourd'hui qui n'est pas dans le futur, sinon le poids du
     profil. Une pesée par jour : la nouvelle remplace celle du même jour. */
  const [dernierePesee, setDernierePesee] = useState<WeightLog | null>(null);
  /* LES SOMMEILS (2026-09-21, « fais moi l'écran nouveau sommeil et
     confirmation ») : la table `sleepLogs` de la V1. */
  const [dernierSommeil, setDernierSommeil] = useState<SleepLog | null>(null);
  /* `fini` faux : le second écran a consigné avec la note d'avance, la page
     continue vers la note (2026-09-21) ; vrai : la confirmation suit. */
  const validerSommeil = (sommeil: SleepLog, fini: boolean) => {
    journaux.consignerSommeil(sommeil);
    setDernierSommeil(sommeil);
    if (!fini) return;
    setMiseAJour(modification);
    setModification(false);
    setPage('confirmation-sommeil');
  };
  const aujourdhui = dateLocale(new Date());
  const langue = detecterLangue();
  const unites = UNITES_DU_SYSTEME[parcours.reponses.systeme];
  const kgLePlusRecent = poidsLePlusRecent(pesees, aujourdhui);
  const poidsPropose = kgLePlusRecent === null ? parcours.reponses.poids : poidsDepuisKg(kgLePlusRecent, unites.poids);
  /* Validée, la pesée est écrite dans la base ; la ligne du jour, si elle
     existait, est mise à jour — et la confirmation le dit (« si mise à
     jour, remplacer Pesée mise à jour ! »). */
  const validerPesee = (pesee: WeightLog) => {
    const existante = peseeDuJour(pesees, pesee.date);
    const apres = journaux.consignerPesee(pesee, modification && dernierePesee ? dernierePesee : undefined);
    setDernierePesee(peseeDuJour(apres, pesee.date) ?? pesee);
    setMiseAJour(modification || existante !== undefined);
    setModification(false);
    setPage('confirmation-pesee');
  };
  const poidsEcrit = (stocke: string) => `${stocke.replace('.', textes.separateurDecimal)} ${textes.unites[unites.poids]}`;
  /* Validée, la prise mène à L'ÉCRAN DE CONFIRMATION (2026-09-20, son
     image) : la dernière prise, et ce qu'on peut faire maintenant. */
  const validerPrise = (prise: InjectionLog) => {
    /* Deux par jour au plus (SPEC) : la troisième remplace la dernière du jour. */
    const apres = journaux.consignerPrise(prise, modification && dernierePrise ? dernierePrise : undefined);
    setDernierePrise(apres.find((p) => p.id === prise.id) ?? prise);
    setMiseAJour(modification);
    setModification(false);
    setPage('confirmation');
  };
  const derniere = dernierePrise;

  /* LE FOND DE PAGE (2026-09-20) : l'enregistré vient des réponses ; l'APERÇU,
     provisoire, vit ici — le bloc « Thème » le pose sous les yeux, « Choisir »
     l'enregistre, fermer l'efface. Toute page le reçoit. */
  const [apercuFond, setApercuFond] = useState<FondId | null>(null);
  const [blocTheme, setBlocTheme] = useState(false);
  const fond = {
    courant: parcours.reponses.fond,
    apercu: apercuFond,
    onApercu: setApercuFond,
    onChoisir: (choix: FondId) => parcours.repondre('fond', choix),
    blocOuvert: blocTheme,
    onOuvrirBloc: () => setBlocTheme(true),
    /* Fermer efface l'aperçu : le fond enregistré revient. */
    onFermerBloc: () => {
      setBlocTheme(false);
      setApercuFond(null);
    },
  };
  const peutRevenir = page !== 'accueil' || parcours.peutRevenir;
  const revenir = () => {
    if (page !== 'accueil') setPage('accueil');
    else parcours.reculer();
  };

  /* LE TÉLÉPHONE LONG (2026-09-21, « ne touche pas à http://localhost:3002/
     sur http://localhost:3002/long fait sert exactement la meme chose mais
     dans une simulation de telephone où la hauteur d ecran sans les bords
     du téléphone fasse 850px ») : sur `/long`, et là seulement, le cadre a
     une hauteur fixe qui donne à l'écran 850 px (`index.css`) ; sur `/`,
     rien ne change. L'adresse est lue une fois, à l'ouverture : elle ne
     bouge pas pendant la vie de la page. */
  const telephoneLong = cheminDeLaPage() === '/long';

  return (
    <div className={telephoneLong ? 'app-root app-root--long' : 'app-root'}>
      {/* Le contour du téléphone, dessiné en dur — bordure épaisse sombre et
          coins arrondis à toutes les largeurs — pour qu'on distingue ce qui
          est l'écran de ce qui ne l'est pas. */}
      <div className="phone-frame">
        {/* L'écran : rien d'autre que le contenu. La barre du bas n'en fait
            pas partie, elle figure le menu natif du téléphone, donc le bas de
            l'écran est juste au-dessus d'elle.

            Le `translateZ(0)` fait de cet écran le bloc conteneur des
            éléments `position: fixed` qu'il abritera : les popups s'y
            centreront, plutôt que dans la fenêtre du navigateur. */}
        <div className="phone-screen" id="phone-screen">
          {/* LA BARRE D'ÉTAT DU TÉLÉPHONE (2026-09-17, « fait apparaitre sur
              le telephone la barre du haut du telephone (réseau, heure ..;) »)
              : l'heure, le réseau, le wifi, la batterie. Elle figure
              l'appareil, pas l'application — son heure est figée à celle de
              toutes les maquettes de téléphone et n'est pas un texte du
              dictionnaire. ELLE EST PAR-DESSUS L'ÉCRAN, TRANSPARENTE (« le
              fond de l'image doit aussi etre le fond de la bande du haut du
              telephone ») : comme sur un vrai téléphone, l'application
              dessine dessous et se décale de la zone sûre (`--zone-sure-haut`,
              posée par `index.css` sur l'écran). */}
          <div className="phone-status" aria-hidden="true">
            <span className="phone-status-heure">{HEURE_DE_MAQUETTE}</span>
            <span className="phone-status-icones">
              <Reseau />
              <Wifi />
              <Batterie />
            </span>
          </div>
          {/* LE VERROU (2026-09-21) : armé, rien ne se rend sans une session
              connectée — l'écran de connexion, dans le téléphone, sur le fond
              enregistré de la personne. */}
          <Verrou arme={verrou} classeFond={`page--fond-${parcours.reponses.fond}`}>
          {(session) => !parcours.entre ? (
            <Onboarding parcours={parcours} />
          ) : page === 'compte' ? (
            <Compte parcours={parcours} onAccueil={() => setPage('accueil')} fond={fond} onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement} onDeconnexion={session.onDeconnexion} />
          ) : page === 'confirmation' && derniere && parcours.reponses.formeTraitement ? (
            <PageConfirmation
              titrePage={textes.accueil.traitement[parcours.reponses.formeTraitement]}
              titre={
                miseAJour
                  ? textes.confirmation.titreMiseAJour[parcours.reponses.formeTraitement]
                  : textes.confirmation.titre[parcours.reponses.formeTraitement]
              }
              lignes={[
                {
                  icone: parcours.reponses.formeTraitement === 'comprime' ? <IconeComprime /> : <IconeSeringue />,
                  nom: TRAITEMENTS.find((t) => t.id === traitementDepuisBrand(derniere.brand))?.nom ?? '',
                  valeur: `${String(derniere.dose).replace('.', textes.separateurDecimal)} mg`,
                },
                {
                  icone: <IconeCalendrier />,
                  nom: formaterDateLongue(derniere.date, textes.calendrier.mois, langue),
                  valeur: derniere.time,
                  iconeValeur: <IconeHorloge />,
                },
                ...(parcours.reponses.formeTraitement === 'comprime'
                  ? []
                  : [
                      {
                        icone: <IconeLieu />,
                        nom: textes.confirmation.zone,
                        valeur: textes.prise.zones[derniere.site as keyof typeof textes.prise.zones] ?? derniere.site,
                      },
                    ]),
              ]}
              entrees={ENTREES_PRISE}
              forme={parcours.reponses.formeTraitement}
              onModifier={() => {
                setModification(true);
                setPage('prise');
              }}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
            />
          ) : page === 'pesee' ? (
            <PagePesee
              poidsPropose={poidsPropose}
              unite={unites.poids}
              pesees={pesees}
              forme={parcours.reponses.formeTraitement}
              initiale={modification && dernierePesee ? dernierePesee : undefined}
              onValider={validerPesee}
              onAnnuler={() => {
                setModification(false);
                setPage('confirmation-pesee');
              }}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
            />
          ) : page === 'sommeil' ? (
            <PageSommeil
              sommeils={journaux.sommeils}
              forme={parcours.reponses.formeTraitement}
              initiale={modification && dernierSommeil ? dernierSommeil : undefined}
              onValider={validerSommeil}
              onAnnuler={() => {
                setModification(false);
                setPage('confirmation-sommeil');
              }}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
            />
          ) : page === 'confirmation-sommeil' && dernierSommeil ? (
            <PageConfirmation
              titrePage={textes.accueil.modules.sommeil}
              titre={miseAJour ? textes.confirmation.titreSommeilMiseAJour : textes.confirmation.titreSommeil}
              lignes={[
                {
                  icone: <IconeSommeil />,
                  nom: textes.sommeil.natures[dernierSommeil.kind],
                  valeur: dureeEcrite(dureeMinutes(dernierSommeil)),
                },
                {
                  icone: <IconeCalendrier />,
                  nom: `${textes.sommeil.endormissement} · ${formaterDateCourte(dernierSommeil.bedDate, langue)}`,
                  valeur: dernierSommeil.bedTime,
                  iconeValeur: <IconeHorloge />,
                },
                {
                  icone: <IconeCalendrier />,
                  nom: `${textes.sommeil.reveil} · ${formaterDateCourte(dernierSommeil.date, langue)}`,
                  valeur: dernierSommeil.time,
                  iconeValeur: <IconeHorloge />,
                },
                { icone: <IconeCoche />, nom: textes.sommeil.qualites[dernierSommeil.quality] ?? '', valeur: `${dernierSommeil.quality} / 5` },
              ]}
              entrees={ENTREES_SOMMEIL}
              forme={parcours.reponses.formeTraitement}
              onModifier={() => {
                setModification(true);
                setPage('sommeil');
              }}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
            />
          ) : page === 'confirmation-pesee' && dernierePesee ? (
            <PageConfirmation
              titrePage={textes.accueil.modules.balance}
              titre={miseAJour ? textes.confirmation.titrePeseeMiseAJour : textes.confirmation.titrePesee}
              lignes={[
                /* L'icône et le poids côte à côte, sans intitulé (2026-09-21,
                   « supprimer le label poids et mettre directement icone
                   balance et valeur de poids à côté »). */
                { icone: <IconeBalance />, nom: poidsEcrit(poidsDepuisKg(dernierePesee.weight, unites.poids)), valeur: '' },
                {
                  icone: <IconeCalendrier />,
                  nom: formaterDateLongue(dernierePesee.date, textes.calendrier.mois, langue),
                  valeur: dernierePesee.time ?? '',
                  iconeValeur: <IconeHorloge />,
                },
              ]}
              entrees={ENTREES_PESEE}
              forme={parcours.reponses.formeTraitement}
              onModifier={() => {
                setModification(true);
                setPage('pesee');
              }}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
            />
          ) : page === 'prise' && parcours.reponses.formeTraitement && parcours.reponses.traitement ? (
            <PagePrise
              parcours={parcours}
              forme={parcours.reponses.formeTraitement}
              traitement={parcours.reponses.traitement}
              onAccueil={() => setPage('accueil')}
              onOuvrirCompte={() => setPage('compte')}
              onValider={validerPrise}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
              fond={fond}
              initiale={modification && derniere ? derniere : undefined}
              onAnnuler={() => {
                setModification(false);
                setPage('confirmation');
              }}
            />
          ) : (
            <Accueil
              reponses={parcours.reponses}
              onOuvrirCompte={() => setPage('compte')}
              fond={fond}
              onAjouter={ajouter}
              ajoutTraitement={ajoutTraitement}
            />
          )}
          </Verrou>
        </div>

        {/* La barre du bas, hors écran : elle figure le menu natif du
            téléphone — d'où sa livrée sombre, assortie au contour — avec le
            bouton « retour », équivalent du bouton arrière. Sans historique —
            à la première étape — il ne fait rien et s'éteint à moitié. */}
        <footer className="phone-bar">
          <button
            type="button"
            className="phone-bar-back"
            title={textes.retour}
            aria-label={textes.retour}
            aria-disabled={!peutRevenir}
            disabled={!peutRevenir}
            onClick={revenir}
          >
            <ArrowLeft />
          </button>
        </footer>
      </div>
    </div>
  );
}

/** L'heure de toutes les maquettes de téléphone : elle ne tourne pas. */
const HEURE_DE_MAQUETTE = '9:41';

/** Les quatre barres du réseau. */
function Reseau() {
  return (
    <svg viewBox="0 0 18 12" aria-hidden="true" focusable="false">
      <rect x="0" y="8" width="3" height="4" rx="0.8" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
      <rect x="10" y="3" width="3" height="9" rx="0.8" />
      <rect x="15" y="0" width="3" height="12" rx="0.8" />
    </svg>
  );
}

/** Le wifi : trois arcs et un point. */
function Wifi() {
  return (
    <svg viewBox="0 0 16 12" fill="none" aria-hidden="true" focusable="false">
      <path d="M1 4.2a10 10 0 0 1 14 0" />
      <path d="M3.6 6.9a6.3 6.3 0 0 1 8.8 0" />
      <path d="M6.2 9.5a2.6 2.6 0 0 1 3.6 0" />
      <circle cx="8" cy="11" r="0.9" className="phone-status-plein" />
    </svg>
  );
}

/** La batterie, pleine. */
function Batterie() {
  return (
    <svg viewBox="0 0 26 12" fill="none" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" />
      <rect x="2.5" y="2.5" width="18" height="7" rx="1.6" className="phone-status-plein" />
      <path d="M24 4v4a2 2 0 0 0 0-4Z" className="phone-status-plein" />
    </svg>
  );
}

/** La flèche du bouton « retour », dessinée ici plutôt qu'importée. */
function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
