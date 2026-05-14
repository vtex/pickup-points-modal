#!/usr/bin/env bash
# common.sh — funções compartilhadas pelos scripts do SpecKit.
# Source nos demais scripts:  . "$(dirname "$0")/common.sh"

set -euo pipefail

# Diretório raiz do repo (resolve mesmo se o script foi chamado de outro CWD)
repo_root() {
  git rev-parse --show-toplevel
}

# Diretório onde as specs locais vivem (ignorado pelo git)
specs_dir() {
  printf "%s/specs" "$(repo_root)"
}

# Diretório de estado do SpecKit
specify_dir() {
  printf "%s/.specify" "$(repo_root)"
}

# Slugifica um título: "Add awesome feature!" -> "add-awesome-feature"
slugify() {
  printf "%s" "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

# Imprime no stderr e sai com erro
die() {
  printf "error: %s\n" "$*" >&2
  exit 1
}

# Garante que o working tree está limpo (sem alterações pendentes)
require_clean_tree() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    die "working tree não está limpo — commit ou stash antes"
  fi
}

# Garante que o arquivo existe; senão morre
require_file() {
  [ -f "$1" ] || die "arquivo obrigatório ausente: $1"
}
