import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { ChampEnLigne } from '../components/ChampEnLigne';
import {
  IconeBalance,
  IconeCadenas,
  IconeCalendrier,
  IconeProfil,
  IconeSeringue,
  IconeCible,
  IconeCourriel,
  IconeRegle,
} from '../components/Icones';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { UNITES_DU_SYSTEME, tailleAffichee, tailleEnCm } from '../domaine/unites';
import { POIDS_MAX, POIDS_MIN, TAILLE_BORNES, poidsDepuisSaisie } from '../domaine/mesures';
import { ageA, dateLocale, formaterDateCourte, lireDateCourte } from '../domaine/dates';
import { TRAITEMENTS } from '../domaine/traitements';
import { BlocTraitement, type ChoixTraitement } from './BlocTraitement';
import { motDePasseValide } from '../domaine/compte';
import { detecterLangue } from '../i18n/useTextes';
import { montrerVolet, voletVisible } from '../plateforme/navigateur';
import type { useParcours } from '../app/useParcours';
import type { FondProps } from './Accueil';
import { EtapeAvatar } from './onboarding/EtapeAvatar';

/** Les trois volets du carrousel, dans l'ordre (2026-09-19, « Onglet
    information/avatar/mon compte »). */
export const VOLETS_COMPTE = ['informations', 'avatar', 'compte'] as const;
export type VoletCompte = (typeof VOLETS_COMPTE)[number];
const VOLETS = VOLETS_COMPTE;
type Volet = VoletCompte;

/**
 * LA PAGE « MON COMPTE » — « Mon profil » jusqu'au soir du 2026-09-19 (« page
 * mon profil devient mon compte. Onglet information/avatar/mon compte ») :
 * trois volets, Informations, Avatar, Mon compte, et des ONGLETS nommés figés
 * EN HAUT des volets (en bas jusqu'au soir, à la place des points). Le troisième volet porte l'adresse et le mot
 * de passe, éditables sur place comme le reste ; le mot de passe se montre en
 * points et garde sa seule règle, huit signes.
 *
 * L'HISTOIRE DE LA PAGE (2026-09-19, « clic sur avatar ouvre une page profil avec les
 * infos persos modifiables et la config de l'avatar […] garde les consignes :
 * pas de label et info editable en inline sans icone de modification comme
 * sur la V1 ; meme module de modification d'avatar que la v1, NE CHANGE PAS
 * LA FONCTIONNALITE UNIQUEMENT LE DESIGN DE LA FONCTIONNALITE »), refaite le
 * soir même sur ses consignes (« Mon profil / logo à gauche, fleche retour en
 * dessous / prenom éditable inline directement depuis le prénom à cote de
 * l'avatar, pas de prenom a nouveau dans les infos / dans les infos : pas
 * d'email, poids actuel, poids cible ; rmeplacer année de naissance par une
 * date par defaut 01/01 année de naissance, les infos éditables inline, pas
 * dans des champs. / séparation en 2 ; d'abord mes infos et un caroussel pour
 * acceder à la 2eme partie de modicitaion d'avatar, clic sur l'avatar
 * principal envoie sur le 2eme element du caroussel, boutons du bas du
 * carroussel figé en pas d'écran, scroller laisse toujours visble le
 * slider »).
 *
 * UNE PAGE À PART ENTIÈRE (2026-09-20, « mon compte est une page à part
 * entiere : le menu du bas apparait, pas de fleche de retour, search et notif
 * sur la meme ligne que logo, titre de page ligne du dessous centré pas en
 * gras ») : l'entête des pages (`EntetePage`), et la barre du bas
 * (`BarreDuBas`) dont « Accueil » ramène à l'accueil — plus de flèche.
 * PLUS D'IDENTITÉ EN TÊTE (2026-09-20, « supprimer avatar principal et
 * prenom, prenom apparait à la place dans les infos ») : le prénom est la
 * première ligne des informations, le portrait vit dans le volet de l'avatar.
 * LE CARROUSEL : deux volets qui glissent, « Mes informations » puis « Mon
 * avatar » ; chacun défile pour lui-même ; les deux points du bas sont FIGÉS
 * sous les volets, toujours visibles, et mènent à l'un ou l'autre.
 *
 * LES INFORMATIONS SONT CELLES DE LA V1 (2026-09-20, « information mon
 * compte : celles de la v1 ») : l'âge — lu en années, ÉDITÉ EN DATE DE
 * NAISSANCE (le 1er janvier de l'année de l'onboarding, tant qu'elle n'a pas
 * été précisée) —, la taille, le poids de départ, l'objectif final, et le
 * médicament prescrit, qui ouvre le bloc « Mon traitement »
 * (`BlocTraitement`). Toutes éditables sur place (`ChampEnLigne`), sans
 * intitulé ni crayon. Chaque saisie est jugée par le domaine — une date
 * qui existe, un poids ou une taille dans ses bornes — et le refus se dit
 * sous la valeur. Le poids et la taille sont stockés dans leur unité ou en
 * centimètres, comme l'onboarding les stocke : ce que l'écran montre est
 * dans l'unité choisie, ce qu'il rend repart dans la forme stockée.
 *
 * LE MODULE DE L'AVATAR est celui de l'onboarding (`EtapeAvatar`), à
 * l'identique, dans le second volet. Pas de bouton « Enregistrer » : chaque
 * valeur s'enregistre quand on la quitte. En thème Blanc, comme l'accueil.
 */
export function Compte({
  parcours,
  onAccueil,
  fond,
}: {
  parcours: ReturnType<typeof useParcours>;
  /** Le fond de page et ses gestes, tenus par `App`. */
  fond: FondProps;
  /** « Accueil » de la barre du bas ramène à l'accueil. */
  onAccueil: () => void;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const { reponses, repondre } = parcours;
  const carrousel = useRef<HTMLDivElement>(null);
  const [volet, setVolet] = useState<Volet>('informations');
  /* Le brouillon de l'avatar : ce que les réglages touchent, jusqu'à
     « Valider ». Il suit l'enregistré quand celui-ci change. */
  const [brouillonAvatar, setBrouillonAvatar] = useState(reponses.avatar);
  useEffect(() => {
    setBrouillonAvatar(reponses.avatar);
  }, [reponses.avatar]);
  const avatarModifie = JSON.stringify(brouillonAvatar) !== JSON.stringify(reponses.avatar);
  /* LE BLOC « MON TRAITEMENT » (2026-09-20) : ouvert par la valeur du
     médicament. Ce qu'il édite part de ce qui est enregistré ; « aucun »
     quand il n'y a pas de traitement. */
  const [blocTraitement, setBlocTraitement] = useState(false);
  const traitementCourant: ChoixTraitement = reponses.traitement
    ? { forme: reponses.formeTraitement, traitement: reponses.traitement }
    : { forme: 'aucun', traitement: null };
  const nomTraitement = TRAITEMENTS.find((t) => t.id === reponses.traitement)?.nom;
  const enregistrerTraitement = (choix: ChoixTraitement) => {
    if (choix.forme === 'aucun' || choix.forme === null) {
      parcours.repondreTraitementCommence(false);
      return;
    }
    parcours.repondreTraitementCommence(true);
    parcours.repondreForme(choix.forme);
    if (choix.traitement) repondre('traitement', choix.traitement);
  };
  const aujourdhui = dateLocale(new Date());

  const unites = UNITES_DU_SYSTEME[reponses.systeme];
  const bornesTaille = TAILLE_BORNES[unites.taille];
  const separateur = textes.separateurDecimal;
  /* Le poids est stocké avec un point ; il s'écrit avec le séparateur de la
     langue, et se relit avec l'un ou l'autre. */
  const poidsEcrit = (stocke: string) => stocke.replace('.', separateur);

  const aller = (cible: Volet) => {
    montrerVolet(carrousel.current, VOLETS.indexOf(cible));
    setVolet(cible);
  };

  return (
    <div className={`page page--photo page--fond-${fond.apercu ?? fond.courant} ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.compte.titre} onAccueil={onAccueil} />

        {/* LES ONGLETS DU CARROUSEL, FIGÉS AU-DESSUS DES VOLETS (2026-09-19,
            « les onglets sont en haut » — ils étaient en bas) : ils restent
            en place quoi qu'on fasse défiler, et mènent à chaque volet. */}
        <div className="carrousel__onglets" role="tablist">
          {VOLETS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={`carrousel__onglet${volet === id ? ' carrousel__onglet--actif' : ''}`}
              aria-selected={volet === id}
              onClick={() => aller(id)}
            >
              {textes.compte.onglets[id]}
            </button>
          ))}
        </div>
        <div
          className="carrousel"
          ref={carrousel}
          onScroll={() => setVolet(VOLETS[voletVisible(carrousel.current)] ?? 'informations')}
        >
          <section className="carrousel__volet" aria-label={textes.compte.onglets.informations}>
            <div className="carte">
              <div className="ligne">
                <ChampEnLigne
                  icone={<IconeProfil />}
                  valeur={reponses.prenom}
                  onValeur={(prenom) => repondre('prenom', prenom)}
                  nom={textes.groupes.prenom}
                  autoComplete="given-name"
                />
              </div>

              <div className="ligne">
                {/* L'ÂGE SE LIT, LA DATE DE NAISSANCE S'ÉDITE (2026-09-20,
                    « qd on édite l'age, on remplit la date de naissance »). */}
                <ChampEnLigne
                  icone={<IconeCalendrier />}
                  valeur={formaterDateCourte(reponses.dateNaissance, langue)}
                  valeurAffichee={textes.compte.ageEcrit(ageA(reponses.dateNaissance, aujourdhui))}
                  onValeur={(ecrite) => {
                    const lue = lireDateCourte(ecrite, langue);
                    if (lue) repondre('dateNaissance', lue);
                  }}
                  normaliser={(saisie) => {
                    const lue = lireDateCourte(saisie, langue);
                    return lue ? formaterDateCourte(lue, langue) : null;
                  }}
                  regle={textes.compte.regleDate}
                  nom={textes.groupes.age}
                  inputMode="numeric"
                />
              </div>

              <div className="ligne">
                <ChampEnLigne
                  icone={<IconeRegle />}
                  valeur={String(tailleAffichee(reponses.tailleCm, unites.taille))}
                  onValeur={(ecrite) => repondre('tailleCm', tailleEnCm(Number(ecrite), unites.taille))}
                  normaliser={(saisie) => {
                    const n = Number(saisie.trim());
                    return Number.isInteger(n) && n >= bornesTaille.min && n <= bornesTaille.max
                      ? String(n)
                      : null;
                  }}
                  regle={textes.compte.regleTaille(bornesTaille.min, bornesTaille.max, textes.unites[unites.taille])}
                  unite={textes.unites[unites.taille]}
                  nom={textes.groupes.taille}
                  inputMode="numeric"
                />
              </div>

              <div className="ligne">
                <ChampEnLigne
                  icone={<IconeBalance />}
                  valeur={poidsEcrit(reponses.poids)}
                  onValeur={(ecrite) => {
                    const stocke = poidsDepuisSaisie(ecrite, unites.poids);
                    if (stocke) repondre('poids', stocke);
                  }}
                  normaliser={(saisie) => {
                    const stocke = poidsDepuisSaisie(saisie, unites.poids);
                    return stocke ? poidsEcrit(stocke) : null;
                  }}
                  regle={textes.compte.reglePoids(POIDS_MIN, POIDS_MAX[unites.poids], textes.unites[unites.poids])}
                  unite={textes.unites[unites.poids]}
                  nom={textes.groupes.poids}
                  inputMode="decimal"
                />
              </div>

              <div className="ligne">
                <ChampEnLigne
                  icone={<IconeCible />}
                  valeur={poidsEcrit(reponses.poidsCible)}
                  onValeur={(ecrite) => {
                    const stocke = poidsDepuisSaisie(ecrite, unites.poids);
                    if (stocke) repondre('poidsCible', stocke);
                  }}
                  normaliser={(saisie) => {
                    const stocke = poidsDepuisSaisie(saisie, unites.poids);
                    return stocke ? poidsEcrit(stocke) : null;
                  }}
                  regle={textes.compte.reglePoids(POIDS_MIN, POIDS_MAX[unites.poids], textes.unites[unites.poids])}
                  unite={textes.unites[unites.poids]}
                  nom={textes.groupes.poidsCible}
                  inputMode="decimal"
                />
              </div>

              <div className="ligne">
                {/* LE MÉDICAMENT PRESCRIT ne s'édite pas sur place : sa valeur
                    — et son icône — ouvrent le bloc « Mon traitement »
                    (2026-09-20). */}
                <button
                  type="button"
                  className="ligne__icone ligne__icone--bouton"
                  aria-label={textes.groupes.medicament}
                  onClick={() => setBlocTraitement(true)}
                >
                  <IconeSeringue />
                </button>
                <button
                  type="button"
                  className="enligne__valeur"
                  aria-label={textes.groupes.medicament}
                  onClick={() => setBlocTraitement(true)}
                >
                  {nomTraitement ?? textes.compte.traitement.aucun}
                </button>
              </div>
            </div>
          </section>

          {/* LE VOLET DE L'AVATAR (2026-09-20, « avatar : image de l'avatar
              fixe et bouton valider fixe, on scrolle entre les deux », puis
              « bouton valider à côté de l'avatar, pas en bas ») : le portrait
              et « Valider », côte à côte en haut, ne bougent pas ; les
              réglages défilent dessous. Les réglages touchent un BROUILLON,
              que le portrait montre ; « Valider » l'enregistre. */}
          <section
            className="carrousel__volet carrousel__volet--fixe"
            aria-label={textes.compte.onglets.avatar}
          >
            <div className="carte carte--colonne">
              <div className="compte__portrait">
                <Avatar avatar={brouillonAvatar} />
                <button
                  type="button"
                  className="bouton compte__valider"
                  disabled={!avatarModifie}
                  aria-disabled={!avatarModifie}
                  /* Valider ramène au volet des informations (2026-09-20,
                     « avatar validé : on revient à l'onglet information »). */
                  onClick={() => {
                    repondre('avatar', brouillonAvatar);
                    aller('informations');
                  }}
                >
                  {textes.compte.valider}
                </button>
              </div>
              <div className="carte__defilant">
                <EtapeAvatar avatar={brouillonAvatar} onAvatar={setBrouillonAvatar} sansTitre />
              </div>
            </div>
          </section>

          <section className="carrousel__volet" aria-label={textes.compte.onglets.compte}>
            <div className="carte">
              <div className="ligne">
                <ChampEnLigne
                  icone={<IconeCourriel />}
                  valeur={reponses.email}
                  onValeur={(email) => repondre('email', email)}
                  nom={textes.groupes.email}
                  type="email"
                  autoComplete="email"
                />
              </div>

              <div className="ligne">
                {/* La seule règle du mot de passe, huit signes (2026-09-08),
                    jugée au moment où on quitte le champ, comme les autres. */}
                <ChampEnLigne
                  icone={<IconeCadenas />}
                  valeur={reponses.motDePasse}
                  onValeur={(motDePasse) => repondre('motDePasse', motDePasse)}
                  normaliser={(saisie) => (motDePasseValide(saisie) ? saisie : null)}
                  regle={textes.onboarding.profil.regleMotDePasse}
                  nom={textes.groupes.motDePasse}
                  type="password"
                  autoComplete="new-password"
                  masque
                />
              </div>
            </div>
          </section>
        </div>

      </div>

      {blocTraitement ? (
        <BlocTraitement
          courant={traitementCourant}
          onEnregistrer={enregistrerTraitement}
          onFermer={() => setBlocTraitement(false)}
        />
      ) : null}

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={() => aller('compte')}
        forme={reponses.formeTraitement}
        fond={fond}
      />
    </div>
  );
}
