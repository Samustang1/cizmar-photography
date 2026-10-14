#!/usr/bin/env bash
#
# deploy.sh — jednoduché nasadenie webu na server
# Cizmar Photography · ukážkový skript
#
set -euo pipefail

ZDROJ="${1:-./build}"
CIEL="${2:-user@server:/var/www/cizmar}"

echo "-> Kontrolujem zdrojový priečinok..."
test -d "$ZDROJ" || { echo "Chýba priečinok: $ZDROJ"; exit 1; }

echo "-> Nahrávam súbory na server..."
rsync -avz --delete "$ZDROJ/" "$CIEL/"

echo "-> Hotovo. Web je nasadený z '$ZDROJ' na '$CIEL'."
