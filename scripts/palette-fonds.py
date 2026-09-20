#!/usr/bin/env python3
"""
LA PALETTE DE CHAQUE FOND DE PAGE (2026-09-20 au soir, « a part le theme
par defaut, calcule changement couleur logo et header selon image de fond
choisie ») : pour chaque fond sauf le fond par défaut (« Fleurs »), ce script
LIT L'IMAGE et en tire la teinte dominante vive, puis écrit, dans
`src/themes/fonds-palette.css`, les jetons du logo et de l'entête pour
`.page--fond-<id>` — les mêmes jetons que le ciel de la V1 rebranchait le
2026-09-20 : les trois bleus de la pastille, l'encre de G et LOW, l'accent
de L/P/1 et de la devise, l'encre des pastilles de l'entête — et l'encre
des textes posés à même le fond (le salut, le titre de page).

CALCULÉ ICI, UNE FOIS, PAS DANS LE NAVIGATEUR : le résultat est une feuille
de jetons lisible et versionnée, qu'on peut relire, corriger, et qui ne
coûte rien à l'écran. Se relance à chaque fond ajouté :

    python3 scripts/palette-fonds.py

La teinte : l'angle moyen (vectoriel) des pixels vifs — saturation et
valeur assez hautes —, pondéré par leur saturation ; un fond sans pixel vif
(gris, blanc) prend une teinte neutre. Le clair ou le sombre : la
luminance moyenne du haut de l'image, là où l'entête se pose — sombre, les
encres s'inversent en clair.
"""
from __future__ import annotations

import colorsys
import math
from pathlib import Path

from PIL import Image

RACINE = Path(__file__).resolve().parent.parent
IMAGES = RACINE / 'src' / 'assets' / 'images'
SORTIE = RACINE / 'src' / 'themes' / 'fonds-palette.css'

# Les fonds, par identifiant de `src/app/fonds.ts`, et leur fichier. Le fond
# par défaut, `photo` (Fleurs), garde les couleurs du thème : il n'est pas là.
FONDS = {
    'ciel': 'fond-brasserie.jpg',
    'nature-printaniere': 'fond-nature-printaniere.jpg',
    'coucher-de-soleil': 'fond-coucher-de-soleil.jpg',
    'bord-de-mer': 'fond-bord-de-mer.jpg',
    'foret': 'fond-foret.jpg',
    'cafe-parisien': 'fond-cafe-parisien.jpg',
    'nuit-etoilee': 'fond-nuit-etoilee.jpg',
    'minimaliste-clair': 'fond-minimaliste-clair.jpg',
    'aquarelle': 'fond-aquarelle.jpg',
    'montagnes': 'fond-montagnes.jpg',
    'abstrait-glow': 'fond-abstrait-glow.jpg',
}


def teinte_dominante(image: Image.Image) -> tuple[float, float]:
    """L'angle de teinte dominant (0–360) des pixels vifs, et la part de pixels
    vifs (0–1). Moyenne vectorielle pondérée par la saturation : deux teintes
    voisines se renforcent, deux opposées s'annulent — pas d'histogramme à
    cases arbitraires."""
    petite = image.convert('RGB').resize((96, int(96 * image.height / image.width)))
    pixels = petite.load()
    x = y = 0.0
    vifs = 0
    total = 0
    for r, g, b in (pixels[i, j] for j in range(petite.height) for i in range(petite.width)):
        total += 1
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if s < 0.28 or v < 0.25:
            continue
        vifs += 1
        x += s * math.cos(h * 2 * math.pi)
        y += s * math.sin(h * 2 * math.pi)
    if vifs == 0:
        return 210.0, 0.0
    angle = math.degrees(math.atan2(y, x)) % 360
    return angle, vifs / total


def luminance_du_haut(image: Image.Image) -> float:
    """La luminance moyenne (0–1) du quart supérieur : là où l'entête se pose."""
    petite = image.convert('RGB').resize((64, 64))
    pixels = petite.load()
    valeurs = [pixels[i, j] for j in range(16) for i in range(64)]
    return sum(0.2126 * r + 0.7152 * g + 0.0722 * b for r, g, b in valeurs) / (len(valeurs) * 255)


def hsl(h: float, s: float, l: float) -> str:
    """Une couleur CSS `hsl()`, arrondie."""
    return f'hsl({round(h)} {round(s * 100)}% {round(l * 100)}%)'


def palette(h: float, part_vive: float, sombre: bool) -> dict[str, str]:
    """Les jetons pour une teinte. Peu de pixels vifs : la palette se désature
    d'autant, pour ne pas peindre un logo criard sur un fond doux."""
    s = 0.35 + 0.45 * min(1.0, part_vive * 2)
    if sombre:
        # Les pastilles de l'entête restent blanches à encre sombre : leur
        # encre n'est pas touchée. Les textes à même le fond passent en clair.
        return {
            '--logo-from': hsl(h, s, 0.55),
            '--logo-via': hsl(h, s, 0.38),
            '--logo-to': hsl(h, s * 0.8, 0.82),
            '--marque-degrade-debut': hsl(h, s * 0.5, 0.96),
            '--marque-degrade-fin': hsl(h, s * 0.5, 0.96),
            '--marque-accent': hsl(h, s * 0.7, 0.82),
            '--devise-encre': hsl(h, s * 0.7, 0.82),
            '--fond-encre': hsl(h, s * 0.4, 0.97),
        }
    encre = hsl(h, s * 0.8, 0.16)
    return {
        '--logo-from': hsl(h, s, 0.48),
        '--logo-via': hsl(h, s, 0.28),
        '--logo-to': hsl(h, s * 0.8, 0.72),
        '--marque-degrade-debut': encre,
        '--marque-degrade-fin': encre,
        '--marque-accent': hsl(h, s, 0.32),
        '--devise-encre': hsl(h, s, 0.32),
        '--rond-encre': hsl(h, s * 0.8, 0.2),
        '--fond-encre': encre,
    }


def main() -> None:
    lignes = [
        '/* ENGENDRÉ PAR `scripts/palette-fonds.py` — ne pas éditer à la main, relancer',
        '   le script. LA PALETTE DE CHAQUE FOND (2026-09-20 au soir, « a part le',
        '   theme par defaut, calcule changement couleur logo et header selon image',
        "   de fond choisie ») : les jetons du logo et de l'entête, tirés de la",
        "   teinte dominante vive de l'image ; encres claires sur un haut d'image",
        '   sombre. Le fond par défaut, « Fleurs », garde les couleurs du thème.',
        "   Deux classes, comme `.page--fond-<id>` : pour battre la feuille du",
        '   thème. */',
        '',
    ]
    for identifiant, fichier in FONDS.items():
        image = Image.open(IMAGES / fichier)
        h, part = teinte_dominante(image)
        lum = luminance_du_haut(image)
        sombre = lum < 0.45
        jetons = palette(h, part, sombre)
        lignes.append(
            f'/* {fichier} — teinte {round(h)}°, {round(part * 100)} % de pixels vifs, '
            f"haut {'sombre' if sombre else 'clair'} ({lum:.2f}). */"
        )
        lignes.append(f'.page.page--fond-{identifiant} {{')
        lignes.extend(f'  {nom}: {valeur};' for nom, valeur in jetons.items())
        lignes.append('}')
        lignes.append('')
    SORTIE.write_text('\n'.join(lignes).rstrip('\n') + '\n', encoding='utf-8')
    print(f'écrit {SORTIE.relative_to(RACINE)} ({len(FONDS)} fonds)')


if __name__ == '__main__':
    main()
