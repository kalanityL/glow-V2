#!/usr/bin/env python3
"""
DÉCOUPER SES PLANCHES D'ICÔNES DE SPORT (2026-09-26, « découpe et met a jour
toutes les icones sports et catégroies de sport dans ../images pour claude/../
sportv2 (supprime les nuages) ») : dix planches où chaque sport est dessiné en
relief, bleu, posé sur un petit nuage, son nom écrit dessous. Chacune donne un
PNG détouré, nommé du slug de son sport.

CE NE SONT PAS DES MASQUES, contrairement aux icônes de sport d'avant : ces
dessins ont leurs dégradés et leur volume, qu'un aplat de thème détruirait.
Leurs couleurs sont celles de ses images — exception consignée, comme les
icônes de la home.

LES NUAGES : ils sont d'un bleu pâle qui CHEVAUCHE les blancs du dessin
(relevé au pixel : nuage de 1 à 61 d'écart au blanc, blanc du dessin de 11 à
88) — aucun seuil de couleur ne les sépare. On passe donc par la GÉOMÉTRIE :
les traits soutenus du dessin, fermés puis remplis, font son enveloppe ; tout
ce qui est dehors s'en va, nuages compris. Il reste autour du dessin quelques
plages de BLANC QUASI PUR que la fermeture ne sait pas rogner ; elles sont
invisibles sur les fonds blancs de l'application, où ces icônes se posent sans
pastille.

Les noms viennent de `PLANCHES` : ils sont LUS sur les planches, dans l'ordre
de lecture (de gauche à droite, de haut en bas). Le découpage, lui, est
automatique — par projection des blancs, une cellule par sport, l'icône prise
au-dessus de son nom.

    python3 scripts/decouper-icones-sports.py
(il faut Pillow et numpy.)
"""
from collections import deque
from pathlib import Path
import unicodedata

import numpy as np
from PIL import Image, ImageFilter

SOURCE = Path.home() / "Desktop/GLOW/Images-pour-claude/icones/sportv2"
SORTIE = Path(__file__).resolve().parent.parent / "src/assets/images/activites"

# Le seuil qui distingue un trait du dessin d'un nuage, et le rayon de la
# fermeture qui relie les traits et englobe les plages blanches du dessin.
TRAIT = 55
FERMETURE = 41
# Le côté du carré rendu, et l'air autour.
COTE = 160
MARGE = 0.04

# Ses dix planches, et ce qu'elles portent DANS L'ORDRE DE LECTURE.
# `None` : une image à ignorer (un nom que l'arbre ne porte plus).
PLANCHES = {
    "ChatGPT Image 26 sept. 2026, 12_35_35.png": [
        "Basket-ball", "Football", "Football américain", "Rugby", "Handball",
        "Hockey", "Volley-ball", "Baseball", "Softball", "Golf",
        "Croquet", "Pétanque et boulingrin", "Cricket", "Kickball", "Crosse", "Netball",
        "Pelote basque", "Hacky sack", "Jonglage", "Curling",
    ],
    "ChatGPT Image 26 sept. 2026, 12_36_22.png": [
        "Badminton", "Tennis", "Squash", "Racquetball", "Paddleball", "Tennis de table",
        "Vélo", "Roller", "Skateboard",
        "Marche", "Randonnée", None, "Course à pied", "Athlétisme",
        "Équitation", "Rodéo", "Polo",
    ],
    "ChatGPT Image 26 sept. 2026, 12_37_32.png": [
        "Yoga", "Pilates", "Callisthénie", "Cardio", "Aérobic", "Vélo elliptique",
        "Rameur", "Muscu", "Danse", "Zumba", "Corde à sauter", "Trampoline",
        "Boxe", "Arts martiaux", "Escrime", "Escalade", "Frisbee",
        "Gymnastique", "Lutte", "Parachutisme", "Tir à l'arc", "Fléchettes",
    ],
    "ChatGPT Image 26 sept. 2026, 12_37_54.png": [
        "Natation", "Plongée", "Aquagym", "Course aquatique", "Marche aquatique", "Vélo aquatique",
        "Canoë, kayak et aviron", "Voile", "Surf", "Stand up paddle", "Planche à voile",
        "Plongeon", "Water-polo", "Volley-ball aquatique", "Pédalo", "Ski nautique", "Tubing",
    ],
    "ChatGPT Image 26 sept. 2026, 12_39_15.png": [
        "Patinage", "Ski", "Raquettes à neige", "Motoneige", "Alpinisme", "Saut à ski", "Luge et bobsleigh",
        "Chasse et pêche", "Ménage et entretien de la maison", "Jardinage", "Bricolage",
        "Entretien automobile", "Entretien de bateau", "Pratique musicale", "Escalier",
    ],
    # Les catégories, sur leur propre planche.
    "ChatGPT Image 26 sept. 2026, 12_38_35.png": [
        "cat:pedestre", "cat:cheval", "cat:roues",
        "cat:activites-aquatiques", "cat:activites-hivernales", "cat:autre",
    ],
    # Quatre images seules : un sport, trois catégories.
    "ChatGPT Image 26 sept. 2026, 12_35_56.png": ["Bowling"],
    "ChatGPT Image 26 sept. 2026, 12_35_59.png": ["cat:raquettes"],
    "ChatGPT Image 26 sept. 2026, 12_36_03.png": ["cat:ballon-et-balles"],
    "ChatGPT Image 26 sept. 2026, 12_36_05.png": ["cat:individuel"],
}


def slug(nom: str) -> str:
    """Le slug d'un nom d'activité — le même que `domaine/activites.ts`."""
    sans = unicodedata.normalize("NFD", nom)
    sans = "".join(c for c in sans if unicodedata.category(c) != "Mn")
    sortie = []
    for c in sans.lower():
        sortie.append(c if c.isalnum() else "-")
    return "-".join(m for m in "".join(sortie).split("-") if m)


def remplir(masque):
    """Ce qui n'est pas atteint depuis les bords : l'intérieur du dessin."""
    h, l = masque.shape
    dehors = np.zeros((h, l), dtype=bool)
    file = deque()
    for x in range(l):
        for y in (0, h - 1):
            if not masque[y, x] and not dehors[y, x]:
                dehors[y, x] = True
                file.append((y, x))
    for y in range(h):
        for x in (0, l - 1):
            if not masque[y, x] and not dehors[y, x]:
                dehors[y, x] = True
                file.append((y, x))
    while file:
        y, x = file.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            v, u = y + dy, x + dx
            if 0 <= v < h and 0 <= u < l and not masque[v, u] and not dehors[v, u]:
                dehors[v, u] = True
                file.append((v, u))
    return ~dehors


def blocs(profil, creux=6):
    """Les suites de lignes (ou de colonnes) non vides, en (début, fin)."""
    suites, debut = [], None
    vide = 0
    for i, plein in enumerate(profil):
        if plein:
            if debut is None:
                debut = i
            vide = 0
        elif debut is not None:
            vide += 1
            if vide > creux:
                suites.append((debut, i - vide))
                debut = None
    if debut is not None:
        suites.append((debut, len(profil) - 1))
    return suites


def cellules(ecart):
    """Les cellules d'une planche : une par sport, dans l'ordre de lecture.

    Une rangée est une bande de lignes non vides ; dans une rangée, chaque
    colonne non vide est une cellule (l'icône ET son nom). L'icône est le
    premier bloc de la cellule, le nom celui d'en dessous."""
    encre = ecart > 25
    rangees = blocs(encre.any(axis=1), creux=18)
    trouvees = []
    for haut, bas in rangees:
        bande = encre[haut : bas + 1]
        for gauche, droite in blocs(bande.any(axis=0), creux=18):
            colonne = bande[:, gauche : droite + 1]
            morceaux = blocs(colonne.any(axis=1), creux=6)
            if not morceaux:
                continue
            # L'icône : le premier morceau. Les suivants sont son nom.
            hd, hf = morceaux[0]
            trouvees.append((gauche, droite, haut + hd, haut + hf))
    return trouvees


def detourer(vignette):
    a = np.array(vignette).astype(int)
    ecart = np.abs(a - 255).max(axis=2)
    fort = Image.fromarray(((ecart > TRAIT) * 255).astype(np.uint8), "L")
    env = remplir(np.array(fort.filter(ImageFilter.MaxFilter(FERMETURE))) > 128)
    env = np.array(Image.fromarray((env * 255).astype(np.uint8), "L").filter(ImageFilter.MinFilter(FERMETURE))) > 128
    env = remplir(env)
    alpha = np.array(Image.fromarray((env * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8)))
    return Image.fromarray(np.dstack([np.array(vignette), alpha]), "RGBA")


def au_carre(dessin):
    boite = dessin.getbbox()
    if boite:
        dessin = dessin.crop(boite)
    utile = int(COTE * (1 - 2 * MARGE))
    echelle = min(utile / dessin.width, utile / dessin.height)
    dessin = dessin.resize((max(1, round(dessin.width * echelle)), max(1, round(dessin.height * echelle))), Image.LANCZOS)
    carre = Image.new("RGBA", (COTE, COTE), (0, 0, 0, 0))
    carre.paste(dessin, ((COTE - dessin.width) // 2, (COTE - dessin.height) // 2), dessin)
    return carre


def main() -> None:
    (SORTIE / "sports").mkdir(parents=True, exist_ok=True)
    total, manques = 0, []
    for fichier, noms in PLANCHES.items():
        chemin = SOURCE / fichier
        if not chemin.exists():
            print(f"  MANQUE la planche {fichier}")
            continue
        planche = Image.open(chemin).convert("RGB")
        ecart = np.abs(np.array(planche).astype(int) - 255).max(axis=2)
        trouvees = cellules(ecart)
        if len(trouvees) != len(noms):
            print(f"  ⚠ {fichier[-14:]} : {len(trouvees)} cellules pour {len(noms)} noms — planche ignorée")
            manques.append(fichier)
            continue
        for (g, d, h, b), nom in zip(trouvees, noms):
            if nom is None:
                continue
            marge = 10
            vignette = planche.crop((max(0, g - marge), max(0, h - marge), min(planche.width, d + marge), min(planche.height, b + marge)))
            image = au_carre(detourer(vignette))
            if nom.startswith("cat:"):
                cible = SORTIE / f"{nom[4:]}.png"
            else:
                cible = SORTIE / "sports" / f"{slug(nom)}.png"
            image.save(cible, optimize=True)
            total += 1
        print(f"  {fichier[-14:]} : {len(trouvees)} découpées")
    print(f"\n  {total} icônes écrites dans {SORTIE}")
    if manques:
        print("  planches à revoir :", ", ".join(m[-14:] for m in manques))


if __name__ == "__main__":
    main()
