import { enregistrer, lireEnregistre } from '../plateforme/navigateur';

/**
 * LES SPORTS RÉCENTS, DANS L'ORDRE DE LA SAISIE (2026-09-26, « récents :
 * dans l'ordre dans lequel ça a été saisie (date de création ou de mise à
 * jour), pas date de l'activité. Une activité future sera présente dans
 * recents ») : la ligne de la V1 ne dit pas quand elle a été écrite ni
 * remise à jour — ce que la V1 ne sait pas porter vit sous sa propre clé
 * (GUIDELINES) : ici la suite des sports consignés, le dernier en tête,
 * chacun une fois, neuf gardés (la page en montre quatre). Versionné,
 * comme les réponses hors base.
 */
export const CLE_SPORTS_RECENTS = 'glp1_v2_sports_recents';
export const VERSION_SPORTS_RECENTS = 1;
export const SPORTS_RECENTS_GARDES = 9;

interface EnregistrementRecents {
  version: number;
  sports: string[];
}

export function lireSportsRecents(texte: string | null = lireEnregistre(CLE_SPORTS_RECENTS)): string[] {
  if (!texte) return [];
  let lu: unknown;
  try {
    lu = JSON.parse(texte);
  } catch {
    return [];
  }
  if (typeof lu !== 'object' || lu === null) return [];
  const { version, sports } = lu as Partial<EnregistrementRecents>;
  if (version !== VERSION_SPORTS_RECENTS || !Array.isArray(sports)) return [];
  return sports.filter((s): s is string => typeof s === 'string');
}

/** La suite avec ce sport en tête — le même sport plus loin s'efface. */
export function avecLeSportRecent(sports: readonly string[], sport: string): string[] {
  return [sport, ...sports.filter((s) => s !== sport)].slice(0, SPORTS_RECENTS_GARDES);
}

/**
 * LA LISTE RECONSTRUITE À CHAQUE OUVERTURE DU FORMULAIRE (2026-09-26,
 * « recent : reconstruit la liste à chaque ouverture du formulaire ») : la
 * clé d'abord — elle seule sait l'ORDRE DE SAISIE, qu'elle a demandé le
 * matin —, puis LES SPORTS DU JOURNAL qu'elle ne connaît pas encore, du plus
 * récent au plus ancien.
 *
 * Sans ce second temps, un sport consigné hors du formulaire — ou avant que
 * la clé n'existe — ne paraissait jamais dans les récents, et il fallait le
 * ressaisir pour l'y voir.
 */
export function recentsAvecLeJournal(
  sports: readonly string[],
  activites: readonly { sport: string; date: string; time: string }[],
): string[] {
  const suite = [...sports];
  const connus = new Set(sports);
  /* Le journal est rangé du plus ancien au plus récent : on le remonte. */
  const parDate = [...activites].sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  for (let i = parDate.length - 1; i >= 0; i -= 1) {
    const sport = parDate[i].sport;
    if (connus.has(sport)) continue;
    connus.add(sport);
    suite.push(sport);
  }
  return suite.slice(0, SPORTS_RECENTS_GARDES);
}

/** Note un sport consigné (création ou mise à jour) et rend la suite. */
export function noterSportRecent(sport: string): string[] {
  const suite = avecLeSportRecent(lireSportsRecents(), sport);
  const enregistrement: EnregistrementRecents = { version: VERSION_SPORTS_RECENTS, sports: suite };
  enregistrer(CLE_SPORTS_RECENTS, JSON.stringify(enregistrement));
  return suite;
}
