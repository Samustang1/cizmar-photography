#!/usr/bin/env python3
"""rename.py — hromadné premenovanie fotiek z fotenia.

Cizmar Photography · ukážkový skript

Použitie:
    python rename.py ./fotky poprad
"""
from __future__ import annotations

import sys
from pathlib import Path

PRIECINOK = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("fotky")
PREFIX = sys.argv[2] if len(sys.argv) > 2 else "poprad"

KONCOVKY = {".jpg", ".jpeg", ".png", ".webp"}


def main() -> None:
    if not PRIECINOK.is_dir():
        raise SystemExit(f"Priečinok neexistuje: {PRIECINOK}")

    fotky = sorted(
        p for p in PRIECINOK.iterdir()
        if p.suffix.lower() in KONCOVKY
    )

    for poradie, foto in enumerate(fotky, start=1):
        novy_nazov = PRIECINOK / f"{PREFIX}_{poradie:04d}{foto.suffix.lower()}"
        foto.rename(novy_nazov)
        print(f"{foto.name} -> {novy_nazov.name}")

    print(f"Hotovo. Premenovaných: {len(fotky)}")


if __name__ == "__main__":
    main()
