import { useTextes } from '../../i18n/useTextes';
import { UNITES_DU_SYSTEME, type Systeme } from '../../domaine/unites';
import { AGE_MAX, AGE_MIN, TAILLE_BORNES } from '../../domaine/mesures';
import { GENRES, type Genre } from './reponses';
import { ChoixUnique } from './ChoixUnique';
import { SelecteurNombre } from './SelecteurNombre';

interface EtapeProfilProps {
  age: number | null;
  onAge: (age: number) => void;
  taille: number | null;
  onTaille: (taille: number) => void;
  nom: string;
  onNom: (nom: string) => void;
  genre: Genre | null;
  onGenre: (genre: Genre) => void;
  systeme: Systeme;
}

/**
 * ÉTAPE : QUI VOUS ÊTES — la dernière avant l'application.
 *
 * Quatre questions sur un écran, parce qu'elles vont ensemble et qu'aucune ne
 * demande de réfléchir : l'âge, la taille, le nom, le genre.
 *
 * RIEN N'EST OBLIGATOIRE, PAS MÊME LE NOM. Les trois premières partent vides,
 * et le genre offre « Je le garde pour moi » — qui n'est pas un refus de
 * répondre mais une réponse : elle dit qu'on ne veut pas le dire, et
 * l'application n'a pas à revenir à la charge.
 *
 * LA TAILLE SUIT LE SYSTÈME D'UNITÉS choisi au deuxième écran : des
 * centimètres ou des pouces, avec les bornes qui vont avec.
 */
export function EtapeProfil({
  age,
  onAge,
  taille,
  onTaille,
  nom,
  onNom,
  genre,
  onGenre,
  systeme,
}: EtapeProfilProps) {
  const textes = useTextes();
  const uniteTaille = UNITES_DU_SYSTEME[systeme].taille;
  const bornes = TAILLE_BORNES[uniteTaille];

  return (
    <>
      <h1 className="titre">{textes.onboarding.profil.question}</h1>

      {/* L'ÂGE ET LA TAILLE CÔTE À CÔTE : deux nombres courts, et quatre
          questions empilées dépassaient la hauteur de l'écran — le bouton
          passait sous le pli. */}
      <div className="duo">
        <div>
          <p className="libelle-groupe libelle-groupe--premier">{textes.groupes.age}</p>
          <SelecteurNombre
            id="age"
            valeur={age}
            onValeur={onAge}
            min={AGE_MIN}
            max={AGE_MAX}
            question={textes.groupes.age}
          />
        </div>
        <div>
          <p className="libelle-groupe libelle-groupe--premier">{textes.groupes.taille}</p>
          <SelecteurNombre
            id="taille"
            valeur={taille}
            onValeur={onTaille}
            min={bornes.min}
            max={bornes.max}
            unite={uniteTaille}
            question={textes.groupes.taille}
          />
        </div>
      </div>

      <p className="libelle-groupe">{textes.groupes.nom}</p>
      <input
        id="nom"
        className="champ-texte"
        type="text"
        autoComplete="given-name"
        value={nom}
        onChange={(evenement) => onNom(evenement.target.value)}
        aria-label={textes.groupes.nom}
      />

      <p className="libelle-groupe">{textes.groupes.genre}</p>
      <ChoixUnique
        options={GENRES}
        libelle={(id) => textes.genres[id]}
        valeur={genre}
        onChoix={onGenre}
        question={textes.groupes.genre}
        enGrille
      />
    </>
  );
}
