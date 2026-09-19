import { useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { ChampEnLigne } from '../components/ChampEnLigne';
import {
  IconeBalance,
  IconeCalendrier,
  IconeCible,
  IconePalette,
  IconeProfil,
  IconeRegle,
  IconeRetour,
} from '../components/Icones';
import { Logomark } from '../components/Logomark';
import { Wordmark } from '../components/Wordmark';
import { useTextes } from '../i18n/useTextes';
import { classeDuTheme } from '../themes/themes';
import { UNITES_DU_SYSTEME, tailleAffichee, tailleEnCm } from '../domaine/unites';
import { POIDS_MAX, POIDS_MIN, TAILLE_BORNES, poidsDepuisSaisie } from '../domaine/mesures';
import { formaterDateCourte, lireDateCourte } from '../domaine/dates';
import { detecterLangue } from '../i18n/useTextes';
import { montrerVolet, voletVisible } from '../plateforme/navigateur';
import type { useParcours } from '../app/useParcours';
import { EtapeAvatar } from './onboarding/EtapeAvatar';

/** Les deux volets du carrousel, dans l'ordre. */
const VOLETS = ['informations', 'avatar'] as const;
type Volet = (typeof VOLETS)[number];

/**
 * LA PAGE PROFIL (2026-09-19, « clic sur avatar ouvre une page profil avec les
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
 * L'ENTÊTE : la marque à gauche, le bouton retour dessous, le titre à droite.
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
export function Profil({
  parcours,
  onRevenir,
}: {
  parcours: ReturnType<typeof useParcours>;
  onRevenir: () => void;
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
        <div className="profil__entete">
          <div className="profil__marque">
            <Logomark />
            <Wordmark />
          </div>
          <h1 className="profil__titre">{textes.profil.titre}</h1>
          <button
            type="button"
            className="rond rond--bouton profil__retour"
            aria-label={textes.retour}
            onClick={onRevenir}
          >
            <IconeRetour />
          </button>
        </div>

        <div className="profil__identite">
          <button
            type="button"
            className="profil__portrait-bouton"
            aria-label={textes.profil.avatar}
            onClick={() => aller('avatar')}
          >
            <div className="profil__cercle">
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

        <div
          className="carrousel"
          ref={carrousel}
          onScroll={() => setVolet(VOLETS[voletVisible(carrousel.current)] ?? 'informations')}
        >
          <section className="carrousel__volet" aria-label={textes.profil.informations}>
            <div className="carte">
              <h2 className="carte__titre">
                <span className="carte__icone">
                  <IconeProfil />
                </span>
                {textes.profil.informations}
              </h2>
              <p className="carte__sous-titre">{textes.profil.informationsSousTitre}</p>

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
                  regle={textes.profil.regleDate}
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
                  regle={textes.profil.regleTaille(bornesTaille.min, bornesTaille.max, textes.unites[unites.taille])}
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
                  regle={textes.profil.reglePoids(POIDS_MIN, POIDS_MAX[unites.poids], textes.unites[unites.poids])}
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
                  regle={textes.profil.reglePoids(POIDS_MIN, POIDS_MAX[unites.poids], textes.unites[unites.poids])}
                  unite={textes.unites[unites.poids]}
                  nom={textes.groupes.poidsCible}
                  inputMode="decimal"
                />
              </div>
            </div>
          </section>

          <section className="carrousel__volet" aria-label={textes.profil.avatar}>
            <div className="carte">
              <h2 className="carte__titre">
                <span className="carte__icone">
                  <IconePalette />
                </span>
                {textes.profil.avatar}
              </h2>
              <p className="carte__sous-titre">{textes.profil.avatarSousTitre}</p>
              <div className="profil__portrait">
                <Avatar avatar={reponses.avatar} />
              </div>
              <EtapeAvatar
                avatar={reponses.avatar}
                onAvatar={(avatar) => repondre('avatar', avatar)}
                sansTitre
              />
            </div>
          </section>
        </div>

        {/* LES POINTS DU CARROUSEL, FIGÉS SOUS LES VOLETS : ils restent en
            place quoi qu'on fasse défiler, et mènent à l'un ou l'autre. */}
        <div className="carrousel__points" role="tablist">
          {VOLETS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={`carrousel__point${volet === id ? ' carrousel__point--actif' : ''}`}
              aria-selected={volet === id}
              aria-label={id === 'informations' ? textes.profil.informations : textes.profil.avatar}
              onClick={() => aller(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
