import { useState } from 'react';
import { useParcours } from './app/useParcours';
import { useTextes } from './i18n/useTextes';
import { Onboarding } from './screens/Onboarding';
import { Accueil } from './screens/Accueil';
import { Compte } from './screens/Compte';
import { PagePrise } from './screens/PagePrise';
import { PageConfirmation, ENTREES_PESEE, ENTREES_PRISE } from './screens/PageConfirmation';
import { PagePesee } from './screens/PagePesee';
import { IconeBalance, IconeCalendrier, IconeComprime, IconeLieu, IconeSeringue } from './components/Icones';
import { TRAITEMENTS } from './domaine/traitements';
import { UNITES_DU_SYSTEME } from './domaine/unites';
import { dateLocale, formaterDateLongue } from './domaine/dates';
import { avecLaPesee, poidsLePlusRecent, type Pesee } from './domaine/pesees';
import { detecterLangue } from './i18n/useTextes';
import type { ModuleId } from './app/modules';
import type { Prise } from './domaine/prises';
import type { FondId } from './app/fonds';
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
export default function App() {
  const textes = useTextes();

  /* LE PARCOURS VIT ICI, et non dans l'onboarding : le bouton « retour » de la
     barre est hors de l'écran du téléphone — il figure le bouton natif — et
     doit pouvoir y reculer. */
  const parcours = useParcours();

  /* LA PAGE OUVERTE PAR-DESSUS L'ACCUEIL (2026-09-19) : « Mon compte »,
     ouverte par le portrait ou par le tiroir du menu. Le bouton « retour » de la barre y ramène à l'accueil —
     c'est pour cela que la page vit ici, à côté du parcours, et non dans
     l'accueil. (Le menu principal, lui, est un tiroir de l'accueil.) */
  const [page, setPage] = useState<'accueil' | 'compte' | 'prise' | 'confirmation' | 'pesee' | 'confirmation-pesee'>(
    'accueil',
  );

  /* LA PAGE D'UNE PRISE (2026-09-20, « ajouter->injection : envoie vers une
     page ultra simple avec uniquement le formulaire d'ajout d'injection de
     la v1 ») : la case « Traitement » du tiroir du « + » y mène, quand un
     traitement est répondu. LES PRISES VALIDÉES SONT GARDÉES ICI, EN
     MÉMOIRE SEULEMENT — ni journal ni enregistrement sur l'appareil encore,
     et l'écran qui suit la validation attend le sien (« je te donnerai
     l'écran de validation ensuite ») : validée, la prise ramène à l'accueil. */
  const [prises, setPrises] = useState<Prise[]>([]);
  /* LA MODIFICATION DE LA DERNIÈRE PRISE (2026-09-20, « clic sur bloc
     récapitulatif : réouvre le formulaire avec les données enregistrées
     par defaut ») : le formulaire part d'elle, « Mettre à jour » la
     remplace, et la confirmation le dit. */
  const [modification, setModification] = useState(false);
  const [miseAJour, setMiseAJour] = useState(false);
  const ajouter = (module: ModuleId) => {
    if (module === 'traitement' && parcours.reponses.formeTraitement && parcours.reponses.traitement) {
      setModification(false);
      setPage('prise');
    }
    if (module === 'balance') {
      setModification(false);
      setPage('pesee');
    }
  };

  /* LES PESÉES (2026-09-21, « ajouter balance : idem que ajouter
     injection ») : en mémoire seulement, comme les prises. Le poids proposé
     d'avance est celui de la pesée la plus proche d'aujourd'hui qui n'est
     pas dans le futur, sinon le poids du profil. Une pesée par jour : la
     nouvelle remplace celle du même jour. */
  const [pesees, setPesees] = useState<Pesee[]>([]);
  const [dernierePesee, setDernierePesee] = useState<Pesee | null>(null);
  const aujourdhui = dateLocale(new Date());
  const poidsPropose = poidsLePlusRecent(pesees, aujourdhui) ?? parcours.reponses.poids;
  const validerPesee = (pesee: Pesee) => {
    setPesees((avant) => avecLaPesee(modification && dernierePesee ? avant.filter((p) => p !== dernierePesee) : avant, pesee));
    setDernierePesee(pesee);
    setMiseAJour(modification);
    setModification(false);
    setPage('confirmation-pesee');
  };
  const langue = detecterLangue();
  const unites = UNITES_DU_SYSTEME[parcours.reponses.systeme];
  const poidsEcrit = (stocke: string) => `${stocke.replace('.', textes.separateurDecimal)} ${textes.unites[unites.poids]}`;
  /* Validée, la prise mène à L'ÉCRAN DE CONFIRMATION (2026-09-20, son
     image) : la dernière prise, et ce qu'on peut faire maintenant. */
  const validerPrise = (prise: Prise) => {
    setPrises((avant) => (modification ? [...avant.slice(0, -1), prise] : [...avant, prise]));
    setMiseAJour(modification);
    setModification(false);
    setPage('confirmation');
  };
  const derniere = prises[prises.length - 1] ?? null;

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

  return (
    <div className="app-root">
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
          {!parcours.entre ? (
            <Onboarding parcours={parcours} />
          ) : page === 'compte' ? (
            <Compte parcours={parcours} onAccueil={() => setPage('accueil')} fond={fond} onAjouter={ajouter} />
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
                  nom: TRAITEMENTS.find((t) => t.id === derniere.traitement)?.nom ?? '',
                  valeur: `${String(derniere.doseMg).replace('.', textes.separateurDecimal)} mg`,
                },
                {
                  icone: <IconeCalendrier />,
                  nom: formaterDateLongue(derniere.date, textes.calendrier.mois, langue),
                  valeur: derniere.heure,
                },
                ...(parcours.reponses.formeTraitement === 'comprime'
                  ? []
                  : [{ icone: <IconeLieu />, nom: textes.confirmation.zone, valeur: textes.prise.zones[derniere.zone] }]),
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
              fond={fond}
            />
          ) : page === 'confirmation-pesee' && dernierePesee ? (
            <PageConfirmation
              titrePage={textes.accueil.modules.balance}
              titre={miseAJour ? textes.confirmation.titrePeseeMiseAJour : textes.confirmation.titrePesee}
              lignes={[
                { icone: <IconeBalance />, nom: textes.confirmation.poids, valeur: poidsEcrit(dernierePesee.poids) },
                {
                  icone: <IconeCalendrier />,
                  nom: formaterDateLongue(dernierePesee.date, textes.calendrier.mois, langue),
                  valeur: dernierePesee.heure,
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
            />
          )}
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
