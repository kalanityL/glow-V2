import { Avatar } from '../components/Avatar';
import { ChampEnLigne } from '../components/ChampEnLigne';
import {
  IconeCalendrier,
  IconeCourriel,
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
import { TAILLE_BORNES, bornesAnneeNaissance } from '../domaine/mesures';
import type { useParcours } from '../app/useParcours';
import { EtapeAvatar } from './onboarding/EtapeAvatar';
import { SelecteurNombre } from './onboarding/SelecteurNombre';

/**
 * LA PAGE PROFIL (2026-09-19, « clic sur avatar ouvre une page profil avec les
 * infos persos modifiables et la config de l'avatar. inspire toi de cet ecran
 * pour le design, mais garde les consignes : pas de label et info editable en
 * inline sans icone de modification comme sur la V1 ; meme module de
 * modification d'avatar que la v1, NE CHANGE PAS LA FONCTIONNALITE UNIQUEMENT
 * LE DESIGN DE LA FONCTIONNALITE »).
 *
 * D'APRÈS SON ÉCRAN : l'entête (retour, « Profil », la marque), l'identité
 * (le portrait et le prénom), puis deux cartes — « Mes informations » et
 * « Mon avatar ». SES CONSIGNES, qui l'emportent sur l'écran : pas
 * d'intitulé devant une information, pas de crayon — la valeur s'édite sur
 * place, comme dans le profil de la V1 (`ChampEnLigne`) ; le module de
 * l'avatar est CELUI de la V1 repris par l'onboarding (`EtapeAvatar`), à
 * l'identique, seulement posé dans une carte. Pas de bouton
 * « Enregistrer » : comme dans la V1, chaque valeur s'enregistre quand on
 * la quitte.
 *
 * LES INFORMATIONS : le prénom, l'année de naissance, la taille, l'adresse —
 * ce que l'onboarding a recueilli de personnel. Les deux nombres passent par
 * la roue de l'application (`SelecteurNombre`), comme à l'onboarding : on ne
 * réécrit pas un sélecteur. Chaque ligne porte l'icône de sa donnée, qui la
 * nomme sans l'écrire.
 *
 * EN THÈME BLANC, comme l'accueil, provisoirement.
 */
export function Profil({
  parcours,
  onRevenir,
}: {
  parcours: ReturnType<typeof useParcours>;
  onRevenir: () => void;
}) {
  const textes = useTextes();
  const { reponses, repondre } = parcours;
  const uniteTaille = UNITES_DU_SYSTEME[reponses.systeme].taille;
  const bornes = TAILLE_BORNES[uniteTaille];
  const annees = bornesAnneeNaissance(new Date().getFullYear());

  return (
    <div className={`page page--photo ${classeDuTheme('blanc')}`}>
      <div className="page__colonne">
        <div className="profil__entete">
          <button type="button" className="rond rond--bouton" aria-label={textes.retour} onClick={onRevenir}>
            <IconeRetour />
          </button>
          <h1 className="profil__titre">{textes.profil.titre}</h1>
          <div className="profil__marque">
            <Logomark />
            <Wordmark />
          </div>
        </div>

        <div className="page__defilant">
          <div className="profil__identite">
            <div className="profil__cercle">
              <Avatar avatar={reponses.avatar} />
            </div>
            <p className="profil__nom">{reponses.prenom}</p>
          </div>

          <section className="carte">
            <h2 className="carte__titre">
              <span className="carte__icone">
                <IconeProfil />
              </span>
              {textes.profil.informations}
            </h2>
            <p className="carte__sous-titre">{textes.profil.informationsSousTitre}</p>

            <div className="ligne">
              <span className="ligne__icone">
                <IconeProfil />
              </span>
              <ChampEnLigne
                valeur={reponses.prenom}
                onValeur={(prenom) => repondre('prenom', prenom)}
                nom={textes.groupes.prenom}
                autoComplete="given-name"
              />
            </div>

            <div className="ligne">
              <span className="ligne__icone">
                <IconeCalendrier />
              </span>
              <SelecteurNombre
                id="profil-annee-naissance"
                valeur={reponses.anneeNaissance}
                onValeur={(annee) => repondre('anneeNaissance', annee)}
                min={annees.min}
                max={annees.max}
                question={textes.groupes.anneeNaissance}
              />
            </div>

            <div className="ligne">
              <span className="ligne__icone">
                <IconeRegle />
              </span>
              <SelecteurNombre
                id="profil-taille"
                valeur={tailleAffichee(reponses.tailleCm, uniteTaille)}
                onValeur={(valeur) => repondre('tailleCm', tailleEnCm(valeur, uniteTaille))}
                min={bornes.min}
                max={bornes.max}
                unite={uniteTaille}
                question={textes.groupes.taille}
              />
            </div>

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
          </section>

          <section className="carte">
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
          </section>
        </div>
      </div>
    </div>
  );
}
