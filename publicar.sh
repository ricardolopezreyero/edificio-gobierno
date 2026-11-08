#!/bin/bash
# RLR · Valida los parámetros, copia documentos y datos a sitio/ y publica en edificio.capitaltorreon.com
set -e
cd "$(dirname "$0")"
node modelo/validar.mjs
cp PROYECTO.md PROMPT.md ORIGEN.md sitio/
cp modelo/parametros.json modelo/recorridos.json sitio/
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID npx wrangler deploy
