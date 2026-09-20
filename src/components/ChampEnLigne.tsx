import { useEffect, useState, type ReactNode } from 'react';

interface ChampEnLigneProps {
  /** La valeur enregistrée, sous la forme où elle s'écrit à l'écran. */
  valeur: string;
  /**
   * Ce qu'on LIT quand on n'édite pas, si ce n'est pas la valeur elle-même :
   * l'âge se lit (« 46 ans »), la date de naissance s'édite (2026-09-20,
   * « qd on édite l'age, on remplit la date de naissance »).
   */
  valeurAffichee?: string;
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
  /** Chaque frappe, telle quelle — pour qui veut suivre la saisie en temps
      réel (la règle des poids, 2026-09-20). */
  onSaisie?: (saisie: string) => void;
  /** L'ouverture et la fermeture de l'édition. */
  onEdition?: (enEdition: boolean) => void;
  /** L'unité, écrite après la valeur — jamais dans le champ. */
  unite?: string;
  type?: 'text' | 'email' | 'password';
  /** Une valeur qui ne se montre pas — le mot de passe : des points en vue. */
  masque?: boolean;
  inputMode?: 'text' | 'decimal' | 'numeric';
  autoComplete?: string;
  /**
   * L'icône de la donnée, dans sa pastille — UN BOUTON QUI OUVRE L'ÉDITION,
   * comme la valeur (2026-09-20, « clique sur icone ouvre la modification du
   * champ comme si on avait cliqué sur l'inline »).
   */
  icone?: ReactNode;
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
  valeurAffichee,
  onValeur,
  nom,
  normaliser = (saisie) => saisie.trim(),
  regle,
  onSaisie,
  onEdition,
  unite,
  type = 'text',
  inputMode,
  autoComplete,
  masque = false,
  icone,
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
    onEdition?.(true);
  };

  const valider = () => {
    setEnEdition(false);
    onEdition?.(false);
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
    onEdition?.(false);
  };

  return (
    <>
      {icone ? (
        <button type="button" className="ligne__icone ligne__icone--bouton" aria-label={nom} onClick={ouvrir}>
          {icone}
        </button>
      ) : null}
    <span className="enligne">
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
            onSaisie?.(evenement.target.value);
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
          {valeur ? (masque ? '••••••••' : (valeurAffichee ?? valeur)) : nom}
        </button>
      )}
      {unite ? <span className="enligne__unite">{unite}</span> : null}
      {refuse && regle ? <span className="regle regle--manquee enligne__regle">{regle}</span> : null}
    </span>
    </>
  );
}
