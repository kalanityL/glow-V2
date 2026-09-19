import { useEffect, useState } from 'react';

interface ChampEnLigneProps {
  /** La valeur enregistrée, sous la forme où elle s'écrit à l'écran. */
  valeur: string;
  /** Enregistre la valeur retenue ; appelée seulement si elle a changé. */
  onValeur: (valeur: string) => void;
  /** Le nom de la donnée, dit à qui écoute la page et en filigrane du champ vide. */
  nom: string;
  /**
   * Juge et normalise la saisie — ou rend `null` pour la refuser. Une saisie
   * refusée ne s'enregistre pas, la valeur enregistrée revient, et LE REFUS
   * SE DIT sous la valeur (`regle`), comme dans le profil de la V1.
   */
  normaliser?: (saisie: string) => string | null;
  /** Ce que la donnée attend, dit quand la saisie est refusée. */
  regle?: string;
  /** L'unité, écrite après la valeur — jamais dans le champ. */
  unite?: string;
  type?: 'text' | 'email' | 'password';
  /** Une valeur qui ne se montre pas — le mot de passe : des points en vue. */
  masque?: boolean;
  inputMode?: 'text' | 'decimal' | 'numeric';
  autoComplete?: string;
  /** Une valeur qui se lit comme un titre — le prénom à côté du portrait. */
  grand?: boolean;
}

/**
 * UNE VALEUR QUI S'ÉDITE SUR PLACE — le motif du profil de la V1 (demande du
 * 2026-08-15 : « mon profil : tous les champs inline editables »), repris tel
 * quel dans son FONCTIONNEMENT (2026-09-19, « info editable en inline sans
 * icone de modification comme sur la V1 » ; « les infos éditables inline, pas
 * dans des champs ») : on touche la valeur, elle devient un champ ; elle
 * s'enregistre quand le champ perd le focus ou sur Entrée ; Échap rend la
 * valeur enregistrée. Pas d'intitulé, pas de crayon, pas de bouton : rien de
 * plus que dans un journal.
 *
 * Le brouillon suit la valeur enregistrée si elle change ailleurs. Le refus
 * s'efface dès que la saisie redevient acceptable, et à la réouverture.
 */
export function ChampEnLigne({
  valeur,
  onValeur,
  nom,
  normaliser = (saisie) => saisie.trim(),
  regle,
  unite,
  type = 'text',
  inputMode,
  autoComplete,
  grand = false,
  masque = false,
}: ChampEnLigneProps) {
  const [enEdition, setEnEdition] = useState(false);
  const [brouillon, setBrouillon] = useState(valeur);
  const [refuse, setRefuse] = useState(false);

  useEffect(() => {
    setBrouillon(valeur);
  }, [valeur]);

  const ouvrir = () => {
    setRefuse(false);
    setEnEdition(true);
  };

  const valider = () => {
    setEnEdition(false);
    const retenue = normaliser(brouillon);
    if (retenue === null) {
      setBrouillon(valeur);
      setRefuse(true);
      return;
    }
    setRefuse(false);
    setBrouillon(retenue);
    if (retenue !== valeur) onValeur(retenue);
  };

  const abandonner = () => {
    setBrouillon(valeur);
    setEnEdition(false);
  };

  const classe = grand ? 'enligne enligne--grand' : 'enligne';

  return (
    <span className={classe}>
      {enEdition ? (
        <input
          className="enligne__champ"
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={brouillon}
          placeholder={nom}
          aria-label={nom}
          autoFocus
          onChange={(evenement) => {
            setBrouillon(evenement.target.value);
            if (normaliser(evenement.target.value) !== null) setRefuse(false);
          }}
          onBlur={valider}
          onKeyDown={(evenement) => {
            if (evenement.key === 'Enter') valider();
            if (evenement.key === 'Escape') abandonner();
          }}
        />
      ) : (
        <button
          type="button"
          className={`enligne__valeur${valeur ? '' : ' enligne__valeur--vide'}`}
          aria-label={nom}
          onClick={ouvrir}
        >
          {valeur ? (masque ? '••••••••' : valeur) : nom}
        </button>
      )}
      {unite ? <span className="enligne__unite">{unite}</span> : null}
      {refuse && regle ? <span className="regle regle--manquee enligne__regle">{regle}</span> : null}
    </span>
  );
}
