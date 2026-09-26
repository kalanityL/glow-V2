#!/usr/bin/env python3
"""
DÉCOUPER SES PLANCHES D'ICÔNES D'ACTIVITÉ PHYSIQUE (2026-09-26, « remplacer
les images sports et categories de sport par ../... sportv3 - découpe et
remplace ») : dix planches où chaque sport et chaque catégorie est dessiné en
relief, bleu sur blanc, son nom écrit dessous. Chacune donne un PNG nommé du
slug du nœud de niveau 1 de l'arbre (`domaine/activites.ts`, `slugActivite`).

ON DÉCOUPE, ON NE REDESSINE PAS (2026-09-26, « catastrophe rien a voir avec
les images ; ne redessine pa, decoupe et utilise. remets la v1 et recommence
a zero la v3 sans redessiner ») : les icônes gardent LEURS couleurs, leurs
dégradés et leur relief. Un premier essai les avait rendues en MASQUES —
l'alpha seul, le RGB à zéro, la feuille les remplissant d'un aplat du thème —
et les dessins étaient devenus des silhouettes bleues unies. C'est
l'architecture d'avant ; elle ne vaut plus pour ces images-là.

Ce sont donc des IMAGES EN COULEUR, et `themes/page.css` les pose telles
quelles (`background-image`, pas `mask`). Exception consignée dans GUIDELINES,
comme les icônes de la home : leurs couleurs sont celles de ses images.

SES PLANCHES DE SEPTEMBRE AVAIENT DES NUAGES, CELLES-CI N'EN ONT PLUS : le
fond est à 0-2 d'écart du blanc. Le détourage se fait donc à l'écart au blanc,
sans ruser par la géométrie — l'alpha suit ce que le pixel a d'encre, le RGB
est gardé tel quel.

LE DÉCOUPAGE distingue trois choses, mesurées au pixel :
  — LE TEXTE EST BLEU NUIT, LES DESSINS SONT BLEU VIF (un nom : (28, 61, 126) ;
    un dessin : (76, 150, 245)). Un pixel dont le bleu est sous 190 ET le vert
    sous 118 est du texte ; dilaté, il emporte son anticrénelage.
  — UN TITRE DE PLANCHE est une bande de texte LOIN sous la rangée d'avant,
    quand une bande de noms la suit de quelques dizaines de pixels.
  — UN LIBELLÉ DE MARGE (« Raquettes », « Roues »…) CHEVAUCHE verticalement sa
    rangée de dessins, au lieu d'être dessous.
Les cellules viennent ensuite des NOMS : chaque nom donne son abscisse, et
chaque morceau de dessin de la rangée va au nom le plus proche — deux dessins
qui se touchent se partagent ainsi sans se couper.

Le compte trouvé doit ÉGALER le compte des noms lus sur la planche, sinon rien
n'est écrit.

    python3 scripts/decouper-icones-sports.py
(il faut Pillow et numpy.)
"""
from pathlib import Path
import unicodedata

import numpy as np
from PIL import Image, ImageFilter

SOURCE = Path.home() / "Desktop/GLOW/Images-pour-claude/icones/sportv3"
# `sportv2` n'est plus lue : sa planche de « Ballon et balles » a servi une
# demi-heure, le temps qu'elle dépose `balles.png` dans `sportv3` (2026-09-26,
# « catégorie balles : refait tout, les icones sont KO à part bowling », puis
# « ajouté à l'instant : balles.png / dans sportv3 »). La sienne n'a pas de
# nuages, comme le reste de `sportv3`.
SORTIE = Path(__file__).resolve().parent.parent / "src/assets/images/activites"

ENCRE = 25
ALPHA_BAS, ALPHA_HAUT = 28, 58
TEXTE_BLEU, TEXTE_VERT = 190, 118
PAS = 4
COTE = 192
MARGE = 0.05

# Quand le découpage automatique se trompe, on lui dit le nombre de dessins
# PAR RANGÉE. La planche des activités aquatiques en a besoin : deux de ses
# dessins se touchent, et l'automatique n'en voyait que seize sur dix-sept.
RANGEES = {
    # « Ballon et balles » : 5, 5, 6, 4.
    "balles.png": [5, 5, 6, 4],
    # Raquettes (6), Roues (3), Pédestre (5), Cheval (3). Sans ce compte,
    # deux paires de raquettes se touchaient, la première rangée était
    # coupée en quatre et TOUT GLISSAIT de deux crans (2026-09-26, sa
    # capture : « erreur au decoupage » — le vélo portait une raquette).
    "ChatGPT Image 26 sept. 2026, 15_10_30.png": [6, 3, 5, 3],
    "ChatGPT Image 26 sept. 2026, 15_12_48.png": [6, 5, 6],
}

PLANCHES = {
    # Sa planche de « Ballon et balles ». Les noms sont ceux des nœuds de
    # l'arbre, pas ceux écrits sous les dessins (« Baseball » et « Softball »
    # y sont deux dessins pour UN seul nœud, « Softball et baseball » : le
    # second est ignoré ; « Bowling » a sa propre image).
    "balles.png": [
        "Basket-ball", "Football", "Football américain", "Rugby", "Handball",
        "Hockey", "Volley-ball", "Softball et baseball", None, "Golf",
        "Croquet", "Pétanque, boulingrin, bocce, en extérieur",
        "Cricket, batteur, lanceur, chasseur", "Kickball", "Crosse (lacrosse)",
        "Netball",
        "Pelote basque (jai alai)", "Hacky sack", "Jonglage", "Curling",
    ],
    "ChatGPT Image 26 sept. 2026, 15_10_30.png": [
        "Badminton", "Tennis", "Squash", "Racquetball", "Paddleball",
        "Tennis de table, ping-pong (Taylor Code 410)",
        "Vélo", "Roller", "Skateboard",
        "Marche", "Randonnée", None, "Course à pied", "Athlétisme",
        "Équitation", "Rodéo", "Polo, à cheval",
    ],
    "ChatGPT Image 26 sept. 2026, 15_11_53.png": [
        "Yoga", "Pilates", "Callisthénie", "Cardio", "Aérobic", "Vélo elliptique",
        "Rameur", "Muscu", "Danse", "Zumba", "Corde à sauter", "Trampoline",
        "Boxe", "Arts martiaux", "Escrime", "Escalade", "Frisbee",
        "Gymnastique, en général",
        "Lutte, en compétition (un combat = 5 minutes)",
        "Parachutisme, base jump, saut à l’élastique",
        "Tir à l’arc (hors chasse)",
        "Fléchettes, murales ou sur gazon",
    ],
    "ChatGPT Image 26 sept. 2026, 15_12_48.png": [
        "Natation", "Plongée", "Aquagym", "Course aquatique", "Marche aquatique",
        "Vélo aquatique",
        "Canoë, kayak et aviron", "Voile", "Surf", "Stand up paddle",
        "Planche à voile",
        "Plongeon, tremplin ou plateforme", "Water-polo", "Volley-ball aquatique",
        "Pédalo", "Ski nautique ou wakeboard (Taylor Code 220)",
        "Tubing, descente d’une rivière en flottant sur une bouée, en général",
    ],
    "ChatGPT Image 26 sept. 2026, 15_18_09.png": [
        "Patinage", "Ski", "Raquettes à neige", "Motoneige", "Alpinisme",
        "Saut à ski, montée en portant les skis",
        "Luge, toboggan, bobsleigh, luge de compétition (Taylor Code 370)",
        "Chasse et pêche", "Ménage et entretien de la maison", "Jardinage",
        "Bricolage", "Entretien automobile", "Entretien de bateau",
        "Pratique musicale", "Escalier",
    ],
    "ChatGPT Image 26 sept. 2026, 15_13_45.png": [
        "cat:pedestre", "cat:cheval", "cat:roues",
        "cat:aquatiques", "cat:hivernales", "cat:autre",
    ],
    "ChatGPT Image 26 sept. 2026, 14_37_08.png": ["Bowling"],
    "ChatGPT Image 26 sept. 2026, 15_05_11.png": ["cat:raquettes"],
    "ChatGPT Image 26 sept. 2026, 15_06_14.png": ["cat:ballon-et-balles"],
    "ChatGPT Image 26 sept. 2026, 15_08_35.png": ["cat:individuel"],
}


def slug(nom: str) -> str:
    """Le slug d'un nom d'activité — le même que `domaine/activites.ts`."""
    sans = unicodedata.normalize("NFD", nom)
    sans = "".join(c for c in sans if unicodedata.category(c) != "Mn")
    sortie = "".join(c if c.isalnum() else "-" for c in sans.lower())
    return "-".join(m for m in sortie.split("-") if m)


def dilater(masque, rayon):
    image = Image.fromarray((masque * 255).astype(np.uint8), "L")
    return np.array(image.filter(ImageFilter.MaxFilter(rayon))) > 128


def bandes(profil, creux):
    """Les suites d'indices pleins, en (début, fin), qu'un creux sépare."""
    suites, debut, vide = [], None, 0
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


def morceaux(carte):
    """Les composantes connexes d'une carte booléenne, en boîtes."""
    h, l = carte.shape
    vu = np.zeros((h, l), dtype=bool)
    boites = []
    for y0 in range(h):
        for x0 in range(l):
            if not carte[y0, x0] or vu[y0, x0]:
                continue
            file = deque([(y0, x0)])
            vu[y0, x0] = True
            hmin = hmax = y0
            lmin = lmax = x0
            while file:
                y, x = file.popleft()
                hmin, hmax = min(hmin, y), max(hmax, y)
                lmin, lmax = min(lmin, x), max(lmax, x)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        v, u = y + dy, x + dx
                        if 0 <= v < h and 0 <= u < l and carte[v, u] and not vu[v, u]:
                            vu[v, u] = True
                            file.append((v, u))
            boites.append((lmin, lmax, hmin, hmax))
    return boites


def cartes(a):
    """La carte des dessins et celle du texte, séparées par la couleur."""
    ecart = np.abs(a.astype(int) - 255).max(axis=2)
    encre = ecart > ENCRE
    # Le texte est bleu nuit, les dessins bleu vif : dilaté, le texte emporte
    # son anticrénelage et ne compte plus comme dessin.
    texte = dilater(encre & (a[:, :, 2] < TEXTE_BLEU) & (a[:, :, 1] < TEXTE_VERT), 9)
    return encre & ~texte, texte


def rangees_de_dessins(a):
    """Les bandes de lignes où il y a des dessins, et la carte des dessins."""
    dessins, _ = cartes(a)
    return dessins, bandes(dessins.any(axis=1), creux=12)


def colonnes_de_rangee(dessins, haut, bas, combien):
    """Les boîtes des `combien` dessins d'une rangée.

    UN DESSIN EST FAIT DE PIÈCES DÉTACHÉES (une raquette, un volant et une
    balle font trois morceaux) : on ne les compte pas une à une, on coupe la
    rangée aux CREUX VERTICAUX. Le creux juste se cherche — trop petit, un
    dessin se coupe en deux ; trop grand, deux voisins se collent. On essaie
    de l'étroit au large et on garde celui qui donne le compte attendu."""
    profil = dessins[haut : bas + 1].any(axis=0)
    meilleur = None
    for creux in range(4, 141, 2):
        parts = [(g, d) for g, d in bandes(profil, creux=creux) if d - g > 16]
        if len(parts) == combien:
            meilleur = parts
            break
    if meilleur is None:
        return None
    boites = []
    for g, d in meilleur:
        colonne = dessins[haut : bas + 1, g : d + 1]
        lignes = np.where(colonne.any(axis=1))[0]
        boites.append((g, d, haut + int(lignes.min()), haut + int(lignes.max())))
    return boites


def par_les_noms(dessins, texte, haut, bas, combien):
    """Couper une rangée AUX NOMS écrits dessous, quand les dessins se
    touchent (le water-polo et le volley-ball de la planche aquatique le
    font, et le plongeoir du plongeon se détache de son plongeur).

    On ne rattache pas chaque morceau à un nom — un dessin peut n'en avoir
    aucun de son côté : ON COUPE LA RANGÉE AUX MILIEUX entre deux noms
    voisins. Chaque tranche est un dessin."""
    suite = [b for b in bandes(texte.any(axis=1), creux=12) if b[0] > bas and b[0] - bas < 90]
    if not suite:
        return None
    hn, bn = suite[0]
    colonnes = bandes(texte[hn : bn + 1].any(axis=0), creux=24)
    if len(colonnes) != combien:
        return None
    centres = [(g + d) / 2 for g, d in colonnes]
    frontieres = [0] + [int((centres[i] + centres[i + 1]) / 2) for i in range(combien - 1)] + [dessins.shape[1]]
    boites = []
    for i in range(combien):
        tranche = dessins[haut : bas + 1, frontieres[i] : frontieres[i + 1]]
        if not tranche.any():
            return None
        lignes = np.where(tranche.any(axis=1))[0]
        cols = np.where(tranche.any(axis=0))[0]
        boites.append((frontieres[i] + int(cols.min()), frontieres[i] + int(cols.max()),
                       haut + int(lignes.min()), haut + int(lignes.max())))
    return boites


def cellules(a, noms, par_rangee=None):
    """Les boîtes des dessins d'une planche, dans l'ordre de lecture.

    Le nombre de dessins attendu par rangée n'est pas dit : on essaie de
    répartir `len(noms)` sur les rangées trouvées, la dernière prenant le
    reste. Une planche à une seule icône prend tout d'un bloc."""
    dessins, texte = cartes(a)
    rangees = bandes(dessins.any(axis=1), creux=12)
    if not rangees:
        return []
    if len(noms) == 1:
        lignes = np.where(dessins.any(axis=1))[0]
        colonnes = np.where(dessins.any(axis=0))[0]
        return [(int(colonnes.min()), int(colonnes.max()), int(lignes.min()), int(lignes.max()))]
    # Combien de dessins par rangée : dit par `RANGEES` quand l'automatique
    # se trompe, cherché sinon — rangée par rangée, le découpage qui laisse
    # assez de place aux rangées suivantes.
    trouvees = []
    reste = len(noms)
    for i, (haut, bas) in enumerate(rangees):
        if par_rangee:
            if i >= len(par_rangee):
                return []
            boites = colonnes_de_rangee(dessins, haut, bas, par_rangee[i])
            if not boites:
                boites = par_les_noms(dessins, texte, haut, bas, par_rangee[i])
        else:
            rangees_restantes = len(rangees) - i - 1
            boites = None
            for combien in range(min(reste - rangees_restantes, 12), 0, -1):
                boites = colonnes_de_rangee(dessins, haut, bas, combien)
                if boites:
                    break
        if not boites:
            return []
        trouvees.extend(boites)
        reste -= len(boites)
    return trouvees


def detourer(vignette):
    """Le dessin SANS son fond, SES COULEURS GARDÉES — on ne redessine pas."""
    rgb = np.array(vignette.convert("RGB"))
    ecart = np.abs(rgb.astype(int) - 255).max(axis=2)
    alpha = np.clip((ecart - ALPHA_BAS) * 255 / (ALPHA_HAUT - ALPHA_BAS), 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, alpha]), "RGBA")


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
    total, refusees = 0, []
    for fichier, noms in PLANCHES.items():
        chemin = SOURCE / fichier
        if not chemin.exists():
            print(f"  MANQUE la planche {fichier[-14:]}")
            continue
        planche = Image.open(chemin).convert("RGB")
        trouvees = cellules(np.array(planche), noms, RANGEES.get(fichier))
        if len(trouvees) != len(noms):
            print(f"  ⚠ {fichier[-14:]} : {len(trouvees)} dessins pour {len(noms)} noms — rien écrit")
            refusees.append(fichier[-14:])
            continue
        for (g, d, h, b), nom in zip(trouvees, noms):
            if nom is None:
                continue
            m = 8
            vignette = planche.crop((max(0, g - m), max(0, h - m), min(planche.width, d + m), min(planche.height, b + m)))
            image = au_carre(detourer(vignette))
            cible = SORTIE / f"{nom[4:]}.png" if nom.startswith("cat:") else SORTIE / "sports" / f"{slug(nom)}.png"
            image.save(cible, optimize=True)
            total += 1
        print(f"  {fichier[-14:]} : {len(trouvees)} découpés")
    print(f"\n  {total} icônes écrites dans {SORTIE}")
    if refusees:
        print("  planches à revoir :", ", ".join(refusees))


if __name__ == "__main__":
    main()
