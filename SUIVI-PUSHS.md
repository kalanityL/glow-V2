# Suivi des pushs — V2

Règle reprise de la V1 : **avant chaque `git push origin main`, l'entrée du
lot s'ajoute en haut de ce fichier et part avec ce même push.** Le résumé
doit permettre de retrouver *quand et pourquoi* quelque chose a bougé : les
défauts corrigés et les décisions prises, pas seulement les commits.

La V2 n'a **aucun déploiement** (voir GUIDELINES.md) : une entrée parle donc
du push seul, jusqu'au jour où un déploiement existera.

---

## 2026-09-19 — second push · 108 commits (`b69715d..6b365ab`) · déployé

**Poussé et déployé sur sa demande** (« ppush et deploy »). Le déploiement
est le second de la V2 sur son site, `https://glow-private-v2.web.app`
(créé le 2026-09-17, voir GUIDELINES § 2) ; celui de la V1 n'est pas touché.

**Vérifié avant envoi :** `tsc` silencieux, `npm test` 35/35 (6 fichiers),
`npm run build` vert.

**Ce que le lot contient** — du 9 au 19 septembre :
- la mémoire du projet : `GUIDELINES.md` (avec le contrôle des guidelines
  à la fin de chaque modification), `VOCABULAIRE.md`, les deux TODO ; les
  quatre documents de spécification (`docs/`) et leurs assembleurs ;
- deux thèmes clairs, Blanc (aux couleurs et à la police de son colorboard)
  et Dégradé doux ; le mot-symbole en marine et vert ; le français seul
  (l'anglais lit le dictionnaire français) ;
- l'accueil, sur lequel la page s'ouvre directement (l'onboarding mis de
  côté) : la barre d'état du téléphone, la photo de fond en portrait,
  floutée ; l'entête de la home de la V1 ; le salut avec les étoiles dorées
  et le placeholder d'un badge ; huit pastilles de modules, icônes de la
  V1 ; le menu du bas aux couleurs de son image, « Menu » à la place de
  « Profil » ;
- le menu principal en tiroir, vitre floue derrière, trois sections dans
  l'ordre de la V1 ;
- la page « Mon compte » (le portrait et le tiroir y mènent) : trois volets
  à onglets — Informations éditables sur place sans champ (date de
  naissance, taille, poids, poids cible), Avatar (le module de
  l'onboarding), Mon compte (adresse, mot de passe) ;
- le domaine : `dates`, `mesures` (saisie d'un poids), `correlation` (la
  nuit passée contre les apports du lendemain, Spearman, gardé prêt) ;
- la configuration Firebase du site de la V2.

**Défauts corrigés en chemin :** les liserés du choix rognés par la zone qui
défile ; un bloc de styles dupliqué dans `page.css` ; le trait des dessins
maison non compensé dans les pastilles.

**Non traité :** aucune donnée n'est enregistrée ; les entrées du tiroir
autres que « Mon compte », le menu du bas hors « Menu », les huit modules ne
mènent nulle part ; l'accueil et le compte sont en thème Blanc forcé.

---

## 2026-09-08 — premier push · 48 commits (`bc1ed76..a833080`)

**Poussé sur sa demande** (« pousse et deploy »). Le déploiement n'a pas eu
lieu : la V2 n'a pas de configuration, et le seul projet Firebase de la machine
est celui de la V1 — trois sorties lui ont été proposées, aucune tranchée.

**Vérifié avant envoi :** `tsc` silencieux, `npm run build` vert. (Pas encore
de tests à cette date — Vitest arrive le 2026-09-09.)

**Ce que le lot contient** — tout ce qui existe, du premier jour au 8 :
- le dépôt neuf (React 19, TypeScript, Vite, rien d'autre), le cadre du
  téléphone et sa barre du bas repris de Mixte ;
- deux thèmes, Ciel et Ciel foncé, sur trois étages étanches (écrans en
  classes, `page.css` sans couleur, feuilles de jetons) ; le dégradé de Ciel
  foncé réglé en une dizaine d'allers-retours mesurés en OKLCH ;
- les polices embarquées (`scripts/fetch-fonts.mjs`) et le dictionnaire
  multilingue typé (`i18n/textes.ts`) ;
- l'onboarding en neuf étapes : thème, langue et unités, objectif, poids,
  poids visé (si perdre), traitement commencé, lequel (si oui), avatar de la
  V1, dernière étape (âge, taille, prénom, e-mail, mot de passe) ; les
  billes du décompte ; le parcours conditionnel (`parcours.ts`,
  `useParcours`) ; les sélecteurs à roues ;
- supprimés en route, à ne pas réintroduire : le niveau d'activité, le
  souhait d'activité, le message « Poids saisi incorrect », la question du
  genre à part.

**Cette entrée est écrite APRÈS le push**, le 2026-09-09 : la règle du suivi
n'avait pas encore été reprise de la V1. C'est le seul push qui n'a pas eu son
entrée avant de partir.
