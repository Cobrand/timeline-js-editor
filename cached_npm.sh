#!/usr/bin/env sh
set -euo pipefail
IFS=$'\n\t'

CACHE_FILE=/tmp/npm-cache.tar

if [ -f $CACHE_FILE ]; then
    tar xf $CACHE_FILE
    npm prune
fi

npm install --silent

tar cf $CACHE_FILE node_modules
