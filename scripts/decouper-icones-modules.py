#!/usr/bin/env python3
"""
DÉCOUPER SES ICÔNES DE MODULES (2026-09-26, « uniquement pour la home, utilise
les icones dans ../images pour claude/template/icones pour le bas de la
home ») : ses huit captures — des icônes en relief, bleues, sur un fond blanc
et un disque très pâle — deviennent huit PNG détourés, carrés et centrés, que
`src/assets/images/modules/` embarque.

CE NE SONT PAS DES MASQUES, contrairement aux icônes de sport : ces dessins
ont leurs propres dégradés et leur volume, qu'un aplat de thème détruirait.
Leurs couleurs sont donc CELLES DE SES IMAGES — exception consignée dans
GUIDELINES, comme la coche de validation d'une confirmation.

Le détourage se fait PAR PROPAGATION DEPUIS LES BORDS, jamais par un seuil :
un seuil sur le blanc mangerait les blancs INTÉRIEURS du dessin (le corps de
la balance, l'abat-jour de la lampe, le piston de la seringue). Seul ce qui
est clair ET relié au bord de la capture est du fond.

À relancer si elle dépose de nouvelles captures :
    python3 scripts/decouper-icones-modules.py
(il faut Pillow et numpy ; voir TODO-CLAUDE pour l'environnement.)
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

SOURCE = Path.home() / "Desktop/GLOW/Images-pour-claude/templates/icones"
SORTIE = Path(__file__).resolve().parent.parent / "src/assets/images/modules"

# Ses captures, et le module de chacune. Le nom du fichier de sortie est
# l'identifiant du module (`app/modules.ts`), sauf le traitement, dont
# l'image ne vaut que pour la forme injectable.
CAPTURES = {
    "Capture d’écran 2026-09-26 à 10.06.38.png": "traitement-injection",
    "Capture d’écran 2026-09-26 à 10.07.45.png": "balance",
    "Capture d’écran 2026-09-26 à 10.06.21.png": "effets-secondaires",
    "Capture d’écran 2026-09-26 à 10.12.02.png": "menus",
    "Capture d’écran 2026-09-26 à 10.08.01.png": "marche",
    "Capture d’écran 2026-09-26 à 10.08.05.png": "activite-physique",
    "Capture d’écran 2026-09-26 à 10.08.23.png": "sommeil",
    "Capture d’écran 2026-09-26 à 10.09.41.png": "temps-pour-soi",
}

# Un pixel est « du fond » s'il est à moins de cette distance du blanc des
# coins. Assez large pour emporter le disque pâle qui entoure chaque dessin,
# assez serré pour s'arrêter au premier bleu.
TOLERANCE = 40
# Le côté du carré rendu : deux fois la plus grande taille d'affichage (44 px
# dans un cercle de 56), pour que l'écran de téléphone ait sa densité.
COTE = 128
# L'air laissé autour du dessin dans le carré, en part du côté.
MARGE = 0.06


def detourer(chemin: Path) -> Image.Image:
    im = Image.open(chemin).convert("RGB")
    a = np.array(im).astype(int)
    h, l, _ = a.shape

    # Le blanc de référence : la médiane des quatre coins.
    coins = np.concatenate([a[0, :4], a[-1, :4], a[:4, 0], a[:4, -1]])
    blanc = np.median(coins, axis=0)
    clair = np.abs(a - blanc).max(axis=2) <= TOLERANCE

    # Propagation depuis les quatre bords : seul le clair CONNECTÉ au bord
    # est du fond. Les blancs intérieurs du dessin sont épargnés.
    fond = np.zeros((h, l), dtype=bool)
    file = deque()
    for x in range(l):
        for y in (0, h - 1):
            if clair[y, x] and not fond[y, x]:
                fond[y, x] = True
                file.append((y, x))
    for y in range(h):
        for x in (0, l - 1):
            if clair[y, x] and not fond[y, x]:
                fond[y, x] = True
                file.append((y, x))
    while file:
        y, x = file.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            v, u = y + dy, x + dx
            if 0 <= v < h and 0 <= u < l and clair[v, u] and not fond[v, u]:
                fond[v, u] = True
                file.append((v, u))

    alpha = np.where(fond, 0, 255).astype(np.uint8)
    decoupe = Image.fromarray(np.dstack([np.array(im), alpha]), "RGBA")

    # Recadrer sur le dessin, puis le centrer dans un carré avec un peu d'air.
    boite = decoupe.getbbox()
    if boite:
        decoupe = decoupe.crop(boite)
    utile = int(COTE * (1 - 2 * MARGE))
    echelle = min(utile / decoupe.width, utile / decoupe.height)
    decoupe = decoupe.resize(
        (max(1, round(decoupe.width * echelle)), max(1, round(decoupe.height * echelle))),
        Image.LANCZOS,
    )
    carre = Image.new("RGBA", (COTE, COTE), (0, 0, 0, 0))
    carre.paste(decoupe, ((COTE - decoupe.width) // 2, (COTE - decoupe.height) // 2), decoupe)
    return carre


def main() -> None:
    SORTIE.mkdir(parents=True, exist_ok=True)
    for fichier, module in CAPTURES.items():
        chemin = SOURCE / fichier
        if not chemin.exists():
            print(f"  MANQUE {fichier}")
            continue
        image = detourer(chemin)
        cible = SORTIE / f"{module}.png"
        image.save(cible, optimize=True)
        opaques = int((np.array(image)[:, :, 3] > 0).sum())
        print(f"  {module:22s} {cible.stat().st_size / 1024:6.1f} ko  {opaques} pixels peints")


if __name__ == "__main__":
    main()
