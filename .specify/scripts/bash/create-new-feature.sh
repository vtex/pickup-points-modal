#!/usr/bin/env bash
# create-new-feature.sh <slug-or-title>
# Cria a estrutura specs/<slug>/ com spec.md a partir do template.

set -euo pipefail
. "$(dirname "$0")/common.sh"

[ $# -ge 1 ] || die "uso: $(basename "$0") <slug-or-title>"

slug="$(slugify "$1")"
[ -n "$slug" ] || die "slug inválido"

root="$(repo_root)"
target="$root/specs/$slug"

if [ -d "$target" ]; then
  die "feature já existe: specs/$slug"
fi

mkdir -p "$target"
cp "$root/.specify/templates/spec-template.md" "$target/spec.md"

# Marca feature ativa em .specify/feature.json (ignorado pelo git)
mkdir -p "$root/.specify"
printf '{"slug":"%s","created":"%s"}\n' "$slug" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  > "$root/.specify/feature.json"

printf "criado: specs/%s/spec.md\n" "$slug"
printf "feature ativa: %s\n" "$slug"
