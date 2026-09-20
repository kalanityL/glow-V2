import { useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { ChampEnLigne } from '../components/ChampEnLigne';
import {
  IconeBalance,
  IconeCadenas,
  IconeCalendrier,
  IconeCible,
  IconeCourriel,
  IconePalette,
  IconeProfil,
  IconeRegle,
} from '../components/Icones';
import { BarreDuBas } from './BarreDuBas';
import { EntetePage } from './EntetePage';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { UNITES_DU_SYSTEME, tailleAffichee, tailleEnCm } from '../domaine/unites';
import { POIDS_MAX, POIDS_MIN, TAILLE_BORNES, poidsDepuisSaisie } from '../domaine/mesures';
import { formaterDateCourte, lireDateCourte } from '../domaine/dates';
import { motDePasseValide } from '../domaine/compte';
import { detecterLangue } from '../i18n/useTextes';
import { montrerVolet, voletVisible } from '../plateforme/navigateur';
import type { useParcours } from '../app/useParcours';
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
 * L'IDENTITÉ : le portrait — qui mène au volet de l'avatar — et le prénom,
 * qui s'édite sur place, là, et nulle part ailleurs.
 * LE CARROUSEL : deux volets qui glissent, « Mes informations » puis « Mon
 * avatar » ; chacun défile pour lui-même ; les deux points du bas sont FIGÉS
 * sous les volets, toujours visibles, et mènent à l'un ou l'autre.
 *
 * LES INFORMATIONS, toutes éditables sur place (`ChampEnLigne`), sans
 * intitulé ni crayon : la date de naissance (le 1er janvier de l'année de
 * l'onboarding, tant qu'elle n'a pas été précisée), la taille, le poids
 * actuel, le poids cible. Chaque saisie est jugée par le domaine — une date
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
}: {
  parcours: ReturnType<typeof useParcours>;
  /** « Accueil » de la barre du bas ramène à l'accueil. */
  onAccueil: () => void;
}) {
  const textes = useTextes();
  const langue = detecterLangue();
  const { reponses, repondre } = parcours;
  const carrousel = useRef<HTMLDivElement>(null);
  const [volet, setVolet] = useState<Volet>('informations');

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
    <div className={`page page--photo ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <EntetePage titre={textes.compte.titre} />

        <div className="compte__identite">
          <button
            type="button"
            className="compte__portrait-bouton"
            aria-label={textes.compte.avatar}
            onClick={() => aller('avatar')}
          >
            <div className="compte__cercle">
              <Avatar avatar={reponses.avatar} />
            </div>
          </button>
          <ChampEnLigne
            valeur={reponses.prenom}
            onValeur={(prenom) => repondre('prenom', prenom)}
            nom={textes.groupes.prenom}
            autoComplete="given-name"
            grand
          />
        </div>

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
              <h2 className="carte__titre">
                <span className="carte__icone">
                  <IconeProfil />
                </span>
                {textes.compte.informations}
              </h2>
              <p className="carte__sous-titre">{textes.compte.informationsSousTitre}</p>

              <div className="ligne">
                <span className="ligne__icone">
                  <IconeCalendrier />
                </span>
                <ChampEnLigne
                  valeur={formaterDateCourte(reponses.dateNaissance, langue)}
                  onValeur={(ecrite) => {
                    const lue = lireDateCourte(ecrite, langue);
                    if (lue) repondre('dateNaissance', lue);
                  }}
                  normaliser={(saisie) => {
                    const lue = lireDateCourte(saisie, langue);
                    return lue ? formaterDateCourte(lue, langue) : null;
                  }}
                  regle={textes.compte.regleDate}
                  nom={textes.groupes.dateNaissance}
                  inputMode="numeric"
                />
              </div>

              <div className="ligne">
                <span className="ligne__icone">
                  <IconeRegle />
                </span>
                <ChampEnLigne
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
                <span className="ligne__icone">
                  <IconeBalance />
                </span>
                <ChampEnLigne
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
                <span className="ligne__icone">
                  <IconeCible />
                </span>
                <ChampEnLigne
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
            </div>
          </section>

          <section className="carrousel__volet" aria-label={textes.compte.onglets.avatar}>
            <div className="carte">
              <h2 className="carte__titre">
                <span className="carte__icone">
                  <IconePalette />
                </span>
                {textes.compte.avatar}
              </h2>
              <p className="carte__sous-titre">{textes.compte.avatarSousTitre}</p>
              <div className="compte__portrait">
                <Avatar avatar={reponses.avatar} />
              </div>
              <EtapeAvatar
                avatar={reponses.avatar}
                onAvatar={(avatar) => repondre('avatar', avatar)}
                sansTitre
              />
            </div>
          </section>

          <section className="carrousel__volet" aria-label={textes.compte.onglets.compte}>
            <div className="carte">
              <h2 className="carte__titre">
                <span className="carte__icone">
                  <IconeProfil />
                </span>
                {textes.compte.titre}
              </h2>
              <p className="carte__sous-titre">{textes.compte.compteSousTitre}</p>

              <div className="ligne">
                <span className="ligne__icone">
                  <IconeCourriel />
                </span>
                <ChampEnLigne
                  valeur={reponses.email}
                  onValeur={(email) => repondre('email', email)}
                  nom={textes.groupes.email}
                  type="email"
                  autoComplete="email"
                />
              </div>

              <div className="ligne">
                <span className="ligne__icone">
                  <IconeCadenas />
                </span>
                {/* La seule règle du mot de passe, huit signes (2026-09-08),
                    jugée au moment où on quitte le champ, comme les autres. */}
                <ChampEnLigne
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

      <BarreDuBas
        active={null}
        onAccueil={onAccueil}
        onOuvrirCompte={() => aller('compte')}
        forme={reponses.formeTraitement}
      />
    </div>
  );
}
