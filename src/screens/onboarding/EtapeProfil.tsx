import { useTextes } from '../../i18n/useTextes';
import {
  UNITES_DU_SYSTEME,
  tailleAffichee,
  tailleEnCm,
  type Systeme,
} from '../../domaine/unites';
import { TAILLE_BORNES, bornesAnneeNaissance } from '../../domaine/mesures';
import { LONGUEUR_MOT_DE_PASSE } from '../../domaine/compte';
import { SelecteurNombre } from './SelecteurNombre';

interface EtapeProfilProps {
  anneeNaissance: number;
  onAnneeNaissance: (annee: number) => void;
  /** En centimètres, toujours — l'écran convertit vers l'unité choisie. */
  tailleCm: number;
  onTailleCm: (cm: number) => void;
  /** L'année en cours, passée par l'appelant : l'écran ne lit pas l'horloge. */
  anneeCourante: number;
  prenom: string;
  onPrenom: (prenom: string) => void;
  email: string;
  onEmail: (email: string) => void;
  motDePasse: string;
  onMotDePasse: (motDePasse: string) => void;
  systeme: Systeme;
}

/**
 * ÉTAPE : QUI VOUS ÊTES — la dernière avant l'application.
 *
 * Cinq champs sur un écran : l'année de naissance, la taille, le prénom, puis
 * l'adresse et le mot de passe qui ouvriront le compte. L'ANNÉE DE NAISSANCE
 * REMPLACE L'ÂGE (2026-09-09) : un âge se périme, une année non.
 *
 * LE GENRE N'EST PLUS ICI (2026-09-08) : il fait partie de l'avatar, à l'écran
 * précédent, où il se voit. Le demander deux fois n'avait pas de sens.
 *
 * LA SEULE CONTRAINTE EST LA LONGUEUR DU MOT DE PASSE — huit signes —, et elle
 * ne se dit qu'une fois qu'on a commencé à l'écrire : reprocher sa brièveté à
 * un champ vide serait reprocher de n'avoir pas encore tapé.
 *
 * LA TAILLE SUIT LE SYSTÈME D'UNITÉS choisi au deuxième écran : des
 * centimètres ou des pouces, avec les bornes qui vont avec.
 */
export function EtapeProfil({
  anneeNaissance,
  onAnneeNaissance,
  tailleCm,
  onTailleCm,
  anneeCourante,
  prenom,
  onPrenom,
  email,
  onEmail,
  motDePasse,
  onMotDePasse,
  systeme,
}: EtapeProfilProps) {
  const textes = useTextes();
  const uniteTaille = UNITES_DU_SYSTEME[systeme].taille;
  const bornes = TAILLE_BORNES[uniteTaille];
  const annees = bornesAnneeNaissance(anneeCourante);

  return (
    <>
      <h1 className="titre">{textes.onboarding.profil.question}</h1>

      {/* L'ÂGE ET LA TAILLE CÔTE À CÔTE : deux nombres courts, et quatre
          questions empilées dépassaient la hauteur de l'écran — le bouton
          passait sous le pli. */}
      <div className="duo">
        <div>
          <p className="libelle-groupe libelle-groupe--premier">
            {textes.groupes.anneeNaissance}
          </p>
          <SelecteurNombre
            id="annee-naissance"
            valeur={anneeNaissance}
            onValeur={onAnneeNaissance}
            min={annees.min}
            max={annees.max}
            question={textes.groupes.anneeNaissance}
          />
        </div>
        <div>
          <p className="libelle-groupe libelle-groupe--premier">{textes.groupes.taille}</p>
          {/* La taille est stockée en centimètres et convertie aux deux
              bouts : ce que la roue montre est dans l'unité choisie, ce
              qu'elle rend repart en centimètres. */}
          <SelecteurNombre
            id="taille"
            valeur={tailleAffichee(tailleCm, uniteTaille)}
            onValeur={(valeur) => onTailleCm(tailleEnCm(valeur, uniteTaille))}
            min={bornes.min}
            max={bornes.max}
            unite={uniteTaille}
            question={textes.groupes.taille}
          />
        </div>
      </div>

      <p className="libelle-groupe">{textes.groupes.prenom}</p>
      <input
        id="prenom"
        className="champ-texte"
        type="text"
        autoComplete="given-name"
        value={prenom}
        onChange={(evenement) => onPrenom(evenement.target.value)}
        aria-label={textes.groupes.prenom}
      />

      <p className="libelle-groupe">{textes.groupes.email}</p>
      <input
        id="email"
        className="champ-texte"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(evenement) => onEmail(evenement.target.value)}
        aria-label={textes.groupes.email}
      />

      <p className="libelle-groupe">{textes.groupes.motDePasse}</p>
      <input
        id="mot-de-passe"
        className="champ-texte"
        type="password"
        autoComplete="new-password"
        value={motDePasse}
        onChange={(evenement) => onMotDePasse(evenement.target.value)}
        aria-label={textes.groupes.motDePasse}
        aria-describedby="mot-de-passe-regle"
      />
      {/* La règle est dite AVANT la faute, pas après : on sait ce qu'on doit
          taper pendant qu'on tape. Elle passe à l'accent quand elle n'est pas
          encore respectée, et seulement une fois qu'on a commencé. */}
      <p
        id="mot-de-passe-regle"
        className={`regle${
          motDePasse.length > 0 && motDePasse.length < LONGUEUR_MOT_DE_PASSE
            ? ' regle--manquee'
            : ''
        }`}
      >
        {textes.onboarding.profil.regleMotDePasse}
      </p>
    </>
  );
}
