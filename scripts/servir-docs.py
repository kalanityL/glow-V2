#!/usr/bin/env python3
"""Sert docs/ en disant son encodage.

Le serveur de la bibliothèque standard annonce « text/markdown » tout court
pour un .md, sans charset. Le navigateur retombe alors sur du Latin-1 et
affiche « SpÃ©cification » au lieu de « Spécification » (vu le 2026-09-13 :
« pkoi synthese abstraite ressemble à ça ? »). Les pages HTML échappaient au
défaut parce qu'elles portent leur <meta charset> à l'intérieur ; un fichier
Markdown n'a nulle part où le mettre, c'est donc au serveur de le dire.

Emploi : python3 scripts/servir-docs.py [port]   (3003 par défaut)
"""

import functools
import http.server
import os
import socketserver
import sys

DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')

# Tout ce qui est du texte ici est de l'UTF-8, sans exception.
TEXTE = ('.md', '.html', '.htm', '.css', '.js', '.mjs', '.json', '.txt', '.svg', '.csv')


class Handler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        type_ = super().guess_type(path)
        # Le type peut déjà porter un charset (le cas du HTML selon les
        # versions) : on ne le dédouble pas.
        if path.lower().endswith(TEXTE) and 'charset=' not in type_:
            return f'{type_}; charset=utf-8'
        return type_

    def end_headers(self):
        # Les pages sont réengendrées souvent ; un cache ferait relire une
        # version périmée sans qu'on comprenne pourquoi.
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass


class Serveur(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3003
    handler = functools.partial(Handler, directory=os.path.normpath(DOCS))
    with Serveur(('127.0.0.1', port), handler) as httpd:
        print(f'docs servi sur http://localhost:{port}/ — UTF-8 annoncé')
        httpd.serve_forever()
