#!/bin/sh
# LE GLING DE LA CONFIRMATION, RENDU EN FICHIER (2026-09-22, « joue 7 :petite
# cloche a chaque page de confirmation ») : la simulation « quatre notes »
# jouait une seule frappe transposée quatre fois (playbackRate — la hauteur
# et la durée changent ensemble) sur mi5 · sol#5 · si5 · mi6, la première
# douce et la dernière pleine (0,62 / 0,75 / 0,88 / 1), une note tous les
# 90 ms — les réglages de la page tels qu'elle les a écoutés. `asetrate`
# fait exactement ce que faisait playbackRate.
#
# La frappe : « Small Bell #2 » de steffcaffrey (Freesound 452379, CC0),
# l'aperçu public rogné à sa première frappe et mesuré à 4 032 Hz ; gardé
# hors du dépôt avec l'enregistrement de la roue,
# `../son-pour-claude/petite-cloche-frappe.mp3`. Le rendu est coupé au
# silence et normalisé à 0,9 de crête comme les autres sons du catalogue.
#
#     sh scripts/rendre-petite-cloche.sh
set -e
ICI=$(cd "$(dirname "$0")/.." && pwd)
FRAPPE="$ICI/../son-pour-claude/petite-cloche-frappe.mp3"
SORTIE="$ICI/src/assets/sons/petite-cloche-1.wav"
F0=4032
note() { python3 -c "print(f'{$1/$F0:.6f}')"; }
FILTRE="[0:a]asetrate=44100*$(note 659.26),aresample=44100,volume=0.62,adelay=0|0[n0];\
[0:a]asetrate=44100*$(note 830.61),aresample=44100,volume=0.75,adelay=90|90[n1];\
[0:a]asetrate=44100*$(note 987.77),aresample=44100,volume=0.88,adelay=180|180[n2];\
[0:a]asetrate=44100*$(note 1318.51),aresample=44100,volume=1,adelay=270|270[n3];\
[n0][n1][n2][n3]amix=inputs=4:normalize=0[out]"
BRUT=$(mktemp -t petite-cloche).wav
ffmpeg -v error -y -i "$FRAPPE" -filter_complex "$FILTRE" -map "[out]" -ac 1 -ar 44100 -c:a pcm_s16le "$BRUT"
python3 - "$BRUT" "$SORTIE" <<'PY'
import sys, wave, array
brut, sortie = sys.argv[1], sys.argv[2]
with wave.open(brut, 'rb') as w:
    assert w.getnchannels() == 1 and w.getsampwidth() == 2 and w.getframerate() == 44100
    d = array.array('h', w.readframes(w.getnframes()))
crete = max(abs(v) for v in d) or 1
fin = len(d)
while fin > 1 and abs(d[fin - 1]) < crete / 1000: fin -= 1
fin = min(len(d), fin + 44)
gain = 0.9 * 32767 / crete
out = array.array('h', (max(-32767, min(32767, round(v * gain))) for v in d[:fin]))
with wave.open(sortie, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100); w.writeframes(out.tobytes())
print(f"{sortie} : {fin / 44100:.2f} s, crête {crete / 32767:.3f} → 0,9")
PY
rm -f "$BRUT"
