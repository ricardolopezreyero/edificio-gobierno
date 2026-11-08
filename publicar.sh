#!/bin/bash
# RLR · Copia los documentos y los parámetros a sitio/ y publica en edificio.capitaltorreon.com
set -e
cd "$(dirname "$0")"
cp PROYECTO.md PROMPT.md ORIGEN.md sitio/
cp modelo/parametros.json sitio/parametros.json
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID npx wrangler deploy
