# La corrélation entre la nuit et les apports — l'algorithme, en pseudo-langage

Le code est dans `src/domaine/correlation.ts` (tests : `correlation.test.ts`).
Il n'est branché à aucun écran : il attend que la V2 enregistre des nuits et
des repas (« garde cet algo pret qq part », 2026-09-17).

## Ce qu'on croise

- **Côté nuit** : la durée dormie (minutes) ; la qualité ressentie, quand elle
  est notée.
- **Côté apports d'une journée** : calories ; lipides, glucides, protéines,
  fibres en grammes ; et la **part** de chaque macronutriment dans les
  calories (lipides × 9, glucides × 4, protéines × 4, divisés par les kcal).
  Les grammes suivent la quantité, la part dit la composition.
- **Dans les deux sens** : la journée D contre la nuit qui **suit** (celle
  qui commence le soir de D), et la nuit qui **précède** D (celle du soir de
  D-1) contre la journée D.

## L'algorithme

```
POUR chaque sens dans [journée → nuit, nuit → journée] :
    paires ← []
    POUR chaque journée D ayant des apports :
        soir ← (sens = journée → nuit) ? D : veille(D)
        SI une nuit commence le soir `soir` :
            paires ← paires + (apports de D, cette nuit)
        SINON : on laisse la journée de côté (une valeur absente se tait)

    POUR chaque mesure_nuit dans [durée, qualité] :
        POUR chaque mesure_apports dans [kcal, lipides, glucides, protéines,
                                          fibres, part lipides, part glucides,
                                          part protéines] :
            x ← [], y ← []
            POUR chaque (apports, nuit) dans paires :
                a ← valeur(apports, mesure_apports)   -- null si kcal = 0 pour une part
                n ← valeur(nuit, mesure_nuit)         -- null si la qualité n'est pas notée
                SI a et n existent : x ← x + a ; y ← y + n

            SI taille(x) < JOURS_MINIMUM : passer     -- pas de résultat, plutôt que
                                                       -- un chiffre qui ment
            rho ← Spearman(x, y)                       -- Pearson sur les RANGS,
                                                       -- ex æquo au rang moyen
            p   ← p-valeur(rho, taille(x))             -- voir ci-dessous
            lien ← (p < SEUIL_P)
            résultats ← résultats + {sens, mesure_nuit, mesure_apports,
                                     n = taille(x), rho, p, lien}

TRIER résultats par p croissante, puis |rho| décroissante
```

La p-valeur :

```
z ← atanh(rho) × √((n − 3) / 1,06)      -- transformation de Fisher, correction
                                        -- de Spearman
p ← 1 − erf(|z| / √2)                    -- bilatérale, loi normale
```

## Les bornes

| Borne | Valeur | Ce qu'elle dit |
|---|---|---|
| `JOURS_MINIMUM` | 10 paires | En dessous, on ne calcule rien : une corrélation sur quelques jours ment. |
| `SEUIL_P` | 0,05 | On parle d'un **lien** quand la chance d'observer ce coefficient sans lien réel est sous 5 %. |
| `rho` | de −1 à +1 | Le signe dit le sens (plus l'un monte, plus l'autre monte ou descend) ; la valeur dit la force. |

Lecture de la force de `rho`, en valeur absolue, pour la restitution :

| \|rho\| | Force |
|---|---|
| < 0,2 | nulle ou négligeable |
| 0,2 – 0,4 | faible |
| 0,4 – 0,6 | moyenne |
| ≥ 0,6 | forte |

Deux garde-fous pour la restitution, quand elle existera :

- **Seize croisements par sens** (2 mesures de nuit × 8 d'apports) : au seuil
  de 5 %, un croisement sur vingt sortira « lié » par hasard. Ne montrer que
  les liens les plus nets, ou le dire.
- **Un lien n'est pas une cause** : la restitution décrit (« vos nuits les plus
  courtes suivent vos journées les plus riches »), elle ne conseille jamais.
