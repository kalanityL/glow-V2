import { useEffect, useState } from 'react';

interface ChampEnLigneProps {
  /** La valeur enregistrée. */
  valeur: string;
  /** Enregistre la valeur retenue ; appelée seulement si elle a changé. */
  onValeur: (valeur: string) => void;
  /** Le nom de la donnée, dit à qui écoute la page et en filigrane du champ vide. */
  nom: string;
  type?: 'text' | 'email';
  autoComplete?: string;
}

/**
 * UNE VALEUR QUI S'ÉDITE SUR PLACE — le motif du profil de la V1 (demande du
 * 2026-08-15 : « mon profil : tous les champs inline editables »), repris tel
 * quel dans son FONCTIONNEMENT (2026-09-19, « info editable en inline sans
 * icone de modification comme sur la V1 ») : on touche la valeur, elle
 * devient un champ ; elle s'enregistre quand le champ perd le focus ou sur
 * Entrée ; Échap rend la valeur enregistrée. Pas d'intitulé, pas de crayon,
 * pas de bouton : rien de plus que dans un journal.
 *
 * Le brouillon suit la valeur enregistrée si elle change ailleurs.
 */
export function ChampEnLigne({
  valeur,
  onValeur,
  nom,
  type = 'text',
  autoComplete,
}: ChampEnLigneProps) {
  const [enEdition, setEnEdition] = useState(false);
  const [brouillon, setBrouillon] = useState(valeur);

  useEffect(() => {
    setBrouillon(valeur);
  }, [valeur]);

  const valider = () => {
    setEnEdition(false);
    const retenue = brouillon.trim();
    if (retenue !== valeur) onValeur(retenue);
  };

  const abandonner = () => {
    setBrouillon(valeur);
    setEnEdition(false);
  };

  if (enEdition) {
    return (
      <input
        className="enligne__champ"
        type={type}
        autoComplete={autoComplete}
        value={brouillon}
        placeholder={nom}
        aria-label={nom}
        autoFocus
        onChange={(evenement) => setBrouillon(evenement.target.value)}
        onBlur={valider}
        onKeyDown={(evenement) => {
          if (evenement.key === 'Enter') valider();
          if (evenement.key === 'Escape') abandonner();
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={`enligne__valeur${valeur ? '' : ' enligne__valeur--vide'}`}
      aria-label={nom}
      onClick={() => setEnEdition(true)}
    >
      {valeur || nom}
    </button>
  );
}
